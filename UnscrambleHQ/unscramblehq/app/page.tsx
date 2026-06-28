import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Unscrambler } from '@/components/Unscrambler'

const faq = [
  [
    'How does a word unscrambler work?',
    'A word unscrambler compares the letters you enter against a dictionary and returns valid words that can be made from those letters.'
  ],
  [
    'Can I use UnscrambleHQ for Scrabble?',
    'Yes. UnscrambleHQ shows Scrabble-style scores so you can quickly identify stronger word plays.'
  ],
  [
    'Can I use this for Wordle?',
    'Yes. Use length, starts with, ends with, contains, and exclude filters to narrow possible Wordle answers.'
  ],
  [
    'What is an anagram?',
    'An anagram is a word or phrase made by rearranging the letters of another word or phrase.'
  ],
  [
    'How are Scrabble scores calculated?',
    'Scrabble scores are calculated by adding the point value of each letter in a word.'
  ]
]

const popularSearches = [
  '5 Letter Words',
  '6 Letter Words',
  'Anagram Solver',
  'Word Finder',
  'Wordle Helper',
  'Scrabble Word Finder',
  'Crossword Solver',
  'Words With Q'
]

const features = [
  ['⚡', 'Fast Results', 'Enter letters and instantly find useful word options.'],
  ['🏆', 'Scrabble Scores', 'Spot higher-scoring words without doing the math yourself.'],
  ['🎯', 'Wordle Filters', 'Narrow words by length, starting letters, endings, and exclusions.'],
  ['📚', 'Built for Growth', 'Designed to expand into an entire word tools platform.']
]

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  }

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#eef2ff,_#ffffff_55%)] pb-8 pt-12 md:pb-10 md:pt-16">
          <div className="container-page text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-brand shadow-sm">
              <span>⚡</span>
              <span>Fast word tools for Scrabble, Wordle, anagrams, and crosswords</span>
            </div>

            <h1 className="mx-auto max-w-5xl text-4xl font-black tracking-tight text-ink md:text-6xl">
              Unscramble letters into words instantly.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Enter letters, discover playable words, compare Scrabble scores,
              and narrow answers for Wordle, crosswords, and anagram puzzles.
            </p>

            <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
              {popularSearches.slice(0, 5).map((item) => (
                <Link
                  key={item}
                  href="#unscrambler"
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:border-brand hover:text-brand"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="unscrambler">
          <Unscrambler />
        </section>

        <section className="container-page mt-16 grid gap-5 md:grid-cols-4">
          {features.map(([icon, title, copy]) => (
            <div key={title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
              <div className="text-3xl">{icon}</div>
              <h2 className="mt-4 text-lg font-extrabold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
            </div>
          ))}
        </section>

        <SeoContent />
      </main>

      <Footer />
    </>
  )
}

function SeoContent() {
  return (
    <section className="container-page mt-20 grid gap-12 lg:grid-cols-[1fr_340px]">
      <article className="prose prose-gray max-w-none prose-headings:font-extrabold prose-h2:text-3xl prose-p:leading-8">
        <h2>What Is a Word Unscrambler?</h2>
        <p>
          A word unscrambler is a tool that turns a scrambled set of letters into valid words.
          It is useful for Scrabble, Words With Friends, Wordle, crosswords, classroom vocabulary
          games, and any puzzle where letters need to become meaningful words.
        </p>

        <p>
          UnscrambleHQ is designed to be fast, clean, and practical. Enter your letters,
          apply filters, and review words by length, score, and usefulness. The goal is not only
          to show possible words, but to help you quickly choose the best word for your situation.
        </p>

        <h2>How Anagrams Work</h2>
        <p>
          An anagram is made by rearranging letters. For example, “listen” can become “silent,”
          “enlist,” and “tinsel.” Strong anagram tools do more than shuffle letters; they compare
          combinations against a dictionary so the output is useful and accurate.
        </p>

        <h2>How to Win More Scrabble Games</h2>
        <p>
          Strong Scrabble play combines vocabulary, board position, and score awareness.
          High-value letters like Q, Z, X, and J can create large scores, but short words are often
          just as important because they let you connect with existing tiles on the board.
        </p>

        <h2>Wordle Strategies</h2>
        <p>
          For Wordle, start with a balanced word that includes common vowels and consonants.
          After each guess, use exact length, contains, starts with, ends with, and exclude filters
          to narrow the answer list.
        </p>

        <h2>Word Game Tips</h2>
        <p>
          Learn common two-letter words, prefixes, suffixes, and high-probability letter combinations.
          Good players do not simply know long words; they know flexible words that fit many board
          situations.
        </p>
      </article>

      <aside className="rounded-3xl border border-line bg-soft p-6">
        <h2 className="text-xl font-extrabold">Popular Word Tools</h2>
        <div className="mt-5 grid gap-3">
          {popularSearches.map((item) => (
            <Link
              href="#unscrambler"
              key={item}
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-brand hover:text-brand"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <h2 className="text-xl font-extrabold">FAQ</h2>
          <div className="mt-5 grid gap-5">
            {faq.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-bold">{q}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  )
}