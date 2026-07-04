'use client'

import { KeyboardEvent, useMemo, useState } from 'react'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  suggestions?: string[]
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  suggestions = [],
}: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const visibleSuggestions = useMemo(() => {
    if (!value.trim()) return []
    return suggestions.slice(0, 6)
  }, [value, suggestions])

  function handleSubmit(searchValue: string) {
    const cleanValue = searchValue.trim()
    if (!cleanValue) return

    onChange(cleanValue)
    onSubmit(cleanValue)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      if (!visibleSuggestions.length) return

      setActiveIndex((current) =>
        current < visibleSuggestions.length - 1 ? current + 1 : 0
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      if (!visibleSuggestions.length) return

      setActiveIndex((current) =>
        current > 0 ? current - 1 : visibleSuggestions.length - 1
      )
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      if (isOpen && activeIndex >= 0 && visibleSuggestions[activeIndex]) {
        handleSubmit(visibleSuggestions[activeIndex])
      } else {
        handleSubmit(value)
      }
      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div className="w-full">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <input
            value={value}
            onChange={(event) => {
              onChange(event.target.value)
              setIsOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Enter letters..."
            className="focus-ring h-16 w-full rounded-2xl border border-line px-5 text-xl font-semibold tracking-wide text-ink"
          />

          {isOpen && visibleSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[4.5rem] z-50 max-h-64 overflow-y-auto rounded-2xl border border-line bg-white shadow-soft">
              {visibleSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  type="button"
                  onMouseDown={() => handleSubmit(suggestion)}
                  className={`flex w-full items-center justify-between px-5 py-3 text-left ${
                    index === activeIndex ? 'bg-soft' : 'hover:bg-soft'
                  }`}
                >
                  <span className="font-extrabold uppercase text-ink">
                    {suggestion}
                  </span>

                  <span className="text-sm text-gray-500">Search</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleSubmit(value)}
          className="h-16 rounded-2xl bg-brand px-8 font-bold text-white shadow-soft hover:bg-brand/95"
        >
          Unscramble
        </button>
      </div>
    </div>
  )
}