import { writeFileSync } from 'node:fs'
import wordListPath from 'word-list'
import { readFileSync } from 'node:fs'

const words = readFileSync(wordListPath, 'utf8')
  .split('\n')
  .map((w) => w.trim().toLowerCase())
  .filter(Boolean)
  .filter((w) => /^[a-z]+$/.test(w))
  .filter((w) => w.length >= 2 && w.length <= 15)

const uniqueWords = [...new Set(words)].sort()

const output = `import type { WordEntry } from '@/lib/dictionary'

export const PRODUCTION_WORDS: WordEntry[] = [
${uniqueWords
  .map(
    (word) =>
      `  { word: '${word}', definition: '' },`
  )
  .join('\n')}
]
`

writeFileSync('data/dictionary/words.ts', output)

console.log(`Imported ${uniqueWords.length} words.`)