import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, 'analytics-source')
const OUTPUT_DIR = path.join(ROOT, 'data', 'admin')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'analytics.json')

const SOURCE_FILES = {
  chart: 'Chart.csv',
  queries: 'Queries.csv',
  pages: 'Pages.csv',
  countries: 'Countries.csv',
  devices: 'Devices.csv',
  searchAppearance: 'Search appearance.csv',
  filters: 'Filters.csv',
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

function parseNumber(value) {
  if (typeof value === 'number') return value

  const normalized = String(value ?? '')
    .replace(/,/g, '')
    .replace(/%/g, '')
    .trim()

  if (!normalized) return 0

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function readCsv(filename) {
  const fullPath = path.join(SOURCE_DIR, filename)

  if (!fs.existsSync(fullPath)) {
    console.warn(`Skipping missing analytics file: ${filename}`)
    return []
  }

  const content = fs.readFileSync(fullPath, 'utf8')

  return parse(content, {
    columns: (headers) => headers.map(normalizeHeader),
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    trim: true,
  })
}

function pick(row, candidates) {
  for (const key of candidates) {
    if (row[key] !== undefined && row[key] !== '') {
      return row[key]
    }
  }

  return ''
}

function normalizeMetricRow(row, dimensionKeys) {
  return {
    dimension: String(pick(row, dimensionKeys)),
    clicks: parseNumber(pick(row, ['clicks'])),
    impressions: parseNumber(pick(row, ['impressions'])),
    ctr: parseNumber(pick(row, ['ctr'])),
    position: parseNumber(
      pick(row, ['position', 'average_position', 'avg_position'])
    ),
  }
}

function normalizeDailyRow(row) {
  return {
    date: String(pick(row, ['date', 'day'])),
    clicks: parseNumber(pick(row, ['clicks'])),
    impressions: parseNumber(pick(row, ['impressions'])),
    ctr: parseNumber(pick(row, ['ctr'])),
    position: parseNumber(
      pick(row, ['position', 'average_position', 'avg_position'])
    ),
  }
}

function sum(rows, field) {
  return rows.reduce((total, row) => {
    return total + parseNumber(row[field])
  }, 0)
}

function weightedAverage(rows, valueField, weightField) {
  let weightedTotal = 0
  let totalWeight = 0

  for (const row of rows) {
    const value = parseNumber(row[valueField])
    const weight = parseNumber(row[weightField])

    if (weight <= 0) continue

    weightedTotal += value * weight
    totalWeight += weight
  }

  return totalWeight > 0 ? weightedTotal / totalWeight : 0
}

function round(value, decimals = 2) {
  const multiplier = 10 ** decimals
  return Math.round(value * multiplier) / multiplier
}

function sortByImpressions(rows) {
  return [...rows].sort((a, b) => {
    return (
      b.impressions - a.impressions ||
      b.clicks - a.clicks ||
      a.dimension.localeCompare(b.dimension)
    )
  })
}

function sortDaily(rows) {
  return [...rows].sort((a, b) => {
    const aTime = Date.parse(a.date)
    const bTime = Date.parse(b.date)

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      return a.date.localeCompare(b.date)
    }

    return aTime - bTime
  })
}

function cleanDimensions(rows) {
  return rows.filter((row) => row.dimension.trim().length > 0)
}

const raw = {
  chart: readCsv(SOURCE_FILES.chart),
  queries: readCsv(SOURCE_FILES.queries),
  pages: readCsv(SOURCE_FILES.pages),
  countries: readCsv(SOURCE_FILES.countries),
  devices: readCsv(SOURCE_FILES.devices),
  searchAppearance: readCsv(SOURCE_FILES.searchAppearance),
  filters: readCsv(SOURCE_FILES.filters),
}

const daily = sortDaily(raw.chart.map(normalizeDailyRow))

const queries = cleanDimensions(
  sortByImpressions(
    raw.queries.map((row) =>
      normalizeMetricRow(row, [
        'top_queries',
        'query',
        'queries',
      ])
    )
  )
)

const pages = cleanDimensions(
  sortByImpressions(
    raw.pages.map((row) =>
      normalizeMetricRow(row, [
        'top_pages',
        'page',
        'pages',
      ])
    )
  )
)

const countries = cleanDimensions(
  sortByImpressions(
    raw.countries.map((row) =>
      normalizeMetricRow(row, [
        'country',
        'countries',
      ])
    )
  )
)

const devices = cleanDimensions(
  sortByImpressions(
    raw.devices.map((row) =>
      normalizeMetricRow(row, [
        'device',
        'devices',
      ])
    )
  )
)

const searchAppearance = cleanDimensions(
  sortByImpressions(
    raw.searchAppearance.map((row) =>
      normalizeMetricRow(row, [
        'search_appearance',
        'appearance',
        'searchappearance',
      ])
    )
  )
)

const totalClicks = sum(daily, 'clicks')
const totalImpressions = sum(daily, 'impressions')

const summary = {
  clicks: totalClicks,
  impressions: totalImpressions,
  ctr:
    totalImpressions > 0
      ? round((totalClicks / totalImpressions) * 100)
      : 0,
  averagePosition: round(
    weightedAverage(daily, 'position', 'impressions')
  ),
  queryCount: queries.length,
  pageCount: pages.length,
  countryCount: countries.length,
  reportingDays: daily.length,
}

const analytics = {
  generatedAt: new Date().toISOString(),
  source: 'Google Search Console CSV export',
  summary,
  daily,
  queries: queries.slice(0, 100),
  pages: pages.slice(0, 100),
  countries: countries.slice(0, 100),
  devices,
  searchAppearance,
  filters: raw.filters,
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(analytics, null, 2),
  'utf8'
)

console.log(`Analytics data written to: ${OUTPUT_FILE}`)
console.log('Summary:', summary)