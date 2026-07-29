import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PUBLISHER = 'ca-pub-3618932262167305'
const RELEASE = 'release-006-stable-build'

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      application: 'unscramblehq',
      release: RELEASE,
      buildSha:
        process.env.NEXT_PUBLIC_BUILD_SHA ??
        process.env.GIT_COMMIT_SHA ??
        process.env.COOLIFY_GIT_COMMIT_SHA ??
        'not-injected',
      adsensePublisher: PUBLISHER,
      adsTxtExpected:
        'google.com, pub-3618932262167305, DIRECT, f08c47fec0942fa0',
      checkedAt: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-UnscrambleHQ-Release': RELEASE,
      },
    },
  )
}
