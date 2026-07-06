import Link from 'next/link'
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid'
import { getWordStats } from '@/lib/wordStats'

type SeoWordPageProps = {
  title: string
  description: string
  words: string[]
  relatedLinks?: {
    label: string
    href: string
  }[]
}

const DISPLAY_LIMIT = 100

export function SeoWordPage({
  title,
  description,
  words,
  relatedLinks = [],
}: SeoWordPageProps) {
  const uniqueWords = Array.from(new Set(words))
  const visibleWords = uniqueWords.slice(0, DISPLAY_LIMIT)
  const totalWords = uniqueWords.length

  const sampleStats = visibleWords.slice(0, 12).map((word) => getWordStats(word))

  const averageLength =
    visibleWords.length > 0
      ? Math.round(
          visibleWords.reduce((sum, word) => sum + word.length, 0) /
            visibleWords.length
        )
      : 0

  const firstVisibleWord = visibleWords[0]
  const firstStats = firstVisibleWord ? getWordStats(firstVisibleWord) : null

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
          UnscrambleHQ Word Lists
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          {description}
        </p>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <StatBox label="Matching words" value={totalWords.toLocaleString()} />
        <StatBox label="Displayed now" value={visibleWords.length.toLocaleString()} />
        <StatBox label="Average visible length" value={averageLength || '-'} />
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Matching Words
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {totalWords.toLocaleString()} matching word
              {totalWords === 1 ? '' : 's'} found.
            </p>
          </div>

          {totalWords > visibleWords.length && (
            <p className="text-sm text-slate-600">
              Showing first {visibleWords.length.toLocaleString()} of{' '}
              {totalWords.toLocaleString()}.
            </p>
          )}
        </div>

        {visibleWords.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleWords.map((word) => {
              const stats = getWordStats(word)

              return (
                <Link
                  key={word}
                  href={`/word/${word}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="block text-base font-semibold">{word}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {stats.length} letters · {stats.score} Scrabble pts
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            No matching words are available for this page yet.
          </p>
        )}
      </section>

      {sampleStats.length > 0 && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Word Stats Preview
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4 font-medium">Word</th>
                  <th className="py-3 pr-4 font-medium">Length</th>
                  <th className="py-3 pr-4 font-medium">Score</th>
                  <th className="py-3 pr-4 font-medium">Vowels</th>
                  <th className="py-3 pr-4 font-medium">Consonants</th>
                  <th className="py-3 pr-4 font-medium">Starts</th>
                  <th className="py-3 pr-4 font-medium">Ends</th>
                </tr>
              </thead>

              <tbody>
                {sampleStats.map((stats) => (
                  <tr
                    key={stats.word}
                    className="border-b border-slate-100 text-slate-700"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-950">
                      <Link href={`/word/${stats.word}`}>{stats.word}</Link>
                    </td>
                    <td className="py-3 pr-4">{stats.length}</td>
                    <td className="py-3 pr-4">{stats.score}</td>
                    <td className="py-3 pr-4">{stats.vowels}</td>
                    <td className="py-3 pr-4">{stats.consonants}</td>
                    <td className="py-3 pr-4 uppercase">{stats.firstLetter}</td>
                    <td className="py-3 pr-4 uppercase">{stats.lastLetter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {relatedLinks.length > 0 && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Related Word Lists
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <InternalLinkGrid
        word={firstVisibleWord}
        length={firstStats?.length}
        prefix={firstVisibleWord?.slice(0, 2)}
        suffix={firstVisibleWord?.slice(-2)}
        contains={
          firstVisibleWord && firstVisibleWord.length >= 4
            ? firstVisibleWord.slice(1, 4)
            : firstVisibleWord
        }
      />

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">
          How to use this word list
        </h2>

        <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            Use this page to explore words by pattern, length, starting letters,
            ending letters, or included letter combinations.
          </p>

          <p>
            Each listed word includes quick scoring and letter information, so
            you can compare options faster for Scrabble, Wordle, crosswords, and
            other word games.
          </p>
        </div>
      </section>
    </main>
  )
}

function StatBox({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  )
}