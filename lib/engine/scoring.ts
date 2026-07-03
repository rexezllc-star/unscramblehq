export const scrabbleLetterScores: Record<string, number> = {
  a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, s: 1, t: 1, r: 1,
  d: 2, g: 2,
  b: 3, c: 3, m: 3, p: 3,
  f: 4, h: 4, v: 4, w: 4, y: 4,
  k: 5,
  j: 8, x: 8,
  q: 10, z: 10
}

export const wordsWithFriendsLetterScores: Record<string, number> = {
  a: 1, e: 1, i: 1, o: 1, r: 1, s: 1, t: 1,
  d: 2, l: 2, n: 2, u: 2,
  g: 3, h: 3, y: 3,
  b: 4, c: 4, f: 4, m: 4, p: 4, w: 4,
  k: 5, v: 5,
  x: 8,
  j: 10, q: 10, z: 10
}

export function scrabbleScore(word: string): number {
  return word.toLowerCase().split('').reduce((sum, ch) => sum + (scrabbleLetterScores[ch] || 0), 0)
}

export function wordsWithFriendsScore(word: string): number {
  return word.toLowerCase().split('').reduce((sum, ch) => sum + (wordsWithFriendsLetterScores[ch] || 0), 0)
}
