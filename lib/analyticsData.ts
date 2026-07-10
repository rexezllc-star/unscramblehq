import analyticsJson from '@/data/admin/analytics.json'

export type AnalyticsMetricRow = {
  dimension: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type AnalyticsDailyRow = {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type AnalyticsSummary = {
  clicks: number
  impressions: number
  ctr: number
  averagePosition: number
  queryCount: number
  pageCount: number
  countryCount: number
  reportingDays: number
}

export type AnalyticsData = {
  generatedAt: string
  source: string
  summary: AnalyticsSummary
  daily: AnalyticsDailyRow[]
  queries: AnalyticsMetricRow[]
  pages: AnalyticsMetricRow[]
  countries: AnalyticsMetricRow[]
  devices: AnalyticsMetricRow[]
  searchAppearance: AnalyticsMetricRow[]
  filters: Record<string, unknown>[]
}

export function getAnalyticsData(): AnalyticsData {
  return analyticsJson as AnalyticsData
}