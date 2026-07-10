import { getSitemapSeoInventory } from '@/lib/seoInventory'

const SITE_URL = 'https://unscramblehq.com'
const URLS_PER_SITEMAP = 5000

function getTotalSeoPathCount() {
  const inventory = getSitemapSeoInventory()

  const staticPages = 5

  return (
    staticPages +
    inventory.lengths.length +
    inventory.prefixes.length +
    inventory.suffixes.length +
    inventory.contains.length +
    inventory.scrabbleScores.length
  )
}

export function GET() {
  const now = new Date().toISOString()
  const totalPaths = getTotalSeoPathCount()
  const sitemapCount = Math.ceil(totalPaths / URLS_PER_SITEMAP)

  const sitemaps = Array.from({ length: sitemapCount }, (_, index) => {
    const id = index + 1

    return `
  <sitemap>
    <loc>${SITE_URL}/sitemaps/${id}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  }).join('')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    }
  )
}