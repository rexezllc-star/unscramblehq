'use client'

type WordHeroProps = {
  word: {
    word: string
    definition?: string
    score?: number
    scrabble?: number
    wwfScore?: number
    wwf?: number
    length?: number
    startsWith?: string
    endsWith?: string
    frequency?: string
    difficulty?: string
  }
}

export function WordHero({ word }: WordHeroProps) {
  const scrabbleScore = word.score ?? word.scrabble ?? '—'
  const wwfScore = word.wwfScore ?? word.wwf ?? '—'

  function copyWord() {
    navigator.clipboard?.writeText(word.word)
  }

  function shareWord() {
    if (navigator.share) {
      navigator.share({
        title: `${word.word.toUpperCase()} | UnscrambleHQ`,
        text: word.definition || `Learn about ${word.word} on UnscrambleHQ.`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard?.writeText(window.location.href)
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
      <div className="bg-gradient-to-r from-brand to-indigo-600 px-8 py-8 text-white">
        <div className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur">
          Word Details
        </div>

        <h1 className="mt-5 text-5xl font-black uppercase tracking-tight md:text-7xl">
          {word.word}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
          {word.definition || 'Definition coming soon.'}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyWord}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-brand transition hover:scale-105"
          >
            Copy Word
          </button>

          <button
            type="button"
            onClick={shareWord}
            className="rounded-2xl border border-white/30 px-5 py-3 font-bold text-white transition hover:bg-white/10"
          >
            Share
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-8 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Length" value={word.length} />
        <Stat label="Scrabble" value={scrabbleScore} />
        <Stat label="WWF" value={wwfScore} />
        <Stat label="Starts" value={word.startsWith?.toUpperCase()} />
        <Stat label="Ends" value={word.endsWith?.toUpperCase()} />
        <Stat label="Difficulty" value={word.difficulty || 'Normal'} />
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
}: {
  label: string
  value: string | number | undefined
}) {
  return (
    <div className="rounded-2xl border border-line bg-soft p-4 text-center">
      <p className="text-xs font-black uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-ink">{value || '—'}</p>
    </div>
  )
}