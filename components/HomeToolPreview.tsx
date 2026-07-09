'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export function HomeToolPreview() {
  const [letters, setLetters] = useState('')
  const router = useRouter()

  function submitSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const clean = letters.trim().toLowerCase().replace(/[^a-z?]/g, '')

    if (!clean) return

    router.push(`/word-finder?letters=${encodeURIComponent(clean)}`)
  }

  return (
    <section id="tool" className="container-page -mt-6">
      <div className="card p-5 md:p-8">
        <form onSubmit={submitSearch} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="home-word-search">
            Enter letters to find words
          </label>

          <input
            id="home-word-search"
            name="letters"
            value={letters}
            onChange={(event) => setLetters(event.target.value)}
            placeholder="Enter letters..."
            autoComplete="off"
            inputMode="text"
            className="focus-ring h-16 w-full rounded-2xl border border-line px-5 text-xl font-semibold tracking-wide text-ink"
          />

          <button
            type="submit"
            className="h-16 rounded-2xl bg-brand px-8 font-bold text-white shadow-soft hover:bg-brand/95"
          >
            Find Words
          </button>
        </form>

        <p className="mt-3 text-sm text-gray-500">
          Enter letters, blanks, or partial word patterns. Press Enter to search instantly.
        </p>
      </div>
    </section>
  )
}