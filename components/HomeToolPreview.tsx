'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HomeToolPreview() {
  const [letters, setLetters] = useState('')
  const router = useRouter()

  function submitSearch() {
    const clean = letters.trim()
    if (!clean) return
    router.push(`/word-finder?letters=${encodeURIComponent(clean)}`)
  }

  return (
    <section id="tool" className="container-page -mt-6">
      <div className="card p-5 md:p-8">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={letters}
            onChange={(event) => setLetters(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                submitSearch()
              }
            }}
            placeholder="Enter letters..."
            className="focus-ring h-16 w-full rounded-2xl border border-line px-5 text-xl font-semibold tracking-wide text-ink"
          />

          <button
            type="button"
            onClick={submitSearch}
            className="h-16 rounded-2xl bg-brand px-8 font-bold text-white shadow-soft hover:bg-brand/95"
          >
            Find Words
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Fast word tools for Scrabble, Wordle, anagrams, and crosswords.
        </p>
      </div>
    </section>
  )
}