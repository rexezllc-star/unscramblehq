import fs from 'node:fs'

const checks = []
function check(name, condition) {
  const ok = Boolean(condition)
  checks.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const eslintConfig = fs.readFileSync('eslint.config.mjs', 'utf8')
const healthPath = 'app/api/health/route.ts'

check('bounded lint command', pkg.scripts?.lint?.includes('app components lib scripts'))
check('lint has 4 GB heap', pkg.scripts?.lint?.includes('--max-old-space-size=4096'))
check('release build command exists', Boolean(pkg.scripts?.['release:build']))
check('generated dictionary data ignored', eslintConfig.includes("'data/**'"))
check('effect synchronization rule documented', eslintConfig.includes("'react-hooks/set-state-in-effect': 'off'"))
check('unused variables remain warnings', eslintConfig.includes("'@typescript-eslint/no-unused-vars'"))
check('health endpoint exists', fs.existsSync(healthPath))

if (fs.existsSync(healthPath)) {
  const health = fs.readFileSync(healthPath, 'utf8')
  check('health endpoint disables caching', health.includes('no-store'))
  check('health endpoint contains release marker', health.includes('release-006-stable-build') || health.includes('release-007'))
}

if (checks.some(({ ok }) => !ok)) process.exit(1)
