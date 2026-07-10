import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About UnscrambleHQ',
  description:
    'Learn about UnscrambleHQ and its word intelligence tools.',
}

export default function AboutPage() {
  return (
    <main className="bg-soft/40 px-4 py-12">
      <article className="container-page max-w-4xl rounded-3xl border border-line bg-white p-6 md:p-10">
        <p className="text-xs font-black uppercase tracking-widest text-brand">
          About the platform
        </p>

        <h1 className="mt-3 text-4xl font-black text-ink">
          Word intelligence for games, puzzles, and learning
        </h1>

        <p className="mt-6 text-base leading-8 text-gray-700">
          UnscrambleHQ helps visitors discover words, solve anagrams,
          explore letter patterns, compare word-game scores, and learn
          how English words are structured.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            'Word Finder',
            'Anagram Solver',
            'Scrabble Word Finder',
            'Wordle Helper',
            'Word Intelligence Pages',
            'Pattern and Relationship Tools',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-line bg-soft p-5 font-bold text-ink"
            >
              {item}
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-7 text-gray-700">
          Our goal is to provide fast, practical, and increasingly
          detailed word resources for puzzle enthusiasts, students,
          teachers, writers, and competitive word-game players.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-brand px-5 py-3 font-bold text-white"
        >
          Explore UnscrambleHQ
        </Link>
      </article>
    </main>
  )
}