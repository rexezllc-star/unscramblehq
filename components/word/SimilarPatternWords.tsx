import Link from 'next/link'
import { getDictionary } from '@/lib/dictionary'
import { getWordStats } from '@/lib/wordStats'

type SimilarPatternWordsProps = {
  word: string
}

type WordGroup = {
  title: string
  description: string
  words: string[]
}

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

function getMatches({
  currentWord,
  predicate,
  limit = 12,
}: {
  currentWord: string
  predicate: (candidate: string) => boolean
  limit?: number
}) {
  return getDictionary()
    .map(clean)
    .filter((candidate) => candidate && candidate !== currentWord)
    .filter(predicate)
    .slice(0, limit)
}

function WordGroupCard({ group }: { group: WordGroup }) {
  if (!group.words.length) return null

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <h3 className="text-xl font-black text-ink">{group.title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {group.description}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {group.words.map((item) => {
          const stats = getWordStats(item)

          return (
            <Link
              key={item}
              href={`/word/${item}`}
              className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold text-ink hover:text-brand"
            >
              <span className="block uppercase">{item}</span>
              <span className="mt-1 block text-xs font-semibold text-gray-500">
                {stats.length} letters · {stats.score} pts
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function SimilarPatternWords({ word }: SimilarPatternWordsProps) {
  const currentWord = clean(word)

  if (!currentWord || currentWord.length < 2) return null

  const stats = getWordStats(currentWord)

  const first = currentWord.slice(0, 1)
  const firstTwo = currentWord.slice(0, 2)
  const last = currentWord.slice(-1)
  const lastTwo = currentWord.slice(-2)

  const groups: WordGroup[] = [
    {
      title: `Other ${stats.length} Letter Words`,
      description: `Words with the same length as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => candidate.length === stats.length,
      }),
    },
    {
      title: `Words Starting With ${first.toUpperCase()}`,
      description: `Words that begin with the same first letter as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => candidate.startsWith(first),
      }),
    },
    {
      title: `Words Ending In ${last.toUpperCase()}`,
      description: `Words that end with the same final letter as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => candidate.endsWith(last),
      }),
    },
    {
      title: `Words Starting With ${firstTwo.toUpperCase()}`,
      description: `Words that share the same opening letter pair as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => candidate.startsWith(firstTwo),
      }),
    },
    {
      title: `Words Ending In ${lastTwo.toUpperCase()}`,
      description: `Words that share the same ending letter pair as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => candidate.endsWith(lastTwo),
      }),
    },
    {
      title: `Words With ${stats.vowels} Vowels`,
      description: `Words with the same vowel count as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => getWordStats(candidate).vowels === stats.vowels,
      }),
    },
    {
      title: `Words With ${stats.consonants} Consonants`,
      description: `Words with the same consonant count as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) =>
          getWordStats(candidate).consonants === stats.consonants,
      }),
    },
    {
      title: `Other ${stats.score} Point Words`,
      description: `Words with the same Scrabble score as ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => getWordStats(candidate).score === stats.score,
      }),
    },
    {
      title: 'Higher Scoring Words',
      description: `Words with a higher Scrabble score than ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => getWordStats(candidate).score > stats.score,
      }),
    },
    {
      title: 'Lower Scoring Words',
      description: `Words with a lower Scrabble score than ${currentWord.toUpperCase()}.`,
      words: getMatches({
        currentWord,
        predicate: (candidate) => getWordStats(candidate).score < stats.score,
      }),
    },
  ]

  const visibleGroups = groups.filter((group) => group.words.length > 0)

  if (!visibleGroups.length) return null

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-ink">
          Similar Pattern Words
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Explore words connected to{' '}
          <span className="font-bold uppercase text-ink">{currentWord}</span>{' '}
          by length, starting letters, ending letters, vowel count, consonant
          count, and Scrabble score.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {visibleGroups.map((group) => (
          <WordGroupCard key={group.title} group={group} />
        ))}
      </div>
    </section>
  )
}