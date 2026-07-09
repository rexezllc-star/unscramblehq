import Link from 'next/link'

const lengthLinks = Array.from({ length: 14 }, (_, index) => index + 2)

const tools = [
  ['Word Finder', '/word-finder'],
  ['Anagram Solver', '/anagram-solver'],
  ['Scrabble Word Finder', '/scrabble-word-finder'],
  ['Wordle Helper', '/wordle-helper'],
]

const popularPrefixes = ['a', 's', 're', 'un', 'st', 'pre']
const popularSuffixes = ['ing', 'er', 'ed', 'ly', 'ion', 'ment']
const popularContains = ['ar', 'th', 'er', 'ing', 'tion', 'qu']

const featuredWords = [
  'apple',
  'planet',
  'listen',
  'master',
  'search',
  'letter',
  'puzzle',
  'winner',
  'bright',
  'silver',
  'orange',
  'wonder',
]

export function HomeSeoHub() {
  return (
    <section className="container-page mt-20">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-brand">
          Explore Word Lists
        </p>

        <h2 className="mt-2 text-3xl font-black text-ink">
          Popular word tools, lists, and dictionary pages
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Browse common word patterns, word lengths, Scrabble tools, Wordle
          helpers, and detailed dictionary pages from one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HubCard title="Popular Word Lengths">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {lengthLinks.map((length) => (
              <HubLink
                key={length}
                href={`/${length}-letter-words`}
                label={`${length} Letter Words`}
              />
            ))}
          </div>
        </HubCard>

        <HubCard title="Popular Tools">
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map(([label, href]) => (
              <HubLink key={href} href={href} label={label} />
            ))}
          </div>
        </HubCard>

        <HubCard title="Words Starting With">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {popularPrefixes.map((prefix) => (
              <HubLink
                key={prefix}
                href={`/words-starting-with-${prefix}`}
                label={`Starts With ${prefix.toUpperCase()}`}
              />
            ))}
          </div>
        </HubCard>

        <HubCard title="Words Ending In">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {popularSuffixes.map((suffix) => (
              <HubLink
                key={suffix}
                href={`/words-ending-in-${suffix}`}
                label={`Ends In ${suffix.toUpperCase()}`}
              />
            ))}
          </div>
        </HubCard>

        <HubCard title="Words Containing">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {popularContains.map((letters) => (
              <HubLink
                key={letters}
                href={`/words-containing-${letters}`}
                label={`Contains ${letters.toUpperCase()}`}
              />
            ))}
          </div>
        </HubCard>

        <HubCard title="Featured Dictionary Words">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {featuredWords.map((word) => (
              <HubLink
                key={word}
                href={`/word/${word}`}
                label={word.toUpperCase()}
              />
            ))}
          </div>
        </HubCard>
      </div>
    </section>
  )
}

function HubCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function HubLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold text-ink transition hover:text-brand"
    >
      {label}
    </Link>
  )
}