import { DICTIONARY } from '@/lib/dictionary'
import type { WordEntry } from './types'

export function getDictionary(): WordEntry[] {
  const seen = new Set<string>()

  return DICTIONARY
    .map((entry) => ({
      word: entry.word.toLowerCase().trim(),
      definition: entry.definition || 'Definition coming soon.'
    }))
    .filter((entry) => {
      if (!entry.word || seen.has(entry.word)) return false
      seen.add(entry.word)
      return true
    })
}
