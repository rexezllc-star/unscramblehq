import Link from 'next/link'
import { getDictionary } from '@/lib/dictionary'
import { getWordStats } from '@/lib/wordStats'

type SimilarScoreWordsProps = {
  word: string
  score: number
}

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

export function SimilarScoreWords({ word, score }: SimilarScoreWordsProps) {
  const cleanWord = clean(word)

  const similarWords = getDictionary()
    .filter((item) => {
      const candidate = clean(item)
      return candidate !== cleanWord && getWordStats(candidate).score === score
    })
    .slice(0, 18)

  if (!similarWords.length) return null

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">
        Other {score} Point Words
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        These words have the same Scrabble score as{' '}
        <span className="font-bold uppercase text-ink">{word}</span>.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {similarWords.map((item) => {
          const stats = getWordStats(item)

          return (
            <Link
              key={item}
              href={`/word/${item}`}
              className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold text-ink hover:text-brand"
            >
              <span className="block uppercase">{item}</span>
              <span className="mt-1 block text-xs text-gray-500">
                {stats.length} letters · {stats.score} points
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}