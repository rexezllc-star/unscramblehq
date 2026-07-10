import {
  DEFAULT_PATTERN_PAGE_SIZE,
  MAX_PATTERN_ROUTES,
  getPatternChunk,
} from '@/lib/patternGenerator'

const SITE_URL = 'https://unscramblehq.com'
const PUBLISHED_PATTERN_LIMIT = 160_000

export const revalidate = 604800

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function xmlResponse(
  body: string,
  status = 200
): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type':
        'application/xml; charset=utf-8',
      'Cache-Control':
        'public, s-maxage=604800, stale-while-revalidate=86400',
    },
  })
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params
  const page = Number(id)

  if (
    !Number.isInteger(page) ||
    page < 1
  ) {
    return xmlResponse(
      '<?xml version="1.0" encoding="UTF-8"?><error>Invalid sitemap ID</error>',
      404
    )
  }

  const chunk = getPatternChunk(
    page,
    DEFAULT_PATTERN_PAGE_SIZE,
    Math.min(
      PUBLISHED_PATTERN_LIMIT,
      MAX_PATTERN_ROUTES
    )
  )

  if (
    page > chunk.totalPages ||
    chunk.routes.length === 0
  ) {
    return xmlResponse(
      '<?xml version="1.0" encoding="UTF-8"?><error>Sitemap not found</error>',
      404
    )
  }

  const urls = chunk.routes
    .map((route) => {
      const location =
        `${SITE_URL}/pattern/${route.slug}`

      return [
        '  <url>',
        `    <loc>${escapeXml(location)}</loc>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n')

  return xmlResponse(xml)
}