'use client'

import { useMemo, useState } from 'react'
import { BestPlays } from './BestPlays'
import { SearchBox } from './SearchBox'
import { WordCard } from './WordCard'
import { groupByLength, searchWords, type SearchFilters } from '@/lib/engine'
import { DICTIONARY } from '@/lib/dictionary'

export function Unscrambler() {
  const [letters, setLetters] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: 'longest' })

  const suggestions = useMemo(() => {
    const cleaned = letters.toLowerCase().replace(/[^a-z?]/g, '')

    if (cleaned.length < 2 || cleaned.includes('?')) return []

    return DICTIONARY
      .filter((entry) => entry.word.toLowerCase().startsWith(cleaned))
      .slice(0, 6)
      .map((entry) => entry.word)
  }, [letters])

  const results = useMemo(() => searchWords(submitted, filters), [submitted, filters])
  const grouped = useMemo(() => groupByLength(results), [results])
  const lengths = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  function updateFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value || undefined }))
  }

  function submitSearch(value: string) {
    setSubmitted(value)
  }

  function clearSearch() {
    setLetters('')
    setSubmitted('')
    setShowFilters(false)
  }

  const filtersPanel = (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
      <FilterInput label="Min" type="number" onChange={(v) => updateFilter('minLength', Number(v))} />
      <FilterInput label="Max" type="number" onChange={(v) => updateFilter('maxLength', Number(v))} />
      <FilterInput label="Exact" type="number" onChange={(v) => updateFilter('exactLength', Number(v))} />
      <FilterInput label="Starts" onChange={(v) => updateFilter('startsWith', v)} />
      <FilterInput label="Ends" onChange={(v) => updateFilter('endsWith', v)} />
      <FilterInput label="Contains" onChange={(v) => updateFilter('contains', v)} />
      <FilterInput label="Exclude" onChange={(v) => updateFilter('excludes', v)} />

      <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-gray-500">
        Sort
        <select
          className="focus-ring h-11 rounded-xl border border-line px-3 text-sm normal-case text-ink"
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value as SearchFilters['sortBy'])}
        >
          <option value="longest">Longest</option>
          <option value="score">Highest Score</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </label>
    </div>
  )

  return (
    <section id="tool" className="container-page -mt-6">
      <div className="card overflow-visible p-5 md:p-8">
        <div className="grid gap-3">
          <SearchBox
            value={letters}
            onChange={setLetters}
            onSubmit={submitSearch}
            suggestions={suggestions}
          />

          <button
            type="button"
            onClick={clearSearch}
            className="h-14 rounded-2xl border border-line px-8 font-bold text-gray-700 hover:border-brand hover:text-brand md:h-16"
          >
            Clear
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Tip: use <span className="font-bold">?</span> as a blank tile.
        </p>

        <button
          type="button"
          onClick={() => setShowFilters((current) => !current)}
          className="mt-5 h-12 w-full rounded-2xl border border-line px-5 text-sm font-bold text-gray-700 hover:border-brand hover:text-brand md:hidden"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className={`${showFilters ? 'block' : 'hidden'} mt-5 md:block`}>
          {filtersPanel}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          {!submitted ? (
            <EmptyState />
          ) : results.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-extrabold">
                  {results.length} words found
                </h2>
                <p className="text-gray-600">
                  Results for <span className="font-bold">{submitted}</span>
                </p>
              </div>

              <BestPlays results={results} />

              {lengths.map((length) => (
                <section key={length}>
                  <h3 className="mb-4 text-xl font-extrabold">
                    {length} Letter Words
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {grouped[length].map((result) => (
                      <WordCard key={result.word} result={result} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <aside className="grid content-start gap-4">
          <InfoBox title="Scrabble Letter Values" body="Q and Z are 10 points. J and X are 8 points. K is 5 points. Most common letters are 1 point." />
          <InfoBox title="Popular Searches" body="Try: listen, react, master, planet, letters, scrabble, anagram." />
          <InfoBox title="Wordle Tip" body="Filter by exact length 5, then add contains, starts with, ends with, and excluded letters." />
        </aside>
      </div>
    </section>
  )
}

function FilterInput({
  label,
  onChange,
  type = 'text',
}: {
  label: string
  type?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-gray-500">
      {label}
      <input
        type={type}
        min={type === 'number' ? 1 : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring h-11 rounded-xl border border-line px-3 text-sm normal-case text-ink"
      />
    </label>
  )
}

function InfoBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-line bg-soft p-5">
      <h3 className="font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-soft p-10 text-center">
      <h2 className="text-2xl font-extrabold">Enter letters to begin</h2>
      <p className="mt-2 text-gray-600">
        Your words will be grouped by length with score, definition, and copy actions.
      </p>
    </div>
  )
}

function NoResults() {
  return (
    <div className="rounded-3xl border border-line bg-soft p-10 text-center">
      <h2 className="text-2xl font-extrabold">No words found</h2>
      <p className="mt-2 text-gray-600">
        Try fewer filters, add a blank tile, or use more letters.
      </p>
    </div>
  )
}