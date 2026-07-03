import { getDictionary } from '@/lib/dictionary'

export type WordIndexes = {
  byLength: Record<number, string[]>
  byFirstLetter: Record<string, string[]>
  byPrefix: Record<string, string[]>
  bySuffix: Record<string, string[]>
  byContains: Record<string, string[]>
}

let cachedIndexes: WordIndexes | null = null

const COMMON_CONTAINS = [
  'qu',
  'th',
  'ch',
  'sh',
  'ph',
  'ck',
  'ing',
  'ed',
  'er',
  'tion',
  'ly',
  'ness',
]

export function getWordIndexes(): WordIndexes {
  if (cachedIndexes) return cachedIndexes

  const words = getDictionary()

  const byLength: Record<number, string[]> = {}
  const byFirstLetter: Record<string, string[]> = {}
  const byPrefix: Record<string, string[]> = {}
  const bySuffix: Record<string, string[]> = {}
  const byContains: Record<string, string[]> = {}

  for (const word of words) {
    const length = word.length
    byLength[length] = byLength[length] || []
    byLength[length].push(word)

    const firstLetter = word[0]
    if (firstLetter) {
      byFirstLetter[firstLetter] = byFirstLetter[firstLetter] || []
      byFirstLetter[firstLetter].push(word)
    }

    for (let size = 1; size <= Math.min(4, word.length); size++) {
      const prefix = word.slice(0, size)
      byPrefix[prefix] = byPrefix[prefix] || []
      byPrefix[prefix].push(word)

      const suffix = word.slice(-size)
      bySuffix[suffix] = bySuffix[suffix] || []
      bySuffix[suffix].push(word)
    }

    for (const chunk of COMMON_CONTAINS) {
      if (word.includes(chunk)) {
        byContains[chunk] = byContains[chunk] || []
        byContains[chunk].push(word)
      }
    }
  }

  cachedIndexes = {
    byLength,
    byFirstLetter,
    byPrefix,
    bySuffix,
    byContains,
  }

  return cachedIndexes
}

export function getWordsByLength(length: number): string[] {
  return getWordIndexes().byLength[length] || []
}

export function getWordsStartingWith(prefix: string): string[] {
  return getWordIndexes().byPrefix[prefix.toLowerCase()] || []
}

export function getWordsEndingWith(suffix: string): string[] {
  return getWordIndexes().bySuffix[suffix.toLowerCase()] || []
}

export function getWordsContaining(value: string): string[] {
  return getWordIndexes().byContains[value.toLowerCase()] || []
}