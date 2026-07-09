import { getWordStats } from '@/lib/wordStats'

export type WordIntelligence = {
  word: string
  uppercase: string
  length: number
  score: number
  vowels: number
  consonants: number
  firstLetter: string
  lastLetter: string
  firstTwo: string
  firstThree: string
  lastTwo: string
  lastThree: string
  middle: string
  uniqueLetters: number
  repeatedLetters: number
  isIsogram: boolean
  isPalindrome: boolean
  vowelPercent: number
  consonantPercent: number
  letterPattern: string
  cvPattern: string
  bigrams: string[]
  trigrams: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

function getLetterPattern(word: string) {
  const seen = new Map<string, string>()
  let nextCode = 65

  return word
    .split('')
    .map((letter) => {
      if (!seen.has(letter)) {
        seen.set(letter, String.fromCharCode(nextCode))
        nextCode += 1
      }

      return seen.get(letter)
    })
    .join('')
}

function getCvPattern(word: string) {
  return word
    .split('')
    .map((letter) => ('aeiou'.includes(letter) ? 'V' : 'C'))
    .join('')
}

function getBigrams(word: string) {
  const values: string[] = []

  for (let index = 0; index < word.length - 1; index += 1) {
    values.push(word.slice(index, index + 2).toUpperCase())
  }

  return values
}

function getTrigrams(word: string) {
  const values: string[] = []

  for (let index = 0; index < word.length - 2; index += 1) {
    values.push(word.slice(index, index + 3).toUpperCase())
  }

  return values
}

function getDifficulty(length: number, score: number, repeatedLetters: number) {
  if (length <= 4 && score <= 8) return 'Easy'
  if (length >= 8 || score >= 14 || repeatedLetters >= 2) return 'Hard'
  return 'Medium'
}

export function getWordIntelligence(word: string): WordIntelligence {
  const cleanWord = clean(word)
  const stats = getWordStats(cleanWord)

  const uniqueLetters = new Set(cleanWord.split('')).size
  const repeatedLetters = cleanWord.length - uniqueLetters
  const vowelPercent =
    stats.length > 0 ? Math.round((stats.vowels / stats.length) * 100) : 0
  const consonantPercent = 100 - vowelPercent

  return {
    word: cleanWord,
    uppercase: cleanWord.toUpperCase(),
    length: stats.length,
    score: stats.score,
    vowels: stats.vowels,
    consonants: stats.consonants,
    firstLetter: stats.firstLetter,
    lastLetter: stats.lastLetter,
    firstTwo: cleanWord.slice(0, 2),
    firstThree: cleanWord.slice(0, 3),
    lastTwo: cleanWord.slice(-2),
    lastThree: cleanWord.slice(-3),
    middle: cleanWord.length >= 4 ? cleanWord.slice(1, 4) : cleanWord,
    uniqueLetters,
    repeatedLetters,
    isIsogram: repeatedLetters === 0,
    isPalindrome: cleanWord === cleanWord.split('').reverse().join(''),
    vowelPercent,
    consonantPercent,
    letterPattern: getLetterPattern(cleanWord),
    cvPattern: getCvPattern(cleanWord),
    bigrams: getBigrams(cleanWord),
    trigrams: getTrigrams(cleanWord),
    difficulty: getDifficulty(stats.length, stats.score, repeatedLetters),
  }
}