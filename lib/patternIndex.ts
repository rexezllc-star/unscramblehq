import { getDictionary } from '@/lib/dictionary'
import type {
  PatternIndexEntry,
  PatternRouteType,
} from '@/lib/patternTypes'

const MIN_WORD_LENGTH = 2
const MAX_WORD_LENGTH = 15

const MIN_PATTERN_LENGTH = 1
const MAX_PREFIX_SUFFIX_LENGTH = 7
const MIN_CONTAINS_LENGTH = 2
const MAX_CONTAINS_LENGTH = 6

const MIN_MATCH_COUNT = 2

let dictionaryCache: string[] | null = null
let wordsByLengthCache: Map<number, string[]> | null = null
let patternIndexCache: PatternIndexEntry[] | null = null

function normalizeWord(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function incrementCount(
  map: Map<string, number>,
  key: string
): void {
  if (!key) return

  map.set(key, (map.get(key) ?? 0) + 1)
}

function getUniqueDictionary(): string[] {
  if (dictionaryCache) {
    return dictionaryCache
  }

  dictionaryCache = Array.from(
    new Set(
      getDictionary()
        .map(normalizeWord)
        .filter(
          (word) =>
            word.length >= MIN_WORD_LENGTH &&
            word.length <= MAX_WORD_LENGTH
        )
    )
  )

  return dictionaryCache
}

export function getWordsByLengthIndex(): Map<number, string[]> {
  if (wordsByLengthCache) {
    return wordsByLengthCache
  }

  const index = new Map<number, string[]>()

  for (const word of getUniqueDictionary()) {
    const current = index.get(word.length) ?? []
    current.push(word)
    index.set(word.length, current)
  }

  for (const words of index.values()) {
    words.sort((a, b) => a.localeCompare(b))
  }

  wordsByLengthCache = index

  return wordsByLengthCache
}

function collectLengthPatterns(
  length: number,
  words: string[]
): PatternIndexEntry[] {
  const prefixCounts = new Map<string, number>()
  const suffixCounts = new Map<string, number>()
  const containsCounts = new Map<string, number>()

  for (const word of words) {
    const maxPrefixSuffixLength = Math.min(
      MAX_PREFIX_SUFFIX_LENGTH,
      word.length - 1
    )

    for (
      let size = MIN_PATTERN_LENGTH;
      size <= maxPrefixSuffixLength;
      size += 1
    ) {
      incrementCount(prefixCounts, word.slice(0, size))
      incrementCount(suffixCounts, word.slice(-size))
    }

    const maxContainsLength = Math.min(
      MAX_CONTAINS_LENGTH,
      word.length - 1
    )

    for (
      let size = MIN_CONTAINS_LENGTH;
      size <= maxContainsLength;
      size += 1
    ) {
      const seenInWord = new Set<string>()

      for (
        let index = 0;
        index <= word.length - size;
        index += 1
      ) {
        const fragment = word.slice(index, index + size)

        if (seenInWord.has(fragment)) {
          continue
        }

        seenInWord.add(fragment)
        incrementCount(containsCounts, fragment)
      }
    }
  }

  const entries: PatternIndexEntry[] = []

  function appendQualified(
    type: PatternRouteType,
    counts: Map<string, number>
  ): void {
    for (const [letters, matchCount] of counts) {
      if (matchCount < MIN_MATCH_COUNT) {
        continue
      }

      entries.push({
        type,
        length,
        letters,
        matchCount,
      })
    }
  }

  appendQualified('length-starts-with', prefixCounts)
  appendQualified('length-ends-with', suffixCounts)
  appendQualified('length-contains', containsCounts)

  return entries
}

export function getPatternIndex(): PatternIndexEntry[] {
  if (patternIndexCache) {
    return patternIndexCache
  }

  const wordsByLength = getWordsByLengthIndex()
  const entries: PatternIndexEntry[] = []

  for (
    let length = MIN_WORD_LENGTH;
    length <= MAX_WORD_LENGTH;
    length += 1
  ) {
    const words = wordsByLength.get(length) ?? []

    if (words.length === 0) {
      continue
    }

    const lengthEntries = collectLengthPatterns(
      length,
      words
    )

    for (const entry of lengthEntries) {
      entries.push(entry)
    }
  }

  patternIndexCache = entries

  return patternIndexCache
}

export function getPatternIndexCount(): number {
  return getPatternIndex().length
}

export function clearPatternIndexCache(): void {
  dictionaryCache = null
  wordsByLengthCache = null
  patternIndexCache = null
}