const SITE_URL = 'https://www.unscramblehq.com'
const SITEMAP_COUNT = 5

export function GET() {
  const now = new Date().toISOString()

  const sitemaps = Array.from({ length: SITEMAP_COUNT }, (_, index) => {
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