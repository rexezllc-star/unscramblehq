import type { SearchFilters, WordEntry } from './types'

export function applyFilters(entries: WordEntry[], filters: SearchFilters): WordEntry[] {
  const excluded = new Set((filters.excludes || '').toLowerCase().replace(/[^a-z]/g, '').split(''))
  const starts = filters.startsWith?.toLowerCase().trim() || ''
  const ends = filters.endsWith?.toLowerCase().trim() || ''
  const contains = filters.contains?.toLowerCase().trim() || ''

  return entries
    .filter(({ word }) => !filters.exactLength || word.length === filters.exactLength)
    .filter(({ word }) => !filters.minLength || word.length >= filters.minLength)
    .filter(({ word }) => !filters.maxLength || word.length <= filters.maxLength)
    .filter(({ word }) => !starts || word.startsWith(starts))
    .filter(({ word }) => !ends || word.endsWith(ends))
    .filter(({ word }) => !contains || word.includes(contains))
    .filter(({ word }) => ![...word].some((ch) => excluded.has(ch)))
}
