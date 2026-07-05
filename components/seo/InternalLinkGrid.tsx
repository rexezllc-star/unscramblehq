import Link from 'next/link'

type InternalLinkGridProps = {
  word?: string
  length?: number
  prefix?: string
  suffix?: string
  contains?: string
}

function clean(value?: string) {
  return value?.toLowerCase().replace(/[^a-z]/g, '') || ''
}

export function InternalLinkGrid({
  word,
  length,
  prefix,
  suffix,
  contains,
}: InternalLinkGridProps) {
  const cleanWord = clean(word)
  const first = cleanWord.slice(0, 1)
  const firstTwo = cleanWord.slice(0, 2)
  const last = cleanWord.slice(-1)
  const lastTwo = cleanWord.slice(-2)
  const middle = cleanWord.length >= 4 ? cleanWord.slice(1, 4) : cleanWord

  const links = [
    length
      ? { label: `${length} Letter Words`, href: `/${length}-letter-words` }
      : null,
    first ? { label: `Words Starting With ${first.toUpperCase()}`, href: `/words-starting-with-${first}` } : null,
    firstTwo ? { label: `Words Starting With ${firstTwo.toUpperCase()}`, href: `/words-starting-with-${firstTwo}` } : null,
    last ? { label: `Words Ending In ${last.toUpperCase()}`, href: `/words-ending-in-${last}` } : null,
    lastTwo ? { label: `Words Ending In ${lastTwo.toUpperCase()}`, href: `/words-ending-in-${lastTwo}` } : null,
    middle ? { label: `Words Containing ${middle.toUpperCase()}`, href: `/words-containing-${middle}` } : null,
    prefix ? { label: `More ${prefix.toUpperCase()} Words`, href: `/words-starting-with-${clean(prefix)}` } : null,
    suffix ? { label: `More Words Ending ${suffix.toUpperCase()}`, href: `/words-ending-in-${clean(suffix)}` } : null,
    contains ? { label: `More Words Containing ${contains.toUpperCase()}`, href: `/words-containing-${clean(contains)}` } : null,
    { label: 'Word Finder', href: '/word-finder' },
    { label: 'Anagram Solver', href: '/anagram-solver' },
    { label: 'Scrabble Word Finder', href: '/scrabble-word-finder' },
    { label: 'Wordle Helper', href: '/wordle-helper' },
  ].filter(Boolean) as { label: string; href: string }[]

  const uniqueLinks = Array.from(
    new Map(links.map((link) => [link.href, link])).values()
  )

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Related Word Tools</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Explore related word lists, patterns, and tools connected to this page.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {uniqueLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold text-ink hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}