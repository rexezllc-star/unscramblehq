import { DICTIONARY } from '@/lib/dictionary'

const MIN_MATCHING_WORDS = 3

function getWordText(entry: string | { word: string }) {
  return typeof entry === 'string' ? entry : entry.word
}

const dictionaryWords = Array.from(
  new Set(
   DICTIONARY.map(getWordText)
      .map((word) => word.toLowerCase())
      .filter((word) => /^[a-z]+$/.test(word))
  )
)

function countMatches(
  values: string[],
  predicate: (word: string, value: string) => boolean
) {
  return values.filter((value) => {
    const count = dictionaryWords.filter((word) => predicate(word, value)).length
    return count >= MIN_MATCHING_WORDS
  })
}

function buildPrefixes() {
  const values = new Set<string>()

  for (const word of dictionaryWords) {
    if (word.length >= 1) values.add(word.slice(0, 1))
    if (word.length >= 2) values.add(word.slice(0, 2))
    if (word.length >= 3) values.add(word.slice(0, 3))
  }

  return countMatches([...values].sort(), (word, value) =>
    word.startsWith(value)
  )
}

function buildSuffixes() {
  const values = new Set<string>()

  for (const word of dictionaryWords) {
    if (word.length >= 1) values.add(word.slice(-1))
    if (word.length >= 2) values.add(word.slice(-2))
    if (word.length >= 3) values.add(word.slice(-3))
    if (word.length >= 4) values.add(word.slice(-4))
  }

  return countMatches([...values].sort(), (word, value) =>
    word.endsWith(value)
  )
}

function buildContains() {
  const values = new Set<string>()

  for (const word of dictionaryWords) {
    for (let size = 2; size <= 3; size++) {
      for (let index = 0; index <= word.length - size; index++) {
        values.add(word.slice(index, index + size))
      }
    }
  }

  return countMatches([...values].sort(), (word, value) =>
    word.includes(value)
  )
}

export function getSeoInventory() {
  return {
    lengths: Array.from({ length: 14 }, (_, index) => index + 2),
    prefixes: buildPrefixes(),
    suffixes: buildSuffixes(),
    contains: buildContains(),
  }
}