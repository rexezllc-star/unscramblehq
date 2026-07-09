import { getSitemapSeoInventory } from '@/lib/seoInventory'

const SITE_URL = 'https://www.unscramblehq.com'
const URLS_PER_SITEMAP = 5000

function getSitemapCount() {
  const inventory = getSitemapSeoInventory()

  const totalUrls =
    5 +
    inventory.lengths.length +
    inventory.prefixes.length +
    inventory.suffixes.length +
    inventory.contains.length

  return Math.ceil(totalUrls / URLS_PER_SITEMAP)
}

export function GET() {
  const now = new Date().toISOString()
  const sitemapCount = getSitemapCount()

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