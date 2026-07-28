import {
  DEFAULT_PATTERN_PAGE_SIZE,
  MAX_PATTERN_ROUTES,
  getPatternSitemapCount,
} from '@/lib/patternGenerator'

const SITE_URL = 'https://unscramblehq.com'
const PUBLISHED_PATTERN_LIMIT = 160_000

export const revalidate = 604800

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const publishedLimit = Math.min(
    PUBLISHED_PATTERN_LIMIT,
    MAX_PATTERN_ROUTES
  )

  const sitemapCount = getPatternSitemapCount(
    publishedLimit,
    DEFAULT_PATTERN_PAGE_SIZE
  )

  const today = new Date()
    .toISOString()
    .split('T')[0]

  const entries = Array.from(
    { length: sitemapCount },
    (_, index) => {
      const sitemapNumber = index + 1
      const location =
        `${SITE_URL}/pattern-sitemaps/${sitemapNumber}`

      return [
        '  <sitemap>',
        `    <loc>${escapeXml(location)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
      ].join('\n')
    }
  ).join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</sitemapindex>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type':
        'application/xml; charset=utf-8',
      'Cache-Control':
        'public, s-maxage=604800, stale-while-revalidate=86400',
    },
  })
}