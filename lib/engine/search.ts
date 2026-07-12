import { applyFilters } from './filters'
import { getDictionary } from './loader'
import { sortResults } from './ranking'
import {
  scrabbleScore,
  wordsWithFriendsScore,
} from './scoring'
import type {
  SearchFilters,
  SearchResult,
  WordEntry,
} from './types'
import { normalizeLetters } from './utils'

const SEARCH_CACHE_LIMIT = 200
const ALPHABET_SIZE = 26
const A_CODE = 97

type PreparedWord = WordEntry & {
  length: number
  score: number
  wwfScore: number
  letterCounts: Uint8Array
}

let preparedByLengthCache: Map<number, PreparedWord[]> | null = null

const searchCache = new Map<string, SearchResult[]>()

function normalizeFilterText(
  value: string | undefined
): string | undefined {
  const cleaned = value?.trim().toLowerCase()

  return cleaned || undefined
}

function normalizeFilters(
  filters: SearchFilters
): SearchFilters {
  return {
    ...filters,
    startsWith: normalizeFilterText(filters.startsWith),
    endsWith: normalizeFilterText(filters.endsWith),
    contains: normalizeFilterText(filters.contains),
    excludes: normalizeFilterText(filters.excludes),
    sortBy: filters.sortBy || 'longest',
  }
}

function createLetterCounts(word: string): Uint8Array {
  const counts = new Uint8Array(ALPHABET_SIZE)

  for (let index = 0; index < word.length; index += 1) {
    const code = word.charCodeAt(index) - A_CODE

    if (code >= 0 && code < ALPHABET_SIZE) {
      counts[code] += 1
    }
  }

  return counts
}

function createRackProfile(letters: string) {
  const counts = new Uint8Array(ALPHABET_SIZE)
  let blanks = 0

  for (let index = 0; index < letters.length; index += 1) {
    const character = letters[index]

    if (character === '?') {
      blanks += 1
      continue
    }

    const code = character.charCodeAt(0) - A_CODE

    if (code >= 0 && code < ALPHABET_SIZE) {
      counts[code] += 1
    }
  }

  return {
    counts,
    blanks,
  }
}

function canBuildPreparedWord(
  candidateCounts: Uint8Array,
  rackCounts: Uint8Array,
  blanks: number
): boolean {
  let missingLetters = 0

  for (let index = 0; index < ALPHABET_SIZE; index += 1) {
    const missing = candidateCounts[index] - rackCounts[index]

    if (missing > 0) {
      missingLetters += missing

      if (missingLetters > blanks) {
        return false
      }
    }
  }

  return true
}

function getPreparedDictionaryByLength(): Map<number, PreparedWord[]> {
  if (preparedByLengthCache) {
    return preparedByLengthCache
  }

  const index = new Map<number, PreparedWord[]>()

  for (const entry of getDictionary()) {
    const word = entry.word
    const length = word.length

    const prepared: PreparedWord = {
      ...entry,
      length,
      score: scrabbleScore(word),
      wwfScore: wordsWithFriendsScore(word),
      letterCounts: createLetterCounts(word),
    }

    const bucket = index.get(length)

    if (bucket) {
      bucket.push(prepared)
    } else {
      index.set(length, [prepared])
    }
  }

  preparedByLengthCache = index

  return index
}

function buildCacheKey(
  letters: string,
  filters: SearchFilters
): string {
  return JSON.stringify([
    letters,
    filters.minLength ?? null,
    filters.maxLength ?? null,
    filters.exactLength ?? null,
    filters.startsWith ?? null,
    filters.endsWith ?? null,
    filters.contains ?? null,
    filters.excludes ?? null,
    filters.minScore ?? null,
    filters.sortBy ?? 'longest',
  ])
}

function readSearchCache(key: string): SearchResult[] | null {
  const cached = searchCache.get(key)

  if (!cached) return null

  searchCache.delete(key)
  searchCache.set(key, cached)

  return cached
}

function writeSearchCache(
  key: string,
  results: SearchResult[]
): void {
  searchCache.set(key, results)

  if (searchCache.size <= SEARCH_CACHE_LIMIT) {
    return
  }

  const oldestKey = searchCache.keys().next().value

  if (oldestKey) {
    searchCache.delete(oldestKey)
  }
}

function getCandidateLengths(
  availableLength: number,
  filters: SearchFilters
): number[] {
  if (filters.exactLength) {
    return filters.exactLength <= availableLength
      ? [filters.exactLength]
      : []
  }

  const minimum = Math.max(
    1,
    filters.minLength ?? 1
  )

  const maximum = Math.min(
    availableLength,
    filters.maxLength ?? availableLength
  )

  const lengths: number[] = []

  for (
    let length = minimum;
    length <= maximum;
    length += 1
  ) {
    lengths.push(length)
  }

  return lengths
}

/**
 * Builds the expensive dictionary index before the first search.
 * Safe to call more than once.
 */
export function warmSearchEngine(): void {
  getPreparedDictionaryByLength()
}

export function searchWords(
  letters: string,
  filters: SearchFilters = {}
): SearchResult[] {
  const cleaned = normalizeLetters(letters)

  if (!cleaned) return []

  const normalizedFilters = normalizeFilters(filters)

  const cacheKey = buildCacheKey(
    cleaned,
    normalizedFilters
  )

  const cached = readSearchCache(cacheKey)

  if (cached) {
    return cached
  }

  const byLength = getPreparedDictionaryByLength()

  const candidateLengths = getCandidateLengths(
    cleaned.length,
    normalizedFilters
  )

  const rack = createRackProfile(cleaned)
  const buildable: PreparedWord[] = []

  for (const length of candidateLengths) {
    const candidates = byLength.get(length) ?? []

    for (const entry of candidates) {
      if (
        canBuildPreparedWord(
          entry.letterCounts,
          rack.counts,
          rack.blanks
        )
      ) {
        buildable.push(entry)
      }
    }
  }

  const filtered = applyFilters(
    buildable,
    normalizedFilters
  ) as PreparedWord[]

  const minimumScore = normalizedFilters.minScore

  const results: SearchResult[] = filtered
    .filter(
      (entry) =>
        minimumScore === undefined ||
        entry.score >= minimumScore
    )
    .map((entry) => ({
      word: entry.word,
      definition: entry.definition,
      length: entry.length,
      score: entry.score,
      wwfScore: entry.wwfScore,
    }))

  const sorted = sortResults(
    results,
    normalizedFilters.sortBy
  )

  writeSearchCache(cacheKey, sorted)

  return sorted
}

export function groupByLength(
  results: SearchResult[]
): Record<number, SearchResult[]> {
  const grouped: Record<number, SearchResult[]> = {}

  for (const result of results) {
    const existing = grouped[result.length]

    if (existing) {
      existing.push(result)
    } else {
      grouped[result.length] = [result]
    }
  }

  return grouped
}

export function clearSearchCache(): void {
  searchCache.clear()
}

export function clearPreparedSearchIndex(): void {
  preparedByLengthCache = null
  searchCache.clear()
}