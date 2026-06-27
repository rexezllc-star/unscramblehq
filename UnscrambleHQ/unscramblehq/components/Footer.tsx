import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-soft">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-extrabold text-ink">UnscrambleHQ</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">Fast, clean word tools for anagrams, Scrabble, Wordle, crosswords, and everyday word games.</p>
        </div>
        <div>
          <div className="font-semibold">Tools</div>
          <div className="mt-3 grid gap-2 text-sm text-gray-600">
            <Link href="/anagram-solver">Anagram Solver</Link>
            <Link href="/word-finder">Word Finder</Link>
            <Link href="/wordle-helper">Wordle Helper</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold">Site</div>
          <div className="mt-3 grid gap-2 text-sm text-gray-600">
            <Link href="/scrabble-word-finder">Scrabble Word Finder</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
