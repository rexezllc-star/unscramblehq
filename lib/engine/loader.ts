import { DICTIONARY } from '@/lib/dictionary'
import type { WordEntry } from './types'

let cachedDictionary: WordEntry[] | null = null

export function getDictionary(): WordEntry[] {
  if (cachedDictionary) {
    return cachedDictionary
  }

  const seen = new Set<string>()
  const prepared: WordEntry[] = []

  for (const entry of DICTIONARY) {
    const word = entry.word
      .toLowerCase()
      .trim()

    if (!word || seen.has(word)) {
      continue
    }

    seen.add(word)

    prepared.push({
      word,
      definition:
        entry.definition?.trim() ||
        'Definition coming soon.',
    })
  }

  cachedDictionary = prepared

  return cachedDictionary
}

export function clearDictionaryCache(): void {
  cachedDictionary = null
}