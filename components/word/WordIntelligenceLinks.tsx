import Link from 'next/link'

type WordIntelligenceLinksProps = {
  word: string
  length: number
  score: number
  vowels: number
  consonants: number
}

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

export function WordIntelligenceLinks({
  word,
  length,
  score,
  vowels,
  consonants,
}: WordIntelligenceLinksProps) {
  const cleanWord = clean(word)

  const first = cleanWord.slice(0, 1)
  const firstTwo = cleanWord.slice(0, 2)
  const firstThree = cleanWord.slice(0, 3)

  const last = cleanWord.slice(-1)
  const lastTwo = cleanWord.slice(-2)
  const lastThree = cleanWord.slice(-3)

  const middle =
    cleanWord.length >= 4 ? cleanWord.slice(1, 4) : cleanWord

  const links = [
    { label: `${length} Letter Words`, href: `/${length}-letter-words` },
    { label: `Words With ${score} Scrabble Points`, href: `/words-with-${score}-scrabble-points` },
    { label: `Words With ${vowels} Vowels`, href: `/words-with-${vowels}-vowels` },
    { label: `Words With ${consonants} Consonants`, href: `/words-with-${consonants}-consonants` },

    first ? { label: `Words Starting With ${first.toUpperCase()}`, href: `/words-starting-with-${first}` } : null,
    firstTwo ? { label: `Words Starting With ${firstTwo.toUpperCase()}`, href: `/words-starting-with-${firstTwo}` } : null,
    firstThree ? { label: `Words Starting With ${firstThree.toUpperCase()}`, href: `/words-starting-with-${firstThree}` } : null,

    last ? { label: `Words Ending In ${last.toUpperCase()}`, href: `/words-ending-in-${last}` } : null,
    lastTwo ? { label: `Words Ending In ${lastTwo.toUpperCase()}`, href: `/words-ending-in-${lastTwo}` } : null,
    lastThree ? { label: `Words Ending In ${lastThree.toUpperCase()}`, href: `/words-ending-in-${lastThree}` } : null,

    middle ? { label: `Words Containing ${middle.toUpperCase()}`, href: `/words-containing-${middle}` } : null,

    first ? { label: `${length} Letter Words Starting With ${first.toUpperCase()}`, href: `/${length}-letter-words-starting-with-${first}` } : null,
    firstTwo ? { label: `${length} Letter Words Starting With ${firstTwo.toUpperCase()}`, href: `/${length}-letter-words-starting-with-${firstTwo}` } : null,

    last ? { label: `${length} Letter Words Ending In ${last.toUpperCase()}`, href: `/${length}-letter-words-ending-in-${last}` } : null,
    lastTwo ? { label: `${length} Letter Words Ending In ${lastTwo.toUpperCase()}`, href: `/${length}-letter-words-ending-in-${lastTwo}` } : null,

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
      <h2 className="text-2xl font-black text-ink">
        Word Intelligence Links
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Explore word lists connected to {word.toUpperCase()} by length, score,
        vowels, consonants, starting letters, ending letters, and word game tools.
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