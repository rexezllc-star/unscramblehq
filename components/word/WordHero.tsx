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
    setActiveIndex(-1)
    router.push(`/word/${cleaned}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (suggestions.length === 0) return

      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0
      )

      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

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
      setQuery('')
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
    <section className="rounded-3xl border border-line bg-white shadow-sm">
      <div className="bg-gradient-to-r from-brand to-indigo-600 px-8 py-8 text-white">
        <div className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur">
          ★★★★☆ {word.frequency || 'Common'} Word
        </div>

        <h1 className="mt-5 text-5xl font-black uppercase tracking-tight md:text-7xl">
          {word.word}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
          {word.definition}
        </p>

        <div className="mt-6 max-w-2xl rounded-3xl bg-white/10 p-3 backdrop-blur">
          <