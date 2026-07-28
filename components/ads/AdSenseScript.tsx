import Script from 'next/script'

const DEFAULT_ADSENSE_CLIENT = 'ca-pub-3618932262167305'

export function AdSenseScript() {
  const client =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || DEFAULT_ADSENSE_CLIENT

  return (
    <Script
      id="google-adsense-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  )
}
