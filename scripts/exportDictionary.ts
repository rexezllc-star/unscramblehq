import { writeFileSync } from 'fs'
import { DICTIONARY } from '../lib/dictionary'

const content = `import type { WordEntry } from '@/lib/dictionary'

export const PRODUCTION_WORDS: WordEntry[] = ${JSON.stringify(
  DICTIONARY,
  null,
  2
)}
`

writeFileSync('data/dictionary/words.ts', content)

console.log(`Exported ${DICTIONARY.length} words.`)