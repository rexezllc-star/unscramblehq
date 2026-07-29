import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      /*
       * UnscrambleHQ restores URL state and starts asynchronous dictionary
       * searches from effects. React's experimental set-state-in-effect rule
       * flags this intentional synchronization pattern even though updates are
       * guarded and do not create an effect loop.
       */
      'react-hooks/set-state-in-effect': 'off',

      /*
       * Keep unused code visible during development without blocking a
       * production deployment. Variables intentionally retained for future
       * implementation can be prefixed with an underscore.
       */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  globalIgnores([
    '.next/**',
    'node_modules/**',
    '.patch-backups/**',
    '.cache/**',
    'coverage/**',
    'dist/**',
    'out/**',
    'data/**',
    'public/**',
    '*.tsbuildinfo',
    'next-env.d.ts',
  ]),
])
