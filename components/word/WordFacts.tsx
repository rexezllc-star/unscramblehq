import { getWordStats } from '@/lib/wordStats'

type WordFactsProps = {
  word: string
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

export function WordFacts({ word }: WordFactsProps) {
  const cleanWord = clean(word)
  const stats = getWordStats(cleanWord)

  const uniqueLetters = new Set(cleanWord.split('')).size
  const repeatedLetters = cleanWord.length - uniqueLetters
  const isIsogram = repeatedLetters === 0
  const isPalindrome = cleanWord === cleanWord.split('').reverse().join('')
  const vowelPercent =
    stats.length > 0 ? Math.round((stats.vowels / stats.length) * 100) : 0

  const facts = [
    `${cleanWord.toUpperCase()} is a ${stats.length}-letter word.`,
    `It has a Scrabble score of ${stats.score}.`,
    `It starts with ${stats.firstLetter.toUpperCase()} and ends with ${stats.lastLetter.toUpperCase()}.`,
    `It contains ${stats.vowels} vowel${stats.vowels === 1 ? '' : 's'} and ${stats.consonants} consonant${stats.consonants === 1 ? '' : 's'}.`,
    `Its vowel share is about ${vowelPercent}%.`,
    isIsogram
      ? 'It is an isogram, meaning no letter repeats.'
      : `It has ${repeatedLetters} repeated letter${repeatedLetters === 1 ? '' : 's'}.`,
    isPalindrome
      ? 'It is a palindrome.'
      : 'It is not a palindrome.',
    `Letter pattern: ${getLetterPattern(cleanWord)}.`,
    `Vowel/consonant pattern: ${getCvPattern(cleanWord)}.`,
  ]

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Word Facts</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Key letter, score, and pattern facts for{' '}
        <span className="font-bold uppercase text-ink">{cleanWord}</span>.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact}
            className="rounded-2xl bg-soft px-4 py-3 text-sm font-semibold leading-6 text-gray-700"
          >
            {fact}
          </div>
        ))}
      </div>
    </section>
  )
}