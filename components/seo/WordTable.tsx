import Link from 'next/link'

const LETTER_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2,
  h: 4, i: 1, j: 8, k: 5, l: 1, m: 3, n: 1,
  o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1,
  v: 4, w: 4, x: 8, y: 4, z: 10,
}

function scoreWord(word: string) {
  return word
    .toLowerCase()
    .split('')
    .reduce((total, letter) => total + (LETTER_SCORES[letter] ?? 0), 0)
}

type Props = {
  words: string[]
}

export function WordTable({ words }: Props) {
  if (!words.length) return null

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-bold">Word</th>
            <th className="px-4 py-3 font-bold">Length</th>
            <th className="px-4 py-3 font-bold">Scrabble Score</th>
            <th className="px-4 py-3 font-bold">View</th>
          </tr>
        </thead>

        <tbody>
          {words.map((word) => (
            <tr key={word} className="border-t border-slate-100">
              <td className="px-4 py-3 font-bold text-slate-900">{word}</td>
              <td className="px-4 py-3 text-slate-700">{word.length}</td>
              <td className="px-4 py-3 text-slate-700">{scoreWord(word)}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/word/${word}`}
                  className="font-bold text-blue-700 hover:text-blue-900"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}