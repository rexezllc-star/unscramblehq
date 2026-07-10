import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAnalyticsData,
  type AnalyticsDailyRow,
  type AnalyticsMetricRow,
} from '@/lib/analyticsData'

export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'UnscrambleHQ Analytics',
  description: 'Internal performance and SEO analytics for UnscrambleHQ.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

const GENERATED_PAGE_COUNT = 8080
const TARGET_SITEMAP_URLS = 80000
const DISCOVERED_URLS = 58000

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`
}

function formatPosition(value: number) {
  return value > 0 ? value.toFixed(2) : '—'
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function getLatestActiveDay(daily: AnalyticsDailyRow[]) {
  return [...daily]
    .reverse()
    .find((row) => row.impressions > 0 || row.clicks > 0)
}

function getPreviousActiveDay(
  daily: AnalyticsDailyRow[],
  latest?: AnalyticsDailyRow
) {
  if (!latest) return undefined

  const activeRows = daily.filter(
    (row) => row.impressions > 0 || row.clicks > 0
  )

  const latestIndex = activeRows.findIndex(
    (row) => row.date === latest.date
  )

  if (latestIndex <= 0) return undefined

  return activeRows[latestIndex - 1]
}

function getChange(current: number, previous?: number) {
  if (!previous || previous === 0) return null

  return ((current - previous) / previous) * 100
}

function getGrowthInsights(
  queries: AnalyticsMetricRow[],
  pages: AnalyticsMetricRow[],
  latest?: AnalyticsDailyRow,
  previous?: AnalyticsDailyRow
) {
  const insights: string[] = []

  const impressionChange = getChange(
    latest?.impressions || 0,
    previous?.impressions
  )

  if (impressionChange !== null) {
    if (impressionChange > 0) {
      insights.push(
        `Daily impressions increased ${impressionChange.toFixed(
          1
        )}% on the latest active reporting day.`
      )
    } else if (impressionChange < 0) {
      insights.push(
        `Daily impressions decreased ${Math.abs(
          impressionChange
        ).toFixed(1)}% on the latest active reporting day.`
      )
    }
  }

  const nearPageOneQueries = queries.filter(
    (row) => row.position >= 8 && row.position <= 15
  )

  if (nearPageOneQueries.length) {
    insights.push(
      `${nearPageOneQueries.length} tracked queries are ranking between positions 8 and 15 and may benefit from stronger internal links.`
    )
  }

  const highImpressionLowCtr = pages.filter(
    (row) =>
      row.impressions >= 5 &&
      row.ctr < 1 &&
      row.position > 0 &&
      row.position <= 25
  )

  if (highImpressionLowCtr.length) {
    insights.push(
      `${highImpressionLowCtr.length} pages have impressions but CTR below 1%, suggesting title and description optimization opportunities.`
    )
  }

  const rankingPages = pages.filter(
    (row) => row.position > 0 && row.position <= 20
  )

  if (rankingPages.length) {
    insights.push(
      `${rankingPages.length} pages are already ranking inside the top 20 search results.`
    )
  }

  if (DISCOVERED_URLS < TARGET_SITEMAP_URLS) {
    insights.push(
      `Google has discovered approximately ${formatNumber(
        DISCOVERED_URLS
      )} of the ${formatNumber(
        TARGET_SITEMAP_URLS
      )} targeted sitemap URLs.`
    )
  }

  return insights.slice(0, 6)
}

export default function AnalyticsPage() {
  const analytics = getAnalyticsData()

  const latestDay = getLatestActiveDay(analytics.daily)
  const previousDay = getPreviousActiveDay(
    analytics.daily,
    latestDay
  )

  const dailyMaxImpressions = Math.max(
    ...analytics.daily.map((row) => row.impressions),
    1
  )

  const growthInsights = getGrowthInsights(
    analytics.queries,
    analytics.pages,
    latestDay,
    previousDay
  )

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-300">
                Internal Operations
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                UnscrambleHQ Command Center
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Search visibility, page discovery, audience activity,
                content opportunities, and platform health in one
                operating dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                View site
              </Link>

              <span className="rounded-2xl bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300">
                Data ready
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5 text-xs text-slate-400">
            Source: {analytics.source} · Generated{' '}
            {formatDate(analytics.generatedAt)}
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Clicks"
            value={formatNumber(analytics.summary.clicks)}
            detail={`${analytics.summary.reportingDays} reporting days`}
          />

          <SummaryCard
            label="Total Impressions"
            value={formatNumber(analytics.summary.impressions)}
            detail="Google Search visibility"
          />

          <SummaryCard
            label="CTR"
            value={formatPercent(analytics.summary.ctr)}
            detail="Clicks divided by impressions"
          />

          <SummaryCard
            label="Average Position"
            value={formatPosition(
              analytics.summary.averagePosition
            )}
            detail="Impression-weighted"
          />
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Queries"
            value={formatNumber(analytics.summary.queryCount)}
            detail="Distinct tracked searches"
          />

          <SummaryCard
            label="Visible Pages"
            value={formatNumber(analytics.summary.pageCount)}
            detail="Pages receiving impressions"
          />

          <SummaryCard
            label="Countries"
            value={formatNumber(analytics.summary.countryCount)}
            detail="International search reach"
          />

          <SummaryCard
            label="Generated Pages"
            value={formatNumber(GENERATED_PAGE_COUNT)}
            detail="Static production routes"
          />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Search Performance
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Daily impressions and clicks from the current Search
                  Console export.
                </p>
              </div>

              {latestDay ? (
                <div className="text-left text-xs text-slate-400 sm:text-right">
                  Latest active day
                  <span className="mt-1 block font-bold text-white">
                    {formatDate(latestDay.date)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex h-64 items-end gap-2 overflow-x-auto border-b border-white/10 pb-3">
              {analytics.daily.map((row) => {
                const barHeight = Math.max(
                  (row.impressions / dailyMaxImpressions) * 100,
                  row.impressions > 0 ? 4 : 1
                )

                return (
                  <div
                    key={row.date}
                    className="group flex min-w-10 flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-2 hidden rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                      {row.impressions} impressions · {row.clicks}{' '}
                      clicks
                    </div>

                    <div
                      className="w-full rounded-t-xl bg-indigo-400/80 transition group-hover:bg-indigo-300"
                      style={{ height: `${barHeight}%` }}
                    />

                    <span className="mt-2 text-[10px] text-slate-500">
                      {new Date(row.date).toLocaleDateString(
                        'en-US',
                        {
                          month: 'numeric',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MetricDetail
                label="Latest impressions"
                value={formatNumber(latestDay?.impressions || 0)}
              />

              <MetricDetail
                label="Latest clicks"
                value={formatNumber(latestDay?.clicks || 0)}
              />

              <MetricDetail
                label="Latest position"
                value={formatPosition(latestDay?.position || 0)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Platform Health</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Current production, sitemap, and discovery indicators.
            </p>

            <div className="mt-6 space-y-4">
              <HealthRow
                label="Production build"
                value="Healthy"
                status="good"
              />

              <HealthRow
                label="Generated pages"
                value={formatNumber(GENERATED_PAGE_COUNT)}
                status="good"
              />

              <HealthRow
                label="Sitemap target"
                value={formatNumber(TARGET_SITEMAP_URLS)}
                status="good"
              />

              <HealthRow
                label="Google-discovered URLs"
                value={`~${formatNumber(DISCOVERED_URLS)}`}
                status="warning"
              />

              <HealthRow
                label="Analytics dataset"
                value="Ready"
                status="good"
              />

              <HealthRow
                label="Vercel plan"
                value="Pro"
                status="good"
              />
            </div>

            <div className="mt-6">
              <ProgressBar
                label="Sitemap discovery progress"
                value={
                  (DISCOVERED_URLS / TARGET_SITEMAP_URLS) * 100
                }
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <DataTable
            title="Top Search Queries"
            description="Queries ordered by impressions."
            rows={analytics.queries.slice(0, 15)}
            dimensionLabel="Query"
          />

          <DataTable
            title="Top Landing Pages"
            description="Pages receiving the highest search visibility."
            rows={analytics.pages.slice(0, 15)}
            dimensionLabel="Page"
            linkDimensions
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <BreakdownPanel
            title="Countries"
            description="Top geographic markets by search impressions."
            rows={analytics.countries.slice(0, 12)}
          />

          <BreakdownPanel
            title="Devices"
            description="Search performance by device category."
            rows={analytics.devices}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-400/20 bg-indigo-400/10 p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-300">
            Growth Intelligence
          </p>

          <h2 className="mt-3 text-2xl font-black">
            Recommended Actions
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Automated observations generated from the current Search
            Console dataset.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {growthInsights.map((insight, index) => (
              <div
                key={`${insight}-${index}`}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
              >
                <span className="text-xs font-black uppercase tracking-widest text-indigo-300">
                  Insight {index + 1}
                </span>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 pb-8 text-center text-xs text-slate-500">
          UnscrambleHQ internal analytics · Not intended for public
          indexing
        </footer>
      </div>
    </main>
  )
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </div>
  )
}

function MetricDetail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-900/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  )
}

function HealthRow({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: 'good' | 'warning'
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900/70 px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === 'good'
              ? 'bg-emerald-400'
              : 'bg-amber-400'
          }`}
        />

        <span className="text-sm font-semibold text-slate-300">
          {label}
        </span>
      </div>

      <span className="text-sm font-black text-white">
        {value}
      </span>
    </div>
  )
}

function ProgressBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  const safeValue = Math.max(0, Math.min(value, 100))

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-400">{label}</span>
        <span className="font-black text-white">
          {safeValue.toFixed(1)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-400"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}

function DataTable({
  title,
  description,
  rows,
  dimensionLabel,
  linkDimensions = false,
}: {
  title: string
  description: string
  rows: AnalyticsMetricRow[]
  dimensionLabel: string
  linkDimensions?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="p-6">
        <h2 className="text-2xl font-black">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-y border-white/10 bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">{dimensionLabel}</th>
              <th className="px-4 py-4">Clicks</th>
              <th className="px-4 py-4">Impressions</th>
              <th className="px-4 py-4">CTR</th>
              <th className="px-4 py-4">Position</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.dimension}
                className="border-b border-white/5 last:border-0"
              >
                <td className="max-w-sm px-6 py-4 font-semibold text-slate-200">
                  {linkDimensions &&
                  row.dimension.startsWith('http') ? (
                    <a
                      href={row.dimension}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all hover:text-indigo-300"
                    >
                      {row.dimension}
                    </a>
                  ) : (
                    <span className="break-words">
                      {row.dimension}
                    </span>
                  )}
                </td>

                <td className="px-4 py-4 font-bold">
                  {formatNumber(row.clicks)}
                </td>

                <td className="px-4 py-4">
                  {formatNumber(row.impressions)}
                </td>

                <td className="px-4 py-4">
                  {formatPercent(row.ctr)}
                </td>

                <td className="px-4 py-4">
                  {formatPosition(row.position)}
                </td>
              </tr>
            ))}

            {!rows.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No analytics rows available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BreakdownPanel({
  title,
  description,
  rows,
}: {
  title: string
  description: string
  rows: AnalyticsMetricRow[]
}) {
  const maxImpressions = Math.max(
    ...rows.map((row) => row.impressions),
    1
  )

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-black">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        {rows.map((row) => {
          const width =
            (row.impressions / maxImpressions) * 100

          return (
            <div key={row.dimension}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold capitalize text-slate-200">
                  {row.dimension}
                </span>

                <span className="text-xs text-slate-500">
                  {formatNumber(row.impressions)} impressions
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}

        {!rows.length ? (
          <p className="text-sm text-slate-500">
            No breakdown data available.
          </p>
        ) : null}
      </div>
    </div>
  )
}