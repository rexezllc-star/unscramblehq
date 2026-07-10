import { getDictionaryEntries } from '@/lib/dictionary'
import {
  getWordsByLength,
  getWordsEndingWith,
  getWordsStartingWith,
} from '@/lib/engine/indexes'
import {
  scrabbleScore,
  wordsWithFriendsScore,
} from '@/lib/engine/scoring'

export type PatternType =
  | 'prefix'
  | 'suffix'
  | 'contains'
  | 'length'
  | 'length-prefix'
  | 'length-suffix'
  | 'length-contains'

export type PatternSort =
  | 'alphabetical'
  | 'longest'
  | 'shortest'
  | 'scrabble-score'
  | 'wwf-score'

export type PatternSearchOptions = {
  type: PatternType
  value?: string
  length?: number
  sortBy?: PatternSort
  page?: number
  pageSize?: number
}

export type PatternWord = {
  word: string
  definition: string
  length: number
  scrabbleScore: number
  wwfScore: number
}

export type PatternLengthGroup = {
  length: number
  count: number
}

export type PatternSearchResult = {
  type: PatternType
  value: string
  length?: number
  total: number
  page: number
  pageSize: number
  totalPages: number
  words: PatternWord[]
  lengthGroups: PatternLengthGroup[]
  shortestLength: number | null
  longestLength: number | null
  averageLength: number
}

const DEFAULT_PAGE_SIZE = 100
const MAX_PAGE_SIZE = 500
const CACHE_LIMIT = 250

const resultCache = new Map<string, PatternSearchResult>()

let dictionaryWords: string[] | null = null
let definitionMap: Map<string, string> | null = null

function normalizePattern(value = ''): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function normalizeLength(length?: number): number | undefined {
  if (!Number.isInteger(length)) return undefined
  if (!length || length < 1 || length > 50) return undefined
  return length
}

function getAllWords(): string[] {
  if (!dictionaryWords) {
    dictionaryWords = getDictionaryEntries()
      .map((entry) => entry.word.trim().toLowerCase())
      .filter(Boolean)
  }

  return dictionaryWords
}

function getDefinitions(): Map<string, string> {
  if (!definitionMap) {
    definitionMap = new Map(
      getDictionaryEntries().map((entry) => [
        entry.word.trim().toLowerCase(),
        entry.definition || 'Definition coming soon.',
      ])
    )
  }

  return definitionMap
}

function getDefinition(word: string): string {
  return getDefinitions().get(word) || 'Definition coming soon.'
}

function getPrefixMatches(prefix: string): string[] {
  if (!prefix) return []

  if (prefix.length <= 4) {
    return getWordsStartingWith(prefix)
  }

  return getAllWords().filter((word) => word.startsWith(prefix))
}

function getSuffixMatches(suffix: string): string[] {
  if (!suffix) return []

  if (suffix.length <= 4) {
    return getWordsEndingWith(suffix)
  }

  return getAllWords().filter((word) => word.endsWith(suffix))
}

function getContainsMatches(value: string): string[] {
  if (!value) return []

  return getAllWords().filter((word) => word.includes(value))
}

function getCandidateWords(
  type: PatternType,
  value: string,
  length?: number
): string[] {
  switch (type) {
    case 'prefix':
      return getPrefixMatches(value)

    case 'suffix':
      return getSuffixMatches(value)

    case 'contains':
      return getContainsMatches(value)

    case 'length':
      return length ? getWordsByLength(length) : []

    case 'length-prefix':
      return length
        ? getPrefixMatches(value).filter((word) => word.length === length)
        : []

    case 'length-suffix':
      return length
        ? getSuffixMatches(value).filter((word) => word.length === length)
        : []

    case 'length-contains':
      return length
        ? getContainsMatches(value).filter((word) => word.length === length)
        : []

    default:
      return []
  }
}

function toPatternWord(word: string): PatternWord {
  return {
    word,
    definition: getDefinition(word),
    length: word.length,
    scrabbleScore: scrabbleScore(word),
    wwfScore: wordsWithFriendsScore(word),
  }
}

function sortPatternWords(
  words: PatternWord[],
  sortBy: PatternSort
): PatternWord[] {
  return [...words].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.word.localeCompare(b.word)

      case 'shortest':
        return (
          a.length - b.length ||
          a.word.localeCompare(b.word)
        )

      case 'scrabble-score':
        return (
          b.scrabbleScore - a.scrabbleScore ||
          b.length - a.length ||
          a.word.localeCompare(b.word)
        )

      case 'wwf-score':
        return (
          b.wwfScore - a.wwfScore ||
          b.length - a.length ||
          a.word.localeCompare(b.word)
        )

      case 'longest':
      default:
        return (
          b.length - a.length ||
          b.scrabbleScore - a.scrabbleScore ||
          a.word.localeCompare(b.word)
        )
    }
  })
}

function createLengthGroups(words: PatternWord[]): PatternLengthGroup[] {
  const counts = new Map<number, number>()

  for (const word of words) {
    counts.set(word.length, (counts.get(word.length) || 0) + 1)
  }

  return [...counts.entries()]
    .map(([length, count]) => ({ length, count }))
    .sort((a, b) => a.length - b.length)
}

function buildCacheKey(options: {
  type: PatternType
  value: string
  length?: number
  sortBy: PatternSort
  page: number
  pageSize: number
}): string {
  return [
    options.type,
    options.value,
    options.length || '',
    options.sortBy,
    options.page,
    options.pageSize,
  ].join(':')
}

function writeCache(key: string, result: PatternSearchResult): void {
  if (resultCache.size >= CACHE_LIMIT) {
    const oldestKey = resultCache.keys().next().value

    if (oldestKey) {
      resultCache.delete(oldestKey)
    }
  }

  resultCache.set(key, result)
}

export function searchPattern(
  options: PatternSearchOptions
): PatternSearchResult {
  const value = normalizePattern(options.value)
  const length = normalizeLength(options.length)
  const sortBy = options.sortBy || 'longest'
  const page = Math.max(1, Math.floor(options.page || 1))
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor(options.pageSize || DEFAULT_PAGE_SIZE))
  )

  const cacheKey = buildCacheKey({
    type: options.type,
    value,
    length,
    sortBy,
    page,
    pageSize,
  })

  const cached = resultCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const uniqueWords = Array.from(
    new Set(
      getCandidateWords(options.type, value, length)
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean)
    )
  )

  const enrichedWords = sortPatternWords(
    uniqueWords.map(toPatternWord),
    sortBy
  )

  const total = enrichedWords.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const paginatedWords = enrichedWords.slice(
    startIndex,
    startIndex + pageSize
  )

  const lengths = enrichedWords.map((word) => word.length)
  const totalLength = lengths.reduce((sum, item) => sum + item, 0)

  const result: PatternSearchResult = {
    type: options.type,
    value,
    length,
    total,
    page: safePage,
    pageSize,
    totalPages,
    words: paginatedWords,
    lengthGroups: createLengthGroups(enrichedWords),
    shortestLength: lengths.length ? Math.min(...lengths) : null,
    longestLength: lengths.length ? Math.max(...lengths) : null,
    averageLength: lengths.length
      ? Number((totalLength / lengths.length).toFixed(2))
      : 0,
  }

  writeCache(cacheKey, result)

  return result
}

export function findByPrefix(
  prefix: string,
  options: Omit<PatternSearchOptions, 'type' | 'value'> = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'prefix',
    value: prefix,
  })
}

export function findBySuffix(
  suffix: string,
  options: Omit<PatternSearchOptions, 'type' | 'value'> = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'suffix',
    value: suffix,
  })
}

export function findByContains(
  value: string,
  options: Omit<PatternSearchOptions, 'type' | 'value'> = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'contains',
    value,
  })
}

export function findByLength(
  length: number,
  options: Omit<PatternSearchOptions, 'type' | 'length'> = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'length',
    length,
  })
}

export function findByLengthAndPrefix(
  length: number,
  prefix: string,
  options: Omit<
    PatternSearchOptions,
    'type' | 'length' | 'value'
  > = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'length-prefix',
    length,
    value: prefix,
  })
}

export function findByLengthAndSuffix(
  length: number,
  suffix: string,
  options: Omit<
    PatternSearchOptions,
    'type' | 'length' | 'value'
  > = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'length-suffix',
    length,
    value: suffix,
  })
}

export function findByLengthAndContains(
  length: number,
  value: string,
  options: Omit<
    PatternSearchOptions,
    'type' | 'length' | 'value'
  > = {}
): PatternSearchResult {
  return searchPattern({
    ...options,
    type: 'length-contains',
    length,
    value,
  })
}

export function hasPatternResults(
  options: PatternSearchOptions
): boolean {
  return searchPattern({
    ...options,
    page: 1,
    pageSize: 1,
  }).total > 0
}

export function clearPatternCache(): void {
  resultCache.clear()
}