export function WordHero({ word }: { word: any }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-8 shadow-sm">
      <div className="inline-flex rounded-full bg-brand/10 px-4 py-2 text-sm font-extrabold text-brand">
        {word.difficulty} Word
      </div>

      <h1 className="mt-5 text-5xl font-black uppercase tracking-tight text-ink md:text-7xl">
        {word.word}
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
        {word.definition}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Length" value={`${word.length} letters`} />
        <Stat label="Scrabble" value={word.score} />
        <Stat label="WWF" value={word.wwfScore} />
        <Stat label="Starts" value={word.startsWith.toUpperCase()} />
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-soft p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink">{value}</p>
    </div>
  )
}
