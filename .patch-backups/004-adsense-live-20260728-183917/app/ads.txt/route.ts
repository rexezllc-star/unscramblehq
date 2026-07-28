export const dynamic = 'force-static'
export const revalidate = false

export function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID

  const content = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense publisher ID pending\n'

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}