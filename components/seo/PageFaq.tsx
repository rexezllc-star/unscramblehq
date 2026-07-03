type Props = {
  title: string
  words: string[]
}

export function PageFaq({ title, words }: Props) {
  const examples = words.slice(0, 5).join(', ')

  return (
    <section className="mt-12 rounded-2xl border bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">
            What is this word list?
          </h3>

          <p className="mt-2 text-slate-600">
            This page lists {title.toLowerCase()} that can be used in games
            like Scrabble, Words With Friends, Wordle, crossword puzzles,
            anagram solving and general vocabulary building.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            What are some examples?
          </h3>

          <p className="mt-2 text-slate-600">
            Examples include: {examples}.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            How many words are included?
          </h3>

          <p className="mt-2 text-slate-600">
            This page currently contains {words.length} matching words.
          </p>
        </div>
      </div>
    </section>
  )
}