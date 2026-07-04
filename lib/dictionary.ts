import { PRODUCTION_WORDS } from '@/data/dictionary'

export type WordEntry = {
  word: string
  definition: string
}

export const DICTIONARY: WordEntry[] = PRODUCTION_WORDS

export const letterScores: Record<string, number> = {
  a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, s: 1, t: 1, r: 1,
  d: 2, g: 2,
  b: 3, c: 3, m: 3, p: 3,
  f: 4, h: 4, v: 4, w: 4, y: 4,
  k: 5,
  j: 8, x: 8,
  q: 10, z: 10,
}

export function scrabbleScore(word: string): number {
  return word
    .toLowerCase()
    .split('')
    .reduce((sum, ch) => sum + (letterScores[ch] || 0), 0)
}

function countLetters(value: string): Record<string, number> {
  return value
    .toLowerCase()
    .replace(/[^a-z?]/g, '')
    .split('')
    .reduce<Record<string, number>>((acc, ch) => {
      acc[ch] = (acc[ch] || 0) + 1
      return acc
    }, {})
}

function canBuild(word: string, letters: string): boolean {
  const available = countLetters(letters)
  let wildcards = available['?'] || 0

  for (const ch of word.toLowerCase()) {
    if (available[ch]) {
      available[ch] -= 1
    } else if (wildcards > 0) {
      wildcards -= 1
    } else {
      return false
    }
  }

  return true
}

export type SearchFilters = {
  minLength?: number
  maxLength?: number
  exactLength?: number
  startsWith?: string
  endsWith?: string
  contains?: string
  excludes?: string
  minScore?: number
  sortBy?: 'alphabetical' | 'score' | 'longest'
}

export type SearchResult = WordEntry & {
  length: number
  score: number
}

export function searchWords(
  letters: string,
  filters: SearchFilters = {}
): SearchResult[] {
  const cleaned = letters.toLowerCase().replace(/[^a-z?]/g, '')
  if (!cleaned) return []

  const excluded = new Set(
    (filters.excludes || '').toLowerCase().replace(/[^a-z]/g, '').split('')
  )

  const starts = filters.startsWith?.toLowerCase().trim() || ''
  const ends = filters.endsWith?.toLowerCase().trim() || ''
  const contains = filters.contains?.toLowerCase().trim() || ''

  const results = DICTIONARY
    .filter(({ word }) => canBuild(word, cleaned))
    .filter(({ word }) => !filters.exactLength || word.length === filters.exactLength)
    .filter(({ word }) => !filters.minLength || word.length >= filters.minLength)
    .filter(({ word }) => !filters.maxLength || word.length <= filters.maxLength)
    .filter(({ word }) => !starts || word.startsWith(starts))
    .filter(({ word }) => !ends || word.endsWith(ends))
    .filter(({ word }) => !contains || word.includes(contains))
    .filter(({ word }) => ![...word].some((ch) => excluded.has(ch)))
    .map((entry) => ({
      ...entry,
      length: entry.word.length,
      score: scrabbleScore(entry.word),
    }))
    .filter((entry) => !filters.minScore || entry.score >= filters.minScore)

  const sortBy = filters.sortBy || 'longest'

  results.sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score || a.word.localeCompare(b.word)
    }

    if (sortBy === 'longest') {
      return b.length - a.length || b.score - a.score || a.word.localeCompare(b.word)
    }

    return a.word.localeCompare(b.word)
  })

  return results
}

export function groupByLength(results: SearchResult[]) {
  return results.reduce<Record<number, SearchResult[]>>((acc, result) => {
    acc[result.length] = acc[result.length] || []
    acc[result.length].push(result)
    return acc
  }, {})
}

let cachedWords: string[] | null = null
let cachedWordSet: Set<string> | null = null

export function getDictionary(): string[] {
  if (!cachedWords) {
    cachedWords = DICTIONARY
      .map((entry) => entry.word.trim().toLowerCase())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  }

  return cachedWords
}

export function getDictionaryEntries(): WordEntry[] {
  return DICTIONARY
}

export function getWordSet(): Set<string> {
  if (!cachedWordSet) {
    cachedWordSet = new Set(getDictionary())
  }

  return cachedWordSet
}

export function hasWord(word: string): boolean {
  return getWordSet().has(word.trim().toLowerCase())
}

export function getWord(word: string): WordEntry | null {
  const normalized = word.trim().toLowerCase()
  return DICTIONARY.find((entry) => entry.word === normalized) || null
}