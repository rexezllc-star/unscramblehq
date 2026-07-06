import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { RelatedWords } from '@/components/word/RelatedWords'
import { WordHero } from '@/components/word/WordHero'
import { getRelatedWords, getWordEntry } from '@/lib/word'
import { getWordStats } from '@/lib/wordStats'

type PageProps = {
  params: Promise<{ word: string }>
}

const siteUrl = 'https://www.unscramblehq.com'

export async function generateMetadata({ params }: PageProps) {
  const { word } = await params
  const entry = getWordEntry(word)

  if (!entry) return { title: 'Word Not Found | UnscrambleHQ' }

  const title = `${entry.word.toUpperCase()} Meaning, Scrabble Score & Word Details | UnscrambleHQ`
  const description = `Learn ${entry.word}'s definition, Scrabble score, word length, vowels, consonants, related words, and useful word game details.`
  const url = `${siteUrl}/word/${entry.word}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'UnscrambleHQ',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function WordPage({ params }: PageProps) {
  const { word } = await params
  const entry = getWordEntry(word)

  if (!entry) notFound()

  const stats = getWordStats(entry.word)
  const related = getRelatedWords(entry.word)
  const url = `${siteUrl}/word/${entry.word}`

  const startsWithTwo = entry.word.slice(0, 2).toLowerCase()
  const endsWithTwo = entry.word.slice(-2).toLowerCase()
  const containsMiddle =
    entry.word.length >= 3
      ? entry.word.slice(1, Math.min(entry.word.length, 4)).toLowerCase()
      : entry.word.toLowerCase()

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.word,
    description: entry.definition,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'UnscrambleHQ English Word Dictionary',
      url: siteUrl,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: entry.word.toUpperCase(),
        item: url,
      },
    ],
  }

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-soft/40 py-12">
        <div className="container-page">
          <div className="mb-6 text-sm font-bold text-gray-500">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="uppercase text-ink">{entry.word}</span>
          </div>

          <WordHero word={entry} />

          <section className="mt-10 grid gap-4 md:grid-cols-4">
            <StatCard label="Scrabble Score" value={stats.score} />
            <StatCard label="Letters" value={stats.length} />
            <StatCard label="Vowels" value={stats.vowels} />
            <StatCard label="Consonants" value={stats.consonants} />
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-line bg-white p-6 lg:col-span-2">
              <h2 className="text-2xl font-black text-ink">
                Word Intelligence
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Explore the word{' '}
                <span className="font-bold uppercase text-ink">
                  {entry.word}
                </span>{' '}
                with its definition, score, letter pattern, and useful word game
                details.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info label="Definition" value={entry.definition || 'Definition coming soon.'} />
                <Info label="Length" value={`${stats.length} letters`} />
                <Info label="Starts With" value={stats.firstLetter.toUpperCase()} />
                <Info label="Ends With" value={stats.lastLetter.toUpperCase()} />
                <Info label="Vowels" value={stats.vowels} />
                <Info label="Consonants" value={stats.consonants} />
                <Info
                  label="Letters"
                  value={entry.word.split('').join(', ').toUpperCase()}
                />
                <Info
                  label="Use Case"
                  value="Useful for Scrabble, Wordle, crosswords, anagrams, and other word games."
                />
              </div>
            </div>

            <aside className="rounded-3xl border border-line bg-white p-6">
              <h2 className="text-xl font-black text-ink">Related Searches</h2>

              <div className="mt-4 grid gap-3 text-sm font-bold">
                <RelatedSearch href="/" label={`Unscramble ${entry.word}`} />
                <RelatedSearch
                  href={`/${stats.length}-letter-words`}
                  label={`${stats.length} Letter Words`}
                />
                <RelatedSearch
                  href={`/words-starting-with-${startsWithTwo}`}
                  label={`Words starting with ${startsWithTwo.toUpperCase()}`}
                />
                <RelatedSearch
                  href={`/words-ending-in-${endsWithTwo}`}
                  label={`Words ending with ${endsWithTwo.toUpperCase()}`}
                />
                <RelatedSearch
                  href={`/words-containing-${containsMiddle}`}
                  label={`Words containing ${containsMiddle.toUpperCase()}`}
                />
              </div>
            </aside>
          </section>

          <section className="mt-10 rounded-3xl border border-line bg-white p-6">
            <h2 className="text-2xl font-black text-ink">
              Letter Breakdown
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {entry.word.split('').map((letter, index) => (
                <div
                  key={`${letter}-${index}`}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-lg font-black uppercase text-ink"
                >
                  {letter}
                </div>
              ))}
            </div>
          </section>

          <RelatedWords words={related} />
        </div>
      </main>

      <Footer />
    </>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-ink">{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-soft p-5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-gray-700">{value}</p>
    </div>
  )
}

function RelatedSearch({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-soft px-4 py-3 hover:text-brand">
      {label}
    </Link>
  )
}
<InternalLinkGrid
  word={entry.word}
  length={stats.length}
/>