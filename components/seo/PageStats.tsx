type Props = {
  words: string[]
}

export function PageStats({ words }: Props) {
  if (!words.length) return null

  const lengths = words.map((w) => w.length)

  const total = words.length
  const shortest = Math.min(...lengths)
  const longest = Math.max(...lengths)
  const average =
    Math.round(
      (lengths.reduce((a, b) => a + b, 0) / total) * 10
    ) / 10

  return (
    <div className="my-8 rounded-2xl border bg-gray-50 p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Word List Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>

        <div>
          <div className="text-2xl font-bold">{shortest}</div>
          <div className="text-sm text-gray-600">Shortest</div>
        </div>

        <div>
          <div className="text-2xl font-bold">{longest}</div>
          <div className="text-sm text-gray-600">Longest</div>
        </div>

        <div>
          <div className="text-2xl font-bold">{average}</div>
          <div className="text-sm text-gray-600">
            Average Length
          </div>
        </div>
      </div>
    </div>
  )
}