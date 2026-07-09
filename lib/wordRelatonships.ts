import { getDictionary } from '@/lib/dictionary'
import { getWordStats } from '@/lib/wordStats'

export type RelatedWord = {
  word: string
  score: number
}

function clean(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, '')
}

function sharedPrefix(a: string, b: string) {
  let count = 0

  while (
    count < a.length &&
    count < b.length &&
    a[count] === b[count]
  ) {
    count++
  }

  return count
}

function sharedSuffix(a: string, b: string) {
  let count = 0

  while (
    count < a.length &&
    count < b.length &&
    a[a.length - 1 - count] === b[b.length - 1 - count]
  ) {
    count++
  }

  return count
}

function letterOverlap(a: string, b: string) {
  const setA = new Set(a.split(''))
  const setB = new Set(b.split(''))

  let overlap = 0

  setA.forEach((letter) => {
    if (setB.has(letter)) overlap++
  })

  return overlap
}

function relationshipScore(source: string, candidate: string) {
  const sourceStats = getWordStats(source)
  const candidateStats = getWordStats(candidate)

  let score = 0

  // identical length
  if (source.length === candidate.length)
    score += 25

  // first letter
  if (source[0] === candidate[0])
    score += 12

  // last letter
  if (source.at(-1) === candidate.at(-1))
    score += 12

  // same Scrabble score
  if (sourceStats.score === candidateStats.score)
    score += 20

  // same vowel count
  if (sourceStats.vowels === candidateStats.vowels)
    score += 10

  // same consonant count
  if (sourceStats.consonants === candidateStats.consonants)
    score += 10

  // shared prefix
  score += sharedPrefix(source, candidate) * 8

  // shared suffix
  score += sharedSuffix(source, candidate) * 8

  // shared letters
  score += letterOverlap(source, candidate) * 3

  // small penalty for large length differences
  score -= Math.abs(source.length - candidate.length) * 4

  return score
}

export function getMostRelatedWords(
  word: string,
  limit = 18
): RelatedWord[] {

  const current = clean(word)

  return getDictionary()
    .map(clean)
    .filter((candidate) => candidate !== current)
    .map((candidate) => ({
      word: candidate,
      score: relationshipScore(current, candidate),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getRelationshipGroups(word: string) {

  const current = clean(word)

  const related = getMostRelatedWords(current, 120)

  return {
    strongest: related.slice(0, 12),

    medium: related.slice(12, 36),

    extended: related.slice(36, 72),

    discovery: related.slice(72, 120),
  }
}