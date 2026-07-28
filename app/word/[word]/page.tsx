import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid'
import { CrosswordIntelligence } from '@/components/word/CrosswordIntelligence'
import { LetterIntelligence } from '@/components/word/LetterIntelligence'
import { MostRelatedWords } from '@/components/word/MostRelatedWords'
import { RelatedWords } from '@/components/word/RelatedWords'
import { SimilarPatternWords } from '@/components/word/SimilarPatternWords'
import { SimilarScoreWords } from '@/components/word/SimilarScoreWords'
import { WordFacts } from '@/components/word/WordFacts'
import { WordFamilyGraph } from '@/components/word/WordFamilyGraph'
import { WordFamilyLinks } from '@/components/word/WordFamilyLinks'
import { WordGraphLinks } from '@/components/word/WordGraphLinks'
import { WordHero } from '@/components/word/WordHero'
import { WordIntelligenceLinks } from '@/components/word/WordIntelligenceLinks'
import { WordStrategy } from '@/components/word/WordStrategy'
import { WordUsageInsights } from '@/components/word/WordUsageInsights'
import { getRelatedWords, getWordEntry } from '@/lib/word'
import { getWordStats } from '@/lib/wordStats'

type PageProps = {
  params: Promise<{
    word: string
  }>
}

type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  description: string
}

type RelatedSearchProps = {
  href: string
  label: string
}

const SITE_URL = 'https://www.unscramblehq.com'

export async function generateMetadata({ params }: PageProps) {
  const { word } = await params
  const entry = getWordEntry(word)

  if (!entry) {
    return {
      title: 'Word Not Found | UnscrambleHQ',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const normalizedWord = entry.word.toLowerCase()
  const displayWord = entry.word.toUpperCase()
  const url = `${SITE_URL}/word/${normalizedWord}`

  const title = `${displayWord} Meaning, Scrabble Score & Word Details | UnscrambleHQ`
  const description = `Learn the definition of ${entry.word}, its Scrabble score, word length, vowels, consonants, related words, and useful word-game details.`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
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

  if (!entry) {
    notFound()
  }

  const normalizedWord = entry.word.toLowerCase()
  const displayWord = entry.word.toUpperCase()

  const stats = getWordStats(normalizedWord)
  const relatedWords = getRelatedWords(normalizedWord)
  const url = `${SITE_URL}/word/${normalizedWord}`

  const startsWithTwo = normalizedWord.slice(0, 2)
  const endsWithTwo = normalizedWord.slice(-2)
  const containsMiddle =
    normalizedWord.length >= 3
      ? normalizedWord.slice(1, Math.min(normalizedWord.length, 4))
      : normalizedWord

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.word,
    description:
      entry.definition || `Dictionary and word-game information for ${entry.word}.`,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'UnscrambleHQ English Word Dictionary',
      url: SITE_URL,
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
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: displayWord,
        item: url,
      },
    ],
  }

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(definedTermSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="bg-soft/40 py-8 md:py-12">
        <div className="container-page">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm font-bold text-gray-500"
          >
            <Link href="/" className="transition hover:text-brand">
              Home
            </Link>

            <span className="mx-2" aria-hidden="true">
              /
            </span>

            <span aria-current="page" className="uppercase text-ink">
              {entry.word}
            </span>
          </nav>

          <WordHero word={entry} />

          <section
            aria-labelledby="related-searches-heading"
            className="mt-8 rounded-3xl border border-line bg-white p-6"
          >
            <h2
              id="related-searches-heading"
              className="text-xl font-black text-ink"
            >
              Related Searches
            </h2>

            <div className="mt-4 grid gap-3 text-sm font-bold sm:grid-cols-2 lg:grid-cols-5">
              <RelatedSearch
                href={`/?letters=${encodeURIComponent(normalizedWord)}`}
                label={`Unscramble ${displayWord}`}
              />

              <RelatedSearch
                href={`/${stats.length}-letter-words`}
                label={`${stats.length} Letter Words`}
              />

              <RelatedSearch
                href={`/words-starting-with-${startsWithTwo}`}
                label={`Starts with ${startsWithTwo.toUpperCase()}`}
              />

              <RelatedSearch
                href={`/words-ending-in-${endsWithTwo}`}
                label={`Ends with ${endsWithTwo.toUpperCase()}`}
              />

              <RelatedSearch
                href={`/words-containing-${containsMiddle}`}
                label={`Contains ${containsMiddle.toUpperCase()}`}
              />
            </div>
          </section>

          <section aria-labelledby="learn-heading" className="mt-14">
            <SectionHeading
              id="learn-heading"
              eyebrow="Learn"
              title={`Understand ${displayWord}`}
              description="Review its letter structure, factual properties, usage signals, and practical word-game value."
            />

            <section
              aria-labelledby="letter-breakdown-heading"
              className="mt-8 rounded-3xl border border-line bg-white p-6"
            >
              <h3
                id="letter-breakdown-heading"
                className="text-2xl font-black text-ink"
              >
                Letter Breakdown
              </h3>

              <div
                className="mt-5 flex flex-wrap gap-3"
                aria-label={`Letters in ${entry.word}`}
              >
                {normalizedWord.split('').map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-lg font-black uppercase text-ink"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </section>

            <WordFacts word={normalizedWord} />
            <LetterIntelligence word={normalizedWord} />
            <WordUsageInsights word={normalizedWord} />
            <WordStrategy word={normalizedWord} />
          </section>

          <section aria-labelledby="explore-heading" className="mt-16">
            <SectionHeading
              id="explore-heading"
              eyebrow="Explore"
              title="Related Words and Patterns"
              description="Explore closely related terms, shared letter patterns, comparable scores, and crossword connections."
            />

            <WordFamilyGraph word={normalizedWord} />
            <MostRelatedWords word={normalizedWord} />
            <RelatedWords words={relatedWords} />
            <SimilarPatternWords word={normalizedWord} />
            <SimilarScoreWords
              word={normalizedWord}
              score={stats.score}
            />
            <CrosswordIntelligence word={normalizedWord} />
          </section>

          <section aria-labelledby="continue-heading" className="mt-16">
            <SectionHeading
              id="continue-heading"
              eyebrow="Continue"
              title="Keep Exploring UnscrambleHQ"
              description="Use these word families, intelligence paths, and curated word lists to continue exploring."
            />

            <WordGraphLinks word={normalizedWord} />

            <WordIntelligenceLinks
              word={normalizedWord}
              length={stats.length}
              score={stats.score}
              vowels={stats.vowels}
              consonants={stats.consonants}
            />

            <WordFamilyLinks word={normalizedWord} />

            <InternalLinkGrid
              word={normalizedWord}
              length={stats.length}
              prefix={startsWithTwo}
              suffix={endsWithTwo}
              contains={containsMiddle}
            />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">
        {eyebrow}
      </p>

      <h2
        id={id}
        className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl"
      >
        {title}
      </h2>

      <p className="mt-3 text-base leading-7 text-gray-600">
        {description}
      </p>
    </header>
  )
}

function RelatedSearch({ href, label }: RelatedSearchProps) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-soft px-4 py-3 transition hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
    >
      {label}
    </Link>
  )
}