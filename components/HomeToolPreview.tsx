import Link from 'next/link'

export function HomeToolPreview() {
  return (
    <section id="tool" className="container-page -mt-6">
      <div className="card p-5 md:p-8">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            name="letters"
            placeholder="Enter letters..."
            className="focus-ring h-16 w-full rounded-2xl border border-line px-5 text-xl font-semibold tracking-wide text-ink"
            readOnly
          />

          <Link
            href="/word-finder"
            className="flex h-16 items-center justify-center rounded-2xl bg-brand px-8 font-bold text-white shadow-soft hover:bg-brand/95"
          >
            Open Word Finder
          </Link>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Fast word tools for Scrabble, Wordle, anagrams, and crosswords.
        </p>
      </div>
    </section>
  )
}