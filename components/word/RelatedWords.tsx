import Link from 'next/link'
import { getWordStats } from '@/lib/wordStats'

export function RelatedWords({
  words,
}: {
  words: { word: string; definition: string }[]
}) {
  if (!words.length) return null

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black text-ink">Related Words</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {words.map((item) => {
          const stats = getWordStats(item.word)

          return (
            <Link
              key={item.word}
              href={`/word/${item.word}`}
              className="rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-brand hover:shadow-soft"
            >
              <h3 className="text-xl font-black uppercase text-ink">
                {item.word}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                {item.definition || 'Definition coming soon.'}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-gray-600">
                <span className="rounded-xl bg-soft px-3 py-2">
                  {stats.length} letters
                </span>
                <span className="rounded-xl bg-soft px-3 py-2">
                  {stats.score} pts
                </span>
                <span className="rounded-xl bg-soft px-3 py-2">
                  Starts {stats.firstLetter.toUpperCase()}
                </span>
                <span className="rounded-xl bg-soft px-3 py-2">
                  Ends {stats.lastLetter.toUpperCase()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}