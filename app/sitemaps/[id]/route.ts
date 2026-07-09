import { getSitemapSeoInventory } from '@/lib/seoInventory'

const SITE_URL = 'https://www.unscramblehq.com'
const URLS_PER_SITEMAP = 5000

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getAllSeoPaths() {
  const inventory = getSitemapSeoInventory()

  const staticPages = [
    '',
    '/word-finder',
    '/anagram-solver',
    '/scrabble-word-finder',
    '/wordle-helper',
  ]

  const lengthPages = inventory.lengths.map(
    (length) => `/${length}-letter-words`
  )

  const startsWithPages = inventory.prefixes.map(
    (prefix) => `/words-starting-with-${prefix}`
  )

  const endingPages = inventory.suffixes.map(
    (suffix) => `/words-ending-in-${suffix}`
  )

  const containsPages = inventory.contains.map(
    (letters) => `/words-containing-${letters}`
  )

  const scrabbleScorePages = inventory.scrabbleScores.map(
    (score) => `/words-with-${score}-scrabble-points`
  )

  return [
    ...staticPages,
    ...lengthPages,
    ...startsWithPages,
    ...endingPages,
    ...containsPages,
    ...scrabbleScorePages,
  ]
}

type RouteProps = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params
  const page = Number(id)

  if (!Number.isInteger(page) || page < 1) {
    return new Response('Not found', { status: 404 })
  }

  const allPaths = getAllSeoPaths()
  const start = (page - 1) * URLS_PER_SITEMAP
  const end = start + URLS_PER_SITEMAP
  const paths = allPaths.slice(start, end)

  if (!paths.length) {
    return new Response('Not found', { status: 404 })
  }

  const now = new Date().toISOString()

  const urls = paths
    .map((path) => {
      const priority = path === '' ? '1.0' : '0.7'

      return `
  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    }
  )
}