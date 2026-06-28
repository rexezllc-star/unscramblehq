import Link from 'next/link'

const popularSearches = [
  '5 Letter Words',
  '6 Letter Words',
  'Anagram Solver',
  'Word Finder',
  'Wordle Helper'
]

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#eef2ff,_#ffffff_60%)] pb-8 pt-12 md:pb-10 md:pt-16">
      <div className="container-page text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-brand shadow-sm">
          <span>⚡</span>
          <span>Fast word tools for Scrabble, Wordle, anagrams, and crosswords</span>
        </div>

        <h1 className="mx-auto max-w-5xl text-4xl font-black tracking-tight text-ink md:text-6xl">
          Unscramble letters into words instantly.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
          Enter letters, discover playable words, compare Scrabble scores, and narrow answers for Wordle, crosswords, and anagram puzzles.
        </p>

        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
          {popularSearches.map((item) => (
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
  )
}
