import { getDictionary } from '@/lib/dictionary'
import { getWordStats } from '@/lib/wordStats'
import { getWordIntelligence } from '@/lib/wordIntelligence'

export type RelatedWord = {
  word: string
  score: number
}

function clean(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, '')
}

function sharedPrefix(a: string, b: string) {
  let count = 0

  while (count < a.length && count < b.length && a[count] === b[count]) {
    count += 1
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
    count += 1
  }

  return count
}

function letterOverlap(a: string, b: string) {
  const setA = new Set(a.split(''))
  const setB = new Set(b.split(''))

  let overlap = 0

  setA.forEach((letter) => {
    if (setB.has(letter)) overlap += 1
  })

  return overlap
}

function sharedBigrams(a: string[], b: string[]) {
  const setB = new Set(b)
  return a.filter((item) => setB.has(item)).length
}

function sharedTrigrams(a: string[], b: string[]) {
  const setB = new Set(b)
  return a.filter((item) => setB.has(item)).length
}

function hasSameRepeatedLetterProfile(a: string, b: string) {
  const repeatedA = new Set(
    a.split('').filter((letter, index, letters) => letters.indexOf(letter) !== index)
  )

  const repeatedB = new Set(
    b.split('').filter((letter, index, letters) => letters.indexOf(letter) !== index)
  )

  if (repeatedA.size === 0 && repeatedB.size === 0) return true
  if (repeatedA.size !== repeatedB.size) return false

  for (const letter of repeatedA) {
    if (!repeatedB.has(letter)) return false
  }

  return true
}

function relationshipScore(source: string, candidate: string) {
  const sourceStats = getWordStats(source)
  const candidateStats = getWordStats(candidate)

  const sourceIntel = getWordIntelligence(source)
  const candidateIntel = getWordIntelligence(candidate)

  let score = 0

  if (source.length === candidate.length) score += 28
  if (source[0] === candidate[0]) score += 14
  if (source.at(-1) === candidate.at(-1)) score += 14

  if (sourceStats.score === candidateStats.score) score += 22
  if (Math.abs(sourceStats.score - candidateStats.score) <= 2) score += 8

  if (sourceStats.vowels === candidateStats.vowels) score += 12
  if (sourceStats.consonants === candidateStats.consonants) score += 12

  score += sharedPrefix(source, candidate) * 10
  score += sharedSuffix(source, candidate) * 10
  score += letterOverlap(source, candidate) * 4

  score += sharedBigrams(sourceIntel.bigrams, candidateIntel.bigrams) * 14
  score += sharedTrigrams(sourceIntel.trigrams, candidateIntel.trigrams) * 20

  if (sourceIntel.letterPattern === candidateIntel.letterPattern) score += 18
  if (sourceIntel.cvPattern === candidateIntel.cvPattern) score += 16
  if (sourceIntel.difficulty === candidateIntel.difficulty) score += 6
  if (sourceIntel.isIsogram === candidateIntel.isIsogram) score += 4
  if (sourceIntel.isPalindrome === candidateIntel.isPalindrome) score += 2

  if (hasSameRepeatedLetterProfile(source, candidate)) score += 8

  score -= Math.abs(source.length - candidate.length) * 5

  return score
}

export function getMostRelatedWords(word: string, limit = 18): RelatedWord[] {
  const current = clean(word)

  if (!current) return []

  return getDictionary()
    .map(clean)
    .filter((candidate) => candidate && candidate !== current)
    .map((candidate) => ({
      word: candidate,
      score: relationshipScore(current, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
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