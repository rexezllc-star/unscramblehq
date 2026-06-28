import Link from 'next/link'

const tools = [
  '5 Letter Words',
  '6 Letter Words',
  'Anagram Solver',
  'Word Finder',
  'Wordle Helper',
  'Scrabble Word Finder',
  'Crossword Solver',
  'Words With Q'
]

const faq = [
  ['How does a word unscrambler work?', 'It compares your letters against a dictionary and returns words that can be made from them.'],
  ['Can I use this for Scrabble?', 'Yes. UnscrambleHQ includes Scrabble-style scoring to help identify stronger plays.'],
  ['Can I use this for Wordle?', 'Yes. Use length, contains, starts with, ends with, and exclude filters to narrow answers.'],
  ['What is an anagram?', 'An anagram is a word or phrase made by rearranging the letters of another word or phrase.']
]

export function HomeSidebar() {
  return (
    <aside className="rounded-3xl border border-line bg-soft p-6">
      <h2 className="text-xl font-extrabold">Popular Word Tools</h2>

      <div className="mt-5 grid gap-3">
        {tools.map((item) => (
          <Link
            href="#unscrambler"
            key={item}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-brand hover:text-brand"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-extrabold text-ink">Wordle Tip</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Start with exact length 5, then use contains and exclude filters after each guess.
        </p>
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <h2 className="text-xl font-extrabold">FAQ</h2>
        <div className="mt-5 grid gap-5">
          {faq.map(([q, a]) => (
            <div key={q}>
              <h3 className="font-bold">{q}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
