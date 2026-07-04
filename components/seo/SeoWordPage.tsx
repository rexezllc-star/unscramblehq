import Link from 'next/link'

type SeoWordPageProps = {
  title: string
  description: string
  words: string[]
  relatedLinks?: {
    label: string
    href: string
  }[]
}

const DISPLAY_LIMIT = 100

export function SeoWordPage({
  title,
  description,
  words,
  relatedLinks = [],
}: SeoWordPageProps) {
  const uniqueWords = Array.from(new Set(words))
  const visibleWords = uniqueWords.slice(0, DISPLAY_LIMIT)
  const totalWords = uniqueWords.length

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
          UnscrambleHQ Word Lists
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          {description}
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Matching Words
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {totalWords.toLocaleString()} matching word
              {totalWords === 1 ? '' : 's'} found.
            </p>
          </div>

          {totalWords > visibleWords.length && (
            <p className="text-sm text-slate-600">
              Showing first {visibleWords.length.toLocaleString()} of{' '}
              {totalWords.toLocaleString()}.
            </p>
          )}
        </div>

        {visibleWords.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleWords.map((word) => (
              <Link
                key={word}
                href={`/word/${word}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {word}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            No matching words are available for this page yet.
          </p>
        )}
      </section>

      {relatedLinks.length > 0 && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Related Word Lists
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">
          How to use this word list
        </h2>

        <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            Use this page to explore words by pattern, length, starting letters,
            ending letters, or included letter combinations.
          </p>

          <p>
            You can click any word to open its word page, check its letter
            pattern, and use it with UnscrambleHQ word tools.
          </p>
        </div>
      </section>
    </main>
  )
}