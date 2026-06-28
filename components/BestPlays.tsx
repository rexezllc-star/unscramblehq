import type { SearchResult } from '@/lib/engine'
import { WordCard } from './WordCard'

export function BestPlays({ results }: { results: SearchResult[] }) {
  const best = [...results]
    .sort((a, b) => b.score - a.score || b.length - a.length || a.word.localeCompare(b.word))
    .slice(0, 6)

  if (best.length === 0) return null

  return (
    <section className="rounded-3xl border border-brand/20 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-brand">Best Plays</p>
          <h2 className="mt-1 text-2xl font-black text-ink">Top word options</h2>
        </div>
        <p className="hidden text-sm text-gray-600 md:block">
          Ranked by score, length, and usefulness.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {best.map((result) => (
          <WordCard key={`best-${result.word}`} result={result} />
        ))}
      </div>
    </section>
  )
}