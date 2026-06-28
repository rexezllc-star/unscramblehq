import type { SearchResult } from '@/lib/engine'

function getQualityLabel(result: SearchResult) {
  if (result.length >= 6 && result.score >= 8) return 'Excellent Play'
  if (result.score >= 8) return 'High Score'
  if (result.length >= 5) return 'Strong Word'
  return 'Valid Word'
}

export function WordCard({ result }: { result: SearchResult }) {
  const quality = getQualityLabel(result)

  return (
    <div className="group rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-soft px-3 py-1 text-xs font-extrabold text-brand">
            {quality}
          </div>

          <h3 className="text-2xl font-black uppercase tracking-wide text-ink">
            {result.word}
          </h3>
        </div>

        <button
          className="rounded-full border border-line px-3 py-1 text-xs font-bold text-gray-600 transition hover:border-brand hover:text-brand"
          onClick={() => navigator.clipboard?.writeText(result.word)}
        >
          Copy
        </button>
      </div>

      <p className="mt-4 min-h-12 text-sm leading-6 text-gray-600">
        {result.definition || 'Definition coming soon.'}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 text-xs font-extrabold">
        <span className="rounded-2xl bg-soft px-3 py-2 text-center text-gray-700">
          {result.length} Letters
        </span>
        <span className="rounded-2xl bg-emerald/10 px-3 py-2 text-center text-emerald">
          Scrabble {result.score}
        </span>
        <span className="rounded-2xl bg-brand/10 px-3 py-2 text-center text-brand">
          WWF {result.wwfScore}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs font-bold text-gray-500">
        <span>Scrabble valid</span>
        <span className="text-brand opacity-0 transition group-hover:opacity-100">
          View details →
        </span>
      </div>
    </div>
  )
}