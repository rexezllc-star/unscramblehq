export function AdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  if (!client) return null

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  )
}