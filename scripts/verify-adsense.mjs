import fs from 'node:fs'

const publisher = 'ca-pub-3618932262167305'
const layout = fs.readFileSync('app/layout.tsx', 'utf8')
const component = fs.readFileSync('components/ads/AdSenseScript.tsx', 'utf8')
const adsTxt = fs.readFileSync('app/ads.txt/route.ts', 'utf8')

const checks = [
  ['layout imports loader', layout.includes("@/components/ads/AdSenseScript")],
  ['layout renders loader', layout.includes('<AdSenseScript')],
  ['publisher verification meta exists', layout.includes('google-adsense-account') && layout.includes(publisher)],
  ['loader has permanent publisher fallback', component.includes(publisher)],
  ['loader uses Google AdSense endpoint', component.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')],
  ['ads.txt authorizes publisher', adsTxt.includes('google.com, pub-3618932262167305, DIRECT, f08c47fec0942fa0')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`)
  failed ||= !ok
}
if (failed) process.exit(1)
