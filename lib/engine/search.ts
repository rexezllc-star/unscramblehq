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
import {
  canBuildWord,
  normalizeLetters,
} from './utils'

const SEARCH_CACHE_LIMIT = 100

type PreparedWord = WordEntry & {
  length: number
}
let preparedByLengthCache:
  | Map<number, PreparedWord[]>
  | null = null

const searchCache = new Map<string, SearchResult[]>()

function normalizeFilterText(
  value: string | undefined
): string | undefined {
  const cleaned = value
    ?.trim()
    .toLowerCase()

  return cleaned || undefined
}

function normalizeFilters(
  filters: SearchFilters
): SearchFilters {
  return {
    ...filters,
    startsWith: normalizeFilterText(
      filters.startsWith
    ),
    endsWith: normalizeFilterText(
      filters.endsWith
    ),
    contains: normalizeFilterText(
      filters.contains
    ),
    excludes: normalizeFilterText(
      filters.excludes
    ),
    sortBy: filters.sortBy || 'longest',
  }
}

function getPreparedDictionaryByLength():
  Map<number, PreparedWord[]> {
  if (preparedByLengthCache) {
    return preparedByLengthCache
  }

  const index = new Map<number, PreparedWord[]>()

  for (const entry of getDictionary()) {
    const prepared: PreparedWord = {
  ...entry,
  length: entry.word.length,
}

    const words =
      index.get(prepared.length) ?? []

    words.push(prepared)
    index.set(prepared.length, words)
  }

  preparedByLengthCache = index

  return preparedByLengthCache
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

function readSearchCache(
  key: string
): SearchResult[] | null {
  const cached = searchCache.get(key)

  if (!cached) return null

  // Refresh its position in the LRU cache.
  searchCache.delete(key)
  searchCache.set(key, cached)

  return cached
}

function writeSearchCache(
  key: string,
  results: SearchResult[]
): void {
  searchCache.set(key, results)

  if (
    searchCache.size <= SEARCH_CACHE_LIMIT
  ) {
    return
  }

  const oldestKey =
    searchCache.keys().next().value

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

export function searchWords(
  letters: string,
  filters: SearchFilters = {}
): SearchResult[] {
  const cleaned = normalizeLetters(letters)

  if (!cleaned) return []

  const normalizedFilters =
    normalizeFilters(filters)

  const cacheKey = buildCacheKey(
    cleaned,
    normalizedFilters
  )

  const cached = readSearchCache(cacheKey)

  if (cached) {
    return cached
  }

  const byLength =
    getPreparedDictionaryByLength()

  const candidateLengths =
    getCandidateLengths(
      cleaned.length,
      normalizedFilters
    )

  const buildable: PreparedWord[] = []

  for (const length of candidateLengths) {
    const candidates =
      byLength.get(length) ?? []

    for (const entry of candidates) {
      if (
        canBuildWord(entry.word, cleaned)
      ) {
        buildable.push(entry)
      }
    }
  }

  /*
   * PreparedWord includes all WordEntry fields, so it
   * can safely pass through the existing filter engine.
   * Its scores and length are already calculated.
   */
  const filtered = applyFilters(
    buildable,
    normalizedFilters
  ) as PreparedWord[]

  const minimumScore =
    normalizedFilters.minScore

  const results: SearchResult[] = filtered
  .map((entry) => ({
    ...entry,
    length: entry.word.length,
    score: scrabbleScore(entry.word),
    wwfScore: wordsWithFriendsScore(entry.word),
  }))
  .filter(
    (entry) =>
      !normalizedFilters.minScore ||
      entry.score >= normalizedFilters.minScore
  )

const sorted = sortResults(
  results,
  normalizedFilters.sortBy
)
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
  const grouped:
    Record<number, SearchResult[]> = {}

  for (const result of results) {
    const existing =
      grouped[result.length]

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