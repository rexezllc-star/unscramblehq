'use client'

type WordHeroProps = {
  word: {
    word: string
    definition?: string
    dictionarySummary?: string
    pronunciation?: string
    partsOfSpeech?: string[]
    senseCount?: number
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
  const summary =
    word.dictionarySummary ||
    word.definition ||
    'Definition coming soon.'

  const partsOfSpeech = Array.from(
    new Set(
      (word.partsOfSpeech || [])
        .map((part) => part.trim())
        .filter(Boolean)
    )
  )

  async function copyWord() {
    try {
      await navigator.clipboard?.writeText(word.word)
    } catch {
      // Clipboard support varies by browser and security context.
    }
  }

  async function shareWord() {
    const shareData = {
      title: `${word.word.toUpperCase()} | UnscrambleHQ`,
      text:
        word.dictionarySummary ||
        word.definition ||
        `Learn about ${word.word} on UnscrambleHQ.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard?.writeText(window.location.href)
    } catch {
      // Users can cancel the native share dialog.
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
      <div className="bg-gradient-to-r from-brand to-indigo-600 px-6 py-8 text-white md:px-8 md:py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur">
            Word Details
          </span>

          {word.senseCount && word.senseCount > 0 ? (
            <span className="inline-flex rounded-full border border-white/25 bg-black/10 px-4 py-2 text-sm font-bold">
              {word.senseCount} {word.senseCount === 1 ? 'meaning' : 'meanings'}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 break-words text-5xl font-black uppercase tracking-tight md:text-7xl">
          {word.word}
        </h1>

        {(word.pronunciation || partsOfSpeech.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {word.pronunciation ? (
              <span className="rounded-full border border-white/25 bg-black/10 px-3 py-1.5 text-sm font-semibold text-white/95">
                {word.pronunciation}
              </span>
            ) : null}

            {partsOfSpeech.map((part) => (
              <span
                key={part}
                className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold capitalize text-white/95"
              >
                {part}
              </span>
            ))}
          </div>
        )}

        <p className="mt-5 max-w-4xl text-base leading-8 text-white/90 md:text-lg">
          {summary}
        </p>

        {word.dictionarySummary &&
        word.definition &&
        word.dictionarySummary !== word.definition ? (
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
            <span className="font-extrabold text-white/90">
              Primary definition:
            </span>{' '}
            {word.definition}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyWord}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-brand transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand"
          >
            Copy Word
          </button>

          <button
            type="button"
            onClick={shareWord}
            className="rounded-2xl border border-white/30 px-5 py-3 font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Share
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-6">
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

      <p className="mt-2 break-words text-2xl font-black text-ink md:text-3xl">
        {value ?? '—'}
      </p>
    </div>
  )
}
