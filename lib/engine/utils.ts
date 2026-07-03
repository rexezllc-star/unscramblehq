export function normalizeLetters(value: string): string {
  return value.toLowerCase().replace(/[^a-z?]/g, '')
}

export function countLetters(value: string): Record<string, number> {
  return normalizeLetters(value).split('').reduce<Record<string, number>>((acc, ch) => {
    acc[ch] = (acc[ch] || 0) + 1
    return acc
  }, {})
}

export function canBuildWord(word: string, letters: string): boolean {
  const available = countLetters(letters)
  let wildcards = available['?'] || 0

  for (const ch of word.toLowerCase()) {
    if (available[ch]) {
      available[ch] -= 1
    } else if (wildcards > 0) {
      wildcards -= 1
    } else {
      return false
    }
  }

  return true
}
