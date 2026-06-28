import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { RelatedWords } from '@/components/word/RelatedWords'
import { WordHero } from '@/components/word/WordHero'
import { getRelatedWords, getWordEntry } from '@/lib/word'

type PageProps = {
  params: Promise<{ word: string }>
}

const siteUrl = 'https://unscramblehq.com'

export async function generateMetadata({ params }: PageProps) {
  const { word } = await params
  const entry = getWordEntry(word)

  if (!entry) return { title: 'Word Not Found | UnscrambleHQ' }

  const title = `${entry.word.toUpperCase()} Meaning, Definition, Scrabble Score & Words Made | UnscrambleHQ`
  const description = `Learn the meaning of ${entry.word}, its Scrabble score, Words With Friends score, word length, related words, and useful word game details.`
  const url = `${siteUrl}/word/${entry.word}`

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'UnscrambleHQ',
      type: 'article'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  }
}

export default async function WordPage({ params }: PageProps) {
  const { word } = await params
  const entry = getWordEntry(word)

  if (!entry) notFound()

  const related = getRelatedWords(entry.word)
  const url = `${siteUrl}/word/${entry.word}`

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.word,
    description: entry.definition,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'UnscrambleHQ English Word Dictionary',
      url: siteUrl
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: entry.word.toUpperCase(),
        item: url
      }
    ]
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
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <span className="uppercase text-ink">{entry.word}</span>
          </div>

          <WordHero word={entry} />

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-line bg-white p-6 lg:col-span-2">
              <h2 className="text-2xl font-black text-ink">Word Intelligence</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info label="Definition" value={entry.definition} />
                <Info label="Ends With" value={entry.endsWith.toUpperCase()} />
                <Info label="Contains" value={entry.word.split('').join(', ').toUpperCase()} />
                <Info label="Use Case" value="Useful for Scrabble, Wordle, crosswords, and anagram puzzles." />
              </div>
            </div>

            <aside className="rounded-3xl border border-line bg-white p-6">
              <h2 className="text-xl font-black text-ink">Related Searches</h2>
              <div className="mt-4 grid gap-3 text-sm font-bold">
                <Link href="/" className="rounded-2xl bg-soft px-4 py-3 hover:text-brand">Unscramble {entry.word}</Link>
                <Link href="/" className="rounded-2xl bg-soft px-4 py-3 hover:text-brand">{entry.length} Letter Words</Link>
                <Link href="/" className="rounded-2xl bg-soft px-4 py-3 hover:text-brand">Words starting with {entry.startsWith.toUpperCase()}</Link>
                <Link href="/" className="rounded-2xl bg-soft px-4 py-3 hover:text-brand">Words ending with {entry.endsWith.toUpperCase()}</Link>
              </div>
            </aside>
          </section>

          <RelatedWords words={related} />
        </div>
      </main>

      <Footer />
    </>
  )
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-soft p-5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-gray-700">{value}</p>
    </div>
  )
}