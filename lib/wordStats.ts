const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1,
  f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1,
  p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4,
  z: 10,
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

export function getScrabbleScore(word: string) {
  return word
    .toLowerCase()
    .split('')
    .reduce((total, letter) => total + (SCRABBLE_SCORES[letter] || 0), 0)
}

export function getWordStats(word: string) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '')
  const letters = clean.split('')

  const vowels = letters.filter((letter) => VOWELS.has(letter)).length
  const consonants = letters.filter((letter) => !VOWELS.has(letter)).length

  return {
    word: clean,
    length: clean.length,
    score: getScrabbleScore(clean),
    vowels,
    consonants,
    firstLetter: clean[0] || '',
    lastLetter: clean[clean.length - 1] || '',
  }
}