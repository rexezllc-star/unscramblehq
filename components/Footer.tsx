import Link from 'next/link'

const lengthLinks = Array.from({ length: 14 }, (_, index) => index + 2)

const popularLinks = [
  ['Words Starting With A', '/words-starting-with-a'],
  ['Words Starting With S', '/words-starting-with-s'],
  ['Words Ending In ING', '/words-ending-in-ing'],
  ['Words Ending In ER', '/words-ending-in-er'],
  ['Words Containing AR', '/words-containing-ar'],
  ['Words Containing TH', '/words-containing-th'],
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-soft">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="font-extrabold text-ink">UnscrambleHQ</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
            Fast, clean word tools for anagrams, Scrabble, Wordle, crosswords, and everyday word games.
          </p>
        </div>

        <div>
          <div className="font-semibold">Tools</div>
          <div className="mt-3 grid gap-2 text-sm text-gray-600">
            <Link href="/word-finder">Word Finder</Link>
            <Link href="/anagram-solver">Anagram Solver</Link>
            <Link href="/scrabble-word-finder">Scrabble Word Finder</Link>
            <Link href="/wordle-helper">Wordle Helper</Link>
          </div>
        </div>

        <div>
          <div className="font-semibold">Word Lengths</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
            {lengthLinks.map((length) => (
              <Link key={length} href={`/${length}-letter-words`}>
                {length} Letter Words
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="font-semibold">Popular Searches</div>
          <div className="mt-3 grid gap-2 text-sm text-gray-600">
            {popularLinks.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}