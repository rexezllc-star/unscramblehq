'use client'

import { KeyboardEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DICTIONARY } from '@/lib/dictionary'

type DictionaryEntry = {
  word?: string
}

export function WordHero({ word }: { word: any }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const allWords = useMemo(() => {
    return DICTIONARY
      .map((entry: string | DictionaryEntry) =>
        typeof entry === 'string' ? entry : entry.word
      )
      .filter((item): item is string => Boolean(item))
  }, [])

  const suggestions = useMemo(() => {
    const cleaned = query.toLowerCase().replace(/[^a-z]/g, '')

    if (cleaned.length < 1) return []

    return allWords
      .filter((item) => item.toLowerCase().startsWith(cleaned))
      .slice(0, 8)
  }, [query, allWords])

  function goToWord(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z]/g, '')
    if (!cleaned) return

    setQuery(cleaned)
    setIsOpen(false)
    setActiveIndex(-1)
    router.push(`/word/${cleaned}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)

      if (suggestions.length === 0) return

      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0
      )

      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)

      if (suggestions.length === 0) return

      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1
      )

      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      if (activeIndex >= 0 && suggestions[activeIndex]) {
        goToWord(suggestions[activeIndex])
      } else {
        goToWord(query)
      }

      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  function copyWord() {
    navigator.clipboard?.writeText(word.word)
  }

  function shareWord() {
    if (navigator.share) {
      navigator.share({
        title: `${word.word.toUpperCase()} | UnscrambleHQ`,
        text: word.definition,
        url: window.location.href,
      })
    } else {
      navigator.clipboard?.writeText(window.location.href)
    }
  }

  return (
    <section className="overflow-visible rounded-3xl border border-line bg-white shadow-sm">
      <div className="overflow-visible bg-gradient-to-r from-brand to-indigo-600 px-8 py-8 text-white">
        <div className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur">
          ★★★★☆ {word.frequency || 'Common'} Word
        </div>

        <h1 className="mt-5 text-5xl font-black uppercase tracking-tight md:text-7xl">
          {word.word}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
          {word.definition}
        </p>

        <div className="relative z-50 mt-6 max-w-2xl overflow-visible">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setIsOpen(true)
                setActiveIndex(-1)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search another word..."
              className="h-14 w-full rounded-2xl border border-white/30 bg-white px-5 text-base font-bold text-ink outline-none placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => goToWord(query)}
              className="h-14 rounded-2xl bg-white px-6 font-black text-brand transition hover:scale-105"
            >
              Search
            </button>
          </div>

          {isOpen && query.length > 0 && (
            <div className="absolute left-0 right-0 top-16 z-[9999] overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-soft">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onMouseDown={() => goToWord(suggestion)}
                    className={`flex w-full items-center justify-between px-5 py-3 text-left ${
                      index === activeIndex ? 'bg-soft' : 'hover:bg-soft'
                    }`}
                  >
                    <span className="font-extrabold uppercase">
                      {suggestion}
                    </span>
                    <span className="text-sm text-gray-500">Open</span>
                  </button>
                ))
              ) : (
                <div className="px-5 py-4 text-sm font-bold text-gray-500">
                  No suggestions found for “{query}”
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-2xl bg-white px-5 py-3 font-bold text-brand transition hover:scale-105"
            onClick={copyWord}
          >
            Copy Word
          </button>

          <button
            type="button"
            className="rounded-2xl border border-white/30 px-5 py-3 font-bold transition hover:bg-white/10"
            onClick={shareWord}
          >
            Share
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-8 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Length" value={word.length} />
        <Stat label="Scrabble" value={word.score ?? word.scrabble} />
        <Stat label="WWF" value={word.wwfScore ?? word.wwf} />
        <Stat label="Starts" value={word.startsWith?.toUpperCase()} />
        <Stat label="Ends" value={word.endsWith?.toUpperCase()} />
        <Stat label="Difficulty" value={word.difficulty} />
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