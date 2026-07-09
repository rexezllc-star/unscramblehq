import { getWordStats } from '@/lib/wordStats'

type LetterIntelligenceProps = {
  word: string
}

const LETTER_VALUES: Record<string, number> = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
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
  const bigrams: string[] = []

  for (let index = 0; index < word.length - 1; index += 1) {
    bigrams.push(word.slice(index, index + 2).toUpperCase())
  }

  return bigrams
}

function getTrigrams(word: string) {
  const trigrams: string[] = []

  for (let index = 0; index < word.length - 2; index += 1) {
    trigrams.push(word.slice(index, index + 3).toUpperCase())
  }

  return trigrams
}

export function LetterIntelligence({ word }: LetterIntelligenceProps) {
  const cleanWord = clean(word)
  const stats = getWordStats(cleanWord)

  const letters = cleanWord.split('')
  const uniqueLetters = Array.from(new Set(letters))
  const repeatedLetters = letters.filter(
    (letter, index) => letters.indexOf(letter) !== index
  )

  const highestValueLetter = letters
    .slice()
    .sort((a, b) => (LETTER_VALUES[b] || 0) - (LETTER_VALUES[a] || 0))[0]

  const vowelPercent =
    stats.length > 0 ? Math.round((stats.vowels / stats.length) * 100) : 0

  const consonantPercent = 100 - vowelPercent

  const data = [
    ['Unique Letters', uniqueLetters.length],
    ['Repeated Letters', repeatedLetters.length || 0],
    ['Highest Value Letter', highestValueLetter?.toUpperCase() || '—'],
    ['Letter Pattern', getLetterPattern(cleanWord)],
    ['CV Pattern', getCvPattern(cleanWord)],
    ['Vowel Share', `${vowelPercent}%`],
    ['Consonant Share', `${consonantPercent}%`],
    ['Bigrams', getBigrams(cleanWord).join(', ') || '—'],
    ['Trigrams', getTrigrams(cleanWord).join(', ') || '—'],
  ]

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Letter Intelligence</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        A deeper look at the letter structure, patterns, and useful game signals
        inside <span className="font-bold uppercase text-ink">{cleanWord}</span>.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {data.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-soft p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-gray-500">
              {label}
            </p>
            <p className="mt-2 break-words text-sm font-bold leading-6 text-gray-700">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}