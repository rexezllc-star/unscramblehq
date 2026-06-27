import type { SearchResult } from '@/lib/dictionary'

export function WordCard({ result }: { result: SearchResult }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold uppercase tracking-wide text-ink">{result.word}</h3>
          <p className="mt-1 text-sm text-gray-600">{result.definition}</p>
        </div>
        <button className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand hover:text-brand" onClick={() => navigator.clipboard?.writeText(result.word)}>Copy</button>
      </div>
      <div className="mt-4 flex gap-2 text-xs font-semibold text-gray-600">
        <span className="rounded-full bg-soft px-3 py-1">Length {result.length}</span>
        <span className="rounded-full bg-emerald/10 px-3 py-1 text-emerald">Score {result.score}</span>
      </div>
    </div>
  )
}
