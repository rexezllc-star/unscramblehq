import Link from 'next/link'
import { getDictionary } from '@/lib/dictionary'

type WordFamilyLinksProps = {
  word: string
}

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

export function WordFamilyLinks({ word }: WordFamilyLinksProps) {
  const cleanWord = clean(word)

  if (cleanWord.length < 3) return null

  const root =
    cleanWord.length >= 6
      ? cleanWord.slice(0, 4)
      : cleanWord.length >= 4
        ? cleanWord.slice(0, 3)
        : cleanWord.slice(0, 2)

  const familyWords = getDictionary()
    .filter((item) => {
      const candidate = clean(item)
      return candidate !== cleanWord && candidate.startsWith(root)
    })
    .slice(0, 18)

  if (!familyWords.length) return null

  return (
    <section className="mt-10 rounded-3xl border border-line bg-white p-6">
      <h2 className="text-2xl font-black text-ink">Word Family</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Explore words that share a similar beginning or root pattern with{' '}
        <span className="font-bold uppercase text-ink">{word}</span>.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {familyWords.map((item) => (
          <Link
            key={item}
            href={`/word/${item}`}
            className="rounded-2xl bg-soft px-4 py-3 text-sm font-bold uppercase text-ink hover:text-brand"
          >
            {item}
          </Link>
        ))}
      </div>
    </section>
  )
}