const features = [
  ['⚡', 'Fast Results', 'Enter letters and instantly find useful word options.'],
  ['🏆', 'Scrabble Scores', 'Spot higher-scoring words without doing the math yourself.'],
  ['🎯', 'Wordle Filters', 'Narrow words by length, starting letters, endings, and exclusions.'],
  ['📚', 'Built for Growth', 'Designed to expand into an entire word tools platform.']
]

export function HomeFeatures() {
  return (
    <section className="container-page mt-14 grid gap-5 md:grid-cols-4">
      {features.map(([icon, title, copy]) => (
        <div
          key={title}
          className="rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-3xl">{icon}</div>
          <h2 className="mt-4 text-lg font-extrabold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
        </div>
      ))}
    </section>
  )
}
