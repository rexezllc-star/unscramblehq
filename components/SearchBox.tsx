'use client'

import type { KeyboardEvent } from 'react'

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
}: SearchBoxProps) {
  function handleSubmit() {
    const cleanValue = value.trim()

    if (!cleanValue) return

    onSubmit(cleanValue)
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="grid gap-3">
      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Enter letters..."
        className="focus-ring h-16 w-full rounded-2xl border border-line px-5 text-xl font-semibold tracking-wide text-ink"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="h-16 rounded-2xl bg-brand px-8 font-bold text-white shadow-soft hover:bg-brand/95"
      >
        Unscramble
      </button>
    </div>
  )
}