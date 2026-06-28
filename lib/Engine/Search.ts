import { applyFilters } from './filters'
import { getDictionary } from './loader'
import { sortResults } from './ranking'
import { scrabbleScore, wordsWithFriendsScore } from './scoring'
import type { SearchFilters, SearchResult } from './types'
import { canBuildWord, normalizeLetters } from './utils'

export function searchWords(letters: string, filters: SearchFilters = {}): SearchResult[] {
  const cleaned = normalizeLetters(letters)
  if (!cleaned) return []

  const buildable = getDictionary().filter(({ word }) => canBuildWord(word, cleaned))
  const filtered = applyFilters(buildable, filters)

  const results = filtered
    .map((entry) => ({
      ...entry,
      length: entry.word.length,
      score: scrabbleScore(entry.word),
      wwfScore: wordsWithFriendsScore(entry.word)
    }))
    .filter((entry) => !filters.minScore || entry.score >= filters.minScore)

  return sortResults(results, filters.sortBy)
}

export function groupByLength(results: SearchResult[]) {
  return results.reduce<Record<number, SearchResult[]>>((acc, result) => {
    acc[result.length] = acc[result.length] || []
    acc[result.length].push(result)
    return acc
  }, {})
}
