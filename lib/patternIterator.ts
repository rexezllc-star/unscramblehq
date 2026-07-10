import { getPatternIndex } from '@/lib/patternIndex'
import type {
  PatternChunk,
  PatternIndexEntry,
  PatternRoute,
  PatternRouteType,
} from '@/lib/patternTypes'

export const DEFAULT_PATTERN_PAGE_SIZE = 5000
export const MAX_PATTERN_ROUTES = 160_000

let rankedRouteCache: PatternRoute[] | null = null

const HIGH_VALUE_PATTERNS = new Set([
  'ing',
  'tion',
  'ment',
  'ness',
  'able',
  'less',
  'ous',
  'ful',
  'ly',
  'er',
  'ed',
  'pre',
  're',
  'un',
  'st',
  'th',
  'qu',
  'ch',
  'sh',
  'str',
  'ough',
  'ph',
  'wh',
  'ck',
  'ee',
  'oo',
  'ai',
  'ea',
])

function buildSlug(
  type: PatternRouteType,
  length: number,
  letters: string
): string {
  switch (type) {
    case 'length-starts-with':
      return `${length}-letter-words-starting-with-${letters}`

    case 'length-ends-with':
      return `${length}-letter-words-ending-in-${letters}`

    case 'length-contains':
      return `${length}-letter-words-containing-${letters}`
  }
}

function typePriority(type: PatternRouteType): number {
  switch (type) {
    case 'length-ends-with':
      return 30

    case 'length-starts-with':
      return 25

    case 'length-contains':
      return 20
  }
}

function calculateRouteScore(
  entry: PatternIndexEntry
): number {
  const patternLengthBonus =
    Math.min(entry.letters.length, 7) * 8

  const matchCountScore =
    Math.log2(entry.matchCount + 1) * 20

  const highValueBonus = HIGH_VALUE_PATTERNS.has(
    entry.letters
  )
    ? 100
    : 0

  const usefulLengthBonus =
    entry.length >= 4 && entry.length <= 10
      ? 20
      : 5

  return Math.round(
    typePriority(entry.type) +
      patternLengthBonus +
      matchCountScore +
      highValueBonus +
      usefulLengthBonus
  )
}

function toPatternRoute(
  entry: PatternIndexEntry
): PatternRoute {
  return {
    ...entry,
    slug: buildSlug(
      entry.type,
      entry.length,
      entry.letters
    ),
    score: calculateRouteScore(entry),
  }
}

export function getRankedPatternRoutes(
  limit = MAX_PATTERN_ROUTES
): PatternRoute[] {
  if (!rankedRouteCache) {
    const seen = new Set<string>()
    const routes: PatternRoute[] = []

    for (const entry of getPatternIndex()) {
      const route = toPatternRoute(entry)

      if (seen.has(route.slug)) {
        continue
      }

      seen.add(route.slug)
      routes.push(route)
    }

    routes.sort(
      (a, b) =>
        b.score - a.score ||
        b.matchCount - a.matchCount ||
        a.slug.localeCompare(b.slug)
    )

    rankedRouteCache = routes
  }

  const safeLimit = Math.max(
    0,
    Math.min(
      Math.floor(limit),
      rankedRouteCache.length
    )
  )

  return rankedRouteCache.slice(0, safeLimit)
}

export function getPatternRouteCount(): number {
  return getRankedPatternRoutes(
    Number.MAX_SAFE_INTEGER
  ).length
}

export function getPatternChunk(
  page: number,
  pageSize = DEFAULT_PATTERN_PAGE_SIZE,
  routeLimit = MAX_PATTERN_ROUTES
): PatternChunk {
  const safePage = Math.max(1, Math.floor(page))
  const safePageSize = Math.max(
    1,
    Math.min(50_000, Math.floor(pageSize))
  )

  const routes = getRankedPatternRoutes(routeLimit)
  const totalRoutes = routes.length
  const totalPages = Math.max(
    1,
    Math.ceil(totalRoutes / safePageSize)
  )

  const start = (safePage - 1) * safePageSize
  const end = start + safePageSize

  return {
    page: safePage,
    pageSize: safePageSize,
    totalRoutes,
    totalPages,
    routes: routes.slice(start, end),
  }
}

export function getPatternSitemapCount(
  routeLimit = MAX_PATTERN_ROUTES,
  pageSize = DEFAULT_PATTERN_PAGE_SIZE
): number {
  const totalRoutes = Math.min(
    getPatternRouteCount(),
    routeLimit
  )

  return Math.ceil(totalRoutes / pageSize)
}

export function clearPatternIteratorCache(): void {
  rankedRouteCache = null
}