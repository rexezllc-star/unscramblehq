import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { PageFaq } from '@/components/seo/PageFaq'
import { PageStats } from '@/components/seo/PageStats'
import { WordTable } from '@/components/seo/WordTable'
import Link from 'next/link'

export type SeoRelatedLink = {
  title: string
  href: string
}

type Props = {
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
}: Props) {
  const uniqueWords = Array.from(new Set(words))
  const visibleWords = uniqueWords.slice(0, 300)

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Breadcrumbs
        items={[
          { title: 'Home', href: '/' },
          { title: 'Word Lists' },
          { title },
        ]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          UnscrambleHQ Word List
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>

        <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
          {uniqueWords.length} matching words found
        </p>
      </section>

      <PageStats words={visibleWords} />

      <section className="mt-10">
        <h2 className="text-2xl font-black text-slate-950">Word List</h2>

        <WordTable words={visibleWords} />

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

      <PageFaq title={title} words={visibleWords} />
    </main>
  )
}