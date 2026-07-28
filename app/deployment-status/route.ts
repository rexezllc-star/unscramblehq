const status = {
  application: 'unscramblehq',
  patch: 'patch-005-production-hardening',
  adsensePublisher: 'ca-pub-3618932262167305',
  adsTxtReady: true,
}

export const dynamic = 'force-static'

export function GET() {
  return Response.json(status, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
