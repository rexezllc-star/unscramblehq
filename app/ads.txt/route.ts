const ADS_TXT =
  'google.com, pub-3618932262167305, DIRECT, f08c47fec0942fa0\n'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return new Response(ADS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
