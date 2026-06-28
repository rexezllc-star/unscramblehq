import type { SearchFilters, SearchResult } from './types'

export function sortResults(results: SearchResult[], sortBy: SearchFilters['sortBy'] = 'longest'): SearchResult[] {
  return [...results].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score || a.word.localeCompare(b.word)
    if (sortBy === 'alphabetical') return a.word.localeCompare(b.word)
    return b.length - a.length || b.score - a.score || a.word.localeCompare(b.word)
  })
}
