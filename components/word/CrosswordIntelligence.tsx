import { getWordIntelligence } from '@/lib/wordIntelligence'

type CrosswordIntelligenceProps = {
  word: string
}

function getCrosswordDifficulty(length: number, vowels: number, score: number) {
  if (length <= 4 && vowels >= 1) return 'Easy'
  if (length >= 8 || score >= 14) return 'Hard'
  return 'Medium'
}

function getClueStyle(length: number) {
  if (length <= 4) return 'short fill'
  if (length <= 7) return 'standard crossword entry'
  return 'longer themed answer'
}

export function CrosswordIntelligence({ word }: CrosswordIntelligenceProps) {
  const intel = getWordIntelligence(word)

  const difficulty = getCrosswordDifficulty(
    intel.length,
    intel.vowels,
    intel.score
  )

  const clueStyle = getClueStyle(intel.length)

  const notes = [
    `${intel.uppercase} is a ${intel.length}-letter ${clueStyle}.`,
    `It starts with ${intel.firstLetter.toUpperCase()} and ends with ${intel.lastLetter.toUpperCase()}, which helps narrow crossword crossings.`,
    `It contains ${intel.vowels} vowel${intel.vowels === 1 ? '' : 's'} and ${intel.consonants} consonant${intel.consonants === 1 ? '' : 's'}.`,
    `Its vowel/consonant pattern is ${intel.cvPattern}.`,
    `Crossword difficulty estimate: ${difficulty}.`,
  ]

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Crossword Intelligence</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Crossword-style clues, crossing help, and pattern notes for{' '}
        <span className="font-bold uppercase text-ink">{intel.word}</span>.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {notes.map((note) => (
          <div
            key={note}
            className="rounded-2xl bg-soft px-4 py-3 text-sm font-semibold leading-6 text-gray-700"
          >
            {note}
          </div>
        ))}
      </div>
    </section>
  )
}