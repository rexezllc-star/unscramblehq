import Link from 'next/link'
import { getRelationshipGroups } from '@/lib/wordRelationships'
import { getWordStats } from '@/lib/wordStats'

type WordGraphLinksProps = {
  word: string
}

function GraphGroup({
  title,
  description,
  words,
}: {
  title: string
  description: string
  words: { word: string; score: number }[]
}) {
  if (!words.length) return null

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <h3 className="text-xl font-black text-ink">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {words.slice(0, 12).map((item) => {
          const stats = getWordStats(item.word)

          return (
            <Link
              key={item.word}
              href={`/word/${item.word}`}
              className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold text-ink hover:text-brand"
            >
              <span className="block uppercase">{item.word}</span>
              <span className="mt-1 block text-xs font-semibold text-gray-500">
                {stats.length} letters · {stats.score} pts · relation {item.score}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function WordGraphLinks({ word }: WordGraphLinksProps) {
  const groups = getRelationshipGroups(word)

  const total =
    groups.strongest.length +
    groups.medium.length +
    groups.extended.length +
    groups.discovery.length

  if (!total) return null

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-ink">
          Word Intelligence Graph
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Explore the word network around{' '}
          <span className="font-bold uppercase text-ink">{word}</span>. These
          links are grouped by structural similarity, shared letters, score,
          length, prefixes, suffixes, vowels, and consonants.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GraphGroup
          title="Closest Word Matches"
          description="The most strongly related words based on multiple shared word signals."
          words={groups.strongest}
        />

        <GraphGroup
          title="Related Discovery Words"
          description="Additional words that share useful letter, pattern, or score relationships."
          words={groups.medium}
        />

        <GraphGroup
          title="Extended Word Network"
          description="Broader related words that help expand the surrounding word graph."
          words={groups.extended}
        />

        <GraphGroup
          title="Explore More Connections"
          description="More discovery paths for browsing nearby and structurally connected words."
          words={groups.discovery}
        />
      </div>
    </section>
  )
}