import Link from 'next/link'
import {
  getWordFamilyGroups,
  type WordFamilyMember,
} from '@/lib/wordFamilies'
import { getWordStats } from '@/lib/wordStats'

type WordFamilyGraphProps = {
  word: string
}

type FamilyGroupProps = {
  title: string
  description: string
  words: WordFamilyMember[]
}

function FamilyGroup({
  title,
  description,
  words,
}: FamilyGroupProps) {
  if (!words.length) return null

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <h3 className="text-xl font-black text-ink">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {words.map((item) => {
          const stats = getWordStats(item.word)

          return (
            <Link
              key={`${item.relation}-${item.word}`}
              href={`/word/${item.word}`}
              className="rounded-2xl bg-soft px-4 py-3 transition hover:-translate-y-0.5 hover:text-brand hover:shadow-sm"
            >
              <span className="block text-sm font-black uppercase text-ink">
                {item.word}
              </span>

              <span className="mt-1 block text-xs font-semibold text-gray-500">
                {stats.length} letters · {stats.score} pts
              </span>

              <span className="mt-1 block text-xs font-semibold text-brand">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function WordFamilyGraph({
  word,
}: WordFamilyGraphProps) {
  const cleanWord = word
    .toLowerCase()
    .replace(/[^a-z]/g, '')

  if (!cleanWord) return null

  const groups = getWordFamilyGroups(cleanWord, 12)

  const total =
    groups.inflections.length +
    groups.derived.length +
    groups.prefixed.length +
    groups.extended.length

  if (!total) return null

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-ink">
          Word Family Graph
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Explore inflections, derived forms, prefixed forms, and
          extended family members connected to{' '}
          <span className="font-bold uppercase text-ink">
            {cleanWord}
          </span>
          .
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FamilyGroup
          title="Inflected Forms"
          description={`Plural, tense, comparative, and other grammatical forms related to ${cleanWord.toUpperCase()}.`}
          words={groups.inflections}
        />

        <FamilyGroup
          title="Derived Words"
          description={`Words formed from the same root using derivational endings and related constructions.`}
          words={groups.derived}
        />

        <FamilyGroup
          title="Prefixed Forms"
          description={`Words connected to ${cleanWord.toUpperCase()} through prefixes such as re-, un-, pre-, over-, and under-.`}
          words={groups.prefixed}
        />

        <FamilyGroup
          title="Extended Word Family"
          description={`Additional dictionary words that appear to share the same underlying root or word family.`}
          words={groups.extended}
        />
      </div>
    </section>
  )
}