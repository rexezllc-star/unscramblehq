'use client'

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { BestPlays } from './BestPlays'
import { SearchBox } from './SearchBox'
import { WordCard } from './WordCard'
import {
  groupByLength,
  searchWords,
  type SearchFilters,
} from '@/lib/engine'

const INITIAL_RESULT_LIMIT = 120
const LOAD_MORE_AMOUNT = 120

export function Unscrambler() {
  const [letters, setLetters] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_RESULT_LIMIT)

  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'longest',
  })

  const [isPending, startTransition] = useTransition()

  const deferredSubmitted = useDeferredValue(submitted)
  const deferredFilters = useDeferredValue(filters)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialLetters = params.get('letters')?.trim() || ''

    if (!initialLetters) return

    setLetters(initialLetters)
    setVisibleLimit(INITIAL_RESULT_LIMIT)

    startTransition(() => {
      setSubmitted(initialLetters)
    })
  }, [])

  const results = useMemo(() => {
    if (!deferredSubmitted) return []

    return searchWords(deferredSubmitted, deferredFilters)
  }, [deferredSubmitted, deferredFilters])

  const visibleResults = useMemo(
    () => results.slice(0, visibleLimit),
    [results, visibleLimit]
  )

  const grouped = useMemo(
    () => groupByLength(visibleResults),
    [visibleResults]
  )

  const lengths = useMemo(
    () =>
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a),
    [grouped]
  )

  const isSearching =
    isPending ||
    submitted !== deferredSubmitted ||
    filters !== deferredFilters

  const hasMoreResults = visibleResults.length < results.length

  function updateFilter<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) {
    setVisibleLimit(INITIAL_RESULT_LIMIT)

    startTransition(() => {
      setFilters((current) => ({
        ...current,
        [key]: value || undefined,
      }))
    })
  }

  function submitSearch(value: string) {
    const clean = value.trim()

    if (!clean) return

    setLetters(clean)
    setVisibleLimit(INITIAL_RESULT_LIMIT)

    const params = new URLSearchParams(window.location.search)
    params.set('letters', clean)

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${params.toString()}`
    )

    startTransition(() => {
      setSubmitted(clean)
    })
  }

  function clearSearch() {
    setLetters('')
    setSubmitted('')
    setShowFilters(false)
    setVisibleLimit(INITIAL_RESULT_LIMIT)

    window.history.replaceState(
      null,
      '',
      window.location.pathname
    )
  }

  function loadMoreResults() {
    setVisibleLimit((current) =>
      Math.min(current + LOAD_MORE_AMOUNT, results.length)
    )
  }

  const filtersPanel = (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
      <FilterInput
        label="Min"
        type="number"
        onChange={(value) =>
          updateFilter(
            'minLength',
            value ? Number(value) : undefined
          )
        }
      />

      <FilterInput
        label="Max"
        type="number"
        onChange={(value) =>
          updateFilter(
            'maxLength',
            value ? Number(value) : undefined
          )
        }
      />

      <FilterInput
        label="Exact"
        type="number"
        onChange={(value) =>
          updateFilter(
            'exactLength',
            value ? Number(value) : undefined
          )
        }
      />

      <FilterInput
        label="Starts"
        onChange={(value) =>
          updateFilter('startsWith', value)
        }
      />

      <FilterInput
        label="Ends"
        onChange={(value) =>
          updateFilter('endsWith', value)
        }
      />

      <FilterInput
        label="Contains"
        onChange={(value) =>
          updateFilter('contains', value)
        }
      />

      <FilterInput
        label="Exclude"
        onChange={(value) =>
          updateFilter('excludes', value)
        }
      />

      <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-gray-500">
        Sort

        <select
          className="focus-ring h-11 rounded-xl border border-line px-3 text-sm normal-case text-ink"
          value={filters.sortBy}
          onChange={(event) =>
            updateFilter(
              'sortBy',
              event.target.value as SearchFilters['sortBy']
            )
          }
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
          />

          <button
            type="button"
            onClick={clearSearch}
            className="h-14 rounded-2xl border border-line px-8 font-bold text-gray-700 transition hover:border-brand hover:text-brand md:h-16"
          >
            Clear
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Tip: use{' '}
          <span className="font-bold">?</span>{' '}
          as a blank tile.
        </p>

        <button
          type="button"
          onClick={() =>
            setShowFilters((current) => !current)
          }
          className="mt-5 h-12 w-full rounded-2xl border border-line px-5 text-sm font-bold text-gray-700 transition hover:border-brand hover:text-brand md:hidden"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div
          className={`${
            showFilters ? 'block' : 'hidden'
          } mt-5 md:block`}
        >
          {filtersPanel}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          {isSearching ? (
            <LoadingState />
          ) : !deferredSubmitted ? (
            <EmptyState />
          ) : results.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-extrabold">
                  {results.length.toLocaleString()} words found
                </h2>

                <p className="text-gray-600">
                  Results for{' '}
                  <span className="font-bold">
                    {deferredSubmitted}
                  </span>
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Showing{' '}
                  {visibleResults.length.toLocaleString()} of{' '}
                  {results.length.toLocaleString()} results
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
                      <WordCard
                        key={result.word}
                        result={result}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {hasMoreResults && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={loadMoreResults}
                    className="min-h-12 rounded-2xl bg-brand px-8 py-3 font-bold text-white transition hover:opacity-90"
                  >
                    Load More Words
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        <aside className="grid content-start gap-4">
          <InfoBox
            title="Scrabble Letter Values"
            body="Q and Z are 10 points. J and X are 8 points. K is 5 points. Most common letters are 1 point."
          />

          <InfoBox
            title="Popular Searches"
            body="Try: listen, react, master, planet, letters, scrabble, anagram."
          />

          <InfoBox
            title="Wordle Tip"
            body="Filter by exact length 5, then add contains, starts with, ends with, and excluded letters."
          />
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
  type?: 'text' | 'number'
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-gray-500">
      {label}

      <input
        type={type}
        min={type === 'number' ? 1 : undefined}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="focus-ring h-11 rounded-xl border border-line px-3 text-sm normal-case text-ink"
      />
    </label>
  )
}

function InfoBox({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="rounded-3xl border border-line bg-soft p-5">
      <h3 className="font-extrabold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {body}
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div
      className="rounded-3xl border border-line bg-soft p-10 text-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />

      <h2 className="text-2xl font-extrabold">
        Finding words...
      </h2>

      <p className="mt-2 text-gray-600">
        Searching the dictionary and sorting your best results.
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-soft p-10 text-center">
      <h2 className="text-2xl font-extrabold">
        Enter letters to begin
      </h2>

      <p className="mt-2 text-gray-600">
        Your words will be grouped by length with score,
        definition, and copy actions.
      </p>
    </div>
  )
}

function NoResults() {
  return (
    <div className="rounded-3xl border border-line bg-soft p-10 text-center">
      <h2 className="text-2xl font-extrabold">
        No words found
      </h2>

      <p className="mt-2 text-gray-600">
        Try fewer filters, add a blank tile, or use more
        letters.
      </p>
    </div>
  )
}