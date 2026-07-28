import fs from 'node:fs'

const publisher = 'ca-pub-3618932262167305'
const required = {
  gitignore: fs.readFileSync('.gitignore', 'utf8'),
  tsconfig: fs.readFileSync('tsconfig.json', 'utf8'),
  eslint: fs.readFileSync('eslint.config.mjs', 'utf8'),
  adsTxt: fs.readFileSync('app/ads.txt/route.ts', 'utf8'),
  status: fs.readFileSync('app/deployment-status/route.ts', 'utf8'),
  layout: fs.readFileSync('app/layout.tsx', 'utf8'),
}

const checks = [
  ['patch backups ignored', required.gitignore.includes('.patch-backups/')],
  ['TypeScript build info ignored', required.gitignore.includes('*.tsbuildinfo')],
  ['TypeScript deprecation acknowledged', required.tsconfig.includes('"ignoreDeprecations": "6.0"')],
  ['ESLint flat config exists', required.eslint.includes('eslint-config-next/core-web-vitals')],
  ['ads.txt publisher authorized', required.adsTxt.includes(`google.com, pub-3618932262167305, DIRECT, f08c47fec0942fa0`)],
  ['deployment marker exists', required.status.includes('patch-005-production-hardening')],
  ['AdSense publisher appears in layout', required.layout.includes(publisher)],
]

let failed = false
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`)
  failed ||= !ok
}
if (failed) process.exit(1)
