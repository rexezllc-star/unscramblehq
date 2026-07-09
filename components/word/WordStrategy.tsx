import { getWordStats } from '@/lib/wordStats'

type WordStrategyProps = {
  word: string
}

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

function getRating(score: number) {
  if (score >= 14) return '★★★★★'
  if (score >= 10) return '★★★★☆'
  if (score >= 7) return '★★★☆☆'
  if (score >= 4) return '★★☆☆☆'
  return '★☆☆☆☆'
}

export function WordStrategy({ word }: WordStrategyProps) {
  const cleanWord = clean(word)
  const stats = getWordStats(cleanWord)

  const hasCommonVowel = /[aeiou]/.test(cleanWord)
  const hasRareLetter = /[qxzj]/.test(cleanWord)
  const hasRepeatedLetter = new Set(cleanWord.split('')).size < cleanWord.length
  const isWordleLength = stats.length === 5

  const strategies = [
    {
      title: 'Scrabble Strategy',
      rating: getRating(stats.score),
      body: hasRareLetter
        ? `${cleanWord.toUpperCase()} can be valuable in Scrabble because it includes a high-impact letter. Look for premium squares and parallel plays.`
        : `${cleanWord.toUpperCase()} has a Scrabble score of ${stats.score}. It is useful for balancing a rack and building steady board position.`,
    },
    {
      title: 'Wordle Strategy',
      rating: isWordleLength ? '★★★★☆' : '★★☆☆☆',
      body: isWordleLength
        ? `${cleanWord.toUpperCase()} is a five-letter word, so it can be considered in Wordle-style solving. ${hasCommonVowel ? 'It includes common vowel information that can help narrow guesses.' : 'It has limited vowel coverage, so it may work better after a stronger opener.'}`
        : `${cleanWord.toUpperCase()} is not five letters, so it is not a standard Wordle answer, but its letter pattern can still help with word analysis.`,
    },
    {
      title: 'Crossword Strategy',
      rating: stats.length <= 6 ? '★★★★☆' : '★★★☆☆',
      body: `${cleanWord.toUpperCase()} can be useful in crossword solving because it has a clear starting letter, ending letter, and ${stats.length}-letter structure.`,
    },
    {
      title: 'Anagram Strategy',
      rating: hasRepeatedLetter ? '★★★☆☆' : '★★★★☆',
      body: hasRepeatedLetter
        ? `${cleanWord.toUpperCase()} contains repeated letters, which can make anagram solving more constrained but also easier to pattern-match.`
        : `${cleanWord.toUpperCase()} uses unique letters, giving more flexibility when checking possible anagrams and word game combinations.`,
    },
  ]

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Word Strategy</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Strategy notes for using{' '}
        <span className="font-bold uppercase text-ink">{cleanWord}</span> in
        Scrabble, Wordle-style games, crosswords, and anagram solving.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {strategies.map((strategy) => (
          <div key={strategy.title} className="rounded-2xl bg-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-black text-ink">{strategy.title}</h3>
              <span className="text-sm font-black text-brand">
                {strategy.rating}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              {strategy.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}