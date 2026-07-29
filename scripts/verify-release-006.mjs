import fs from 'node:fs'

const checks = []
const pass = (name, ok) => {
  checks.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const eslintConfig = fs.readFileSync('eslint.config.mjs', 'utf8')
const health = fs.readFileSync('app/api/health/route.ts', 'utf8')
const adsRoute = fs.existsSync('app/ads.txt/route.ts')
  ? fs.readFileSync('app/ads.txt/route.ts', 'utf8')
  : ''
const layout = fs.readFileSync('app/layout.tsx', 'utf8')

pass('typecheck script exists', Boolean(pkg.scripts?.typecheck))
pass('lint uses explicit 4 GB heap', pkg.scripts?.lint?.includes('--max-old-space-size=4096'))
pass('lint scope excludes repository-wide generated data', !pkg.scripts?.lint?.includes('eslint .'))
pass('CI lint fails on warnings', pkg.scripts?.['lint:ci']?.includes('--max-warnings=0'))
pass('release build pipeline exists', Boolean(pkg.scripts?.['release:build']))
pass('ESLint ignores data directory', eslintConfig.includes("'data/**'"))
pass('health endpoint is no-store', health.includes("'Cache-Control': 'no-store, max-age=0'"))
pass('health endpoint contains release marker', health.includes('release-006-stable-build'))
pass('health endpoint contains publisher', health.includes('ca-pub-3618932262167305'))
pass('ads.txt authorizes publisher', adsRoute.includes('pub-3618932262167305'))
pass('layout contains AdSense publisher', layout.includes('ca-pub-3618932262167305'))

if (checks.some((check) => !check.ok)) {
  process.exit(1)
}
