import Link from 'next/link'
import { getMostRelatedWords } from '@/lib/wordRelationships'
import { getWordStats } from '@/lib/wordStats'

type MostRelatedWordsProps = {
  word: string
}

export function MostRelatedWords({ word }: MostRelatedWordsProps) {
  const related = getMostRelatedWords(word, 18)

  if (!related.length) return null

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Most Related Words</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Words most closely connected to{' '}
        <span className="font-bold uppercase text-ink">{word}</span> by length,
        score, shared letters, prefixes, suffixes, vowels, and consonants.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => {
          const stats = getWordStats(item.word)

          return (
            <Link
              key={item.word}
              href={`/word/${item.word}`}
              className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold text-ink hover:text-brand"
            >
              <span className="block uppercase">{item.word}</span>

              <span className="mt-1 block text-xs font-semibold text-gray-500">
                {stats.length} letters · {stats.score} pts · match {item.score}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}