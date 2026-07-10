import { getWordIntelligence } from '@/lib/wordIntelligence'

type Props = {
  word: string
}

export function WordUsageInsights({ word }: Props) {
  const intel = getWordIntelligence(word)

  const insights = [
    `This word contains ${intel.length} letters and is suitable for medium-length word games.`,
    `Its consonant/vowel pattern is ${intel.cvPattern}, making it relatively ${
      intel.vowels >= intel.consonants ? 'easy' : 'challenging'
    } to recognize.`,
    `With a Scrabble score of ${intel.score}, it offers ${
      intel.score >= 12 ? 'strong' : 'moderate'
    } scoring potential.`,
    `The word begins with ${intel.firstLetter.toUpperCase()} and ends with ${intel.lastLetter.toUpperCase()}, making it useful for solving pattern-based puzzles.`,
    intel.isIsogram
      ? 'Every letter appears only once.'
      : 'Some letters repeat, which can be useful when identifying anagrams.',
  ]

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">
        Word Usage Insights
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Practical observations about how this word performs in different
        word games and puzzle situations.
      </p>

      <div className="mt-5 space-y-3">
        {insights.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-soft px-5 py-4 text-sm leading-6 text-gray-700"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}