import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { PageStats } from '@/components/seo/PageStats'
import { PageFaq } from '@/components/seo/PageFaq'
import Link from 'next/link'
<Breadcrumbs
  items={[
    { title: 'Home', href: '/' },
    { title: 'Word Lists' },
    { title },
  ]}
/>

export type SeoRelatedLink = {
  title: string
  href: string
}

export type SeoWordPageProps = {
  title: string
  description: string
  words: string[]
  relatedLinks?: SeoRelatedLink[]
}

export function SeoWordPage({
  title,
  description,
  words,
  relatedLinks = [],
}: SeoWordPageProps) {
 const uniqueWords = Array.from(new Set(words))
const visibleWords = uniqueWords.slice(0, 300)
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          UnscrambleHQ Word List
        </p>

        <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
        {uniqueWords.length} matching words found
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black text-slate-950">Word List</h2>

        {visibleWords.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {visibleWords.map((word) => (
              <Link
                key={word}
                href={`/word/${word}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
              >
                {word}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            No matching words found yet.
          </div>
        )}

       {uniqueWords.length > visibleWords.length && (
          <p className="mt-4 text-sm text-slate-500">
            Showing the first {visibleWords.length} results.
          </p>
        )}
      </section>

      {relatedLinks.length > 0 && (
        <section className="mt-12 rounded-3xl bg-slate-50 p-6">
          <h2 className="text-2xl font-black text-slate-950">
            Related Searches
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-700"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-black text-slate-950">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-bold text-slate-900">
              What is this word list used for?
            </h3>
            <p className="mt-2 text-slate-600">
              This list helps with word games, anagrams, Scrabble-style games,
              Wordle-style puzzles, crossword clues, and general vocabulary
              searches.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              How are these words selected?
            </h3>
            <p className="mt-2 text-slate-600">
              Words are selected from the UnscrambleHQ dictionary and filtered
              using the page criteria, such as length, prefix, suffix, or
              contained letters.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}