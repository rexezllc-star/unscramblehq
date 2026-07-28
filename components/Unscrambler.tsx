'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'

import { BestPlays } from './BestPlays'
import { SearchBox } from './SearchBox'
import { WordCard } from './WordCard'

import type {
  SearchFilters,
  SearchResult,
} from '@/lib/engine/types'

const INITIAL_RESULT_LIMIT = 36
const LOAD_MORE_AMOUNT = 60

type SearchEngineModule = {
  searchWords: (
    letters: string,
    filters?: SearchFilters
  ) => SearchResult[]
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: {
      timeout?: number
    }
  ) => number

  cancelIdleCallback?: (id: number) => void
}

function groupResultsByLength(
  results: SearchResult[]
): Record<number, SearchResult[]> {
  const grouped: Record<number, SearchResult[]> = {}

  for (const result of results) {
    const length = result.length

    if (!grouped[length]) {
      grouped[length] = []
    }

    grouped[length].push(result)
  }

  return grouped
}

export function Unscrambler() {
  const router = useRouter()
  const pathname = usePathname()

  const [letters, setLetters] = useState('')
  const [submitted, setSubmitted] = useState('')

  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'longest',
  })

  const [results, setResults] = useState<SearchResult[]>([])
  const [exactMatch, setExactMatch] = useState<SearchResult | null>(null)
  const [visibleLimit, setVisibleLimit] = useState(
    INITIAL_RESULT_LIMIT
  )

  const [showFilters, setShowFilters] = useState(false)
  const [engineLoading, setEngineLoading] = useState(false)
  const [searchError, setSearchError] = useState('')

  const [isPending, startTransition] = useTransition()

  const engineRef = useRef<SearchEngineModule | null>(null)

  const enginePromiseRef =
    useRef<Promise<SearchEngineModule> | null>(null)

  const latestSearchIdRef = useRef(0)

  const deferredSubmitted = useDeferredValue(submitted)
  const deferredFilters = useDeferredValue(filters)

  /**
   * Exact dictionary navigation belongs to the general Word Finder.
   * Dedicated tools keep their normal anagram/Scrabble/Wordle behavior.
   */
  const exactNavigationEnabled =
    pathname === '/word-finder'

  const hasConstrainedFilters = Boolean(
    deferredFilters.minLength ||
      deferredFilters.maxLength ||
      deferredFilters.exactLength ||
      deferredFilters.startsWith ||
      deferredFilters.endsWith ||
      deferredFilters.contains ||
      deferredFilters.excludes ||
      deferredFilters.minScore
  )

  /**
   * Loads the heavy dictionary/search module only when needed.
   *
   * The module is cached after the first load, so subsequent searches
   * do not repeat the import or engine initialization.
   */
  const loadSearchEngine =
    useCallback(async (): Promise<SearchEngineModule> => {
      if (engineRef.current) {
        return engineRef.current
      }

      if (!enginePromiseRef.current) {
        enginePromiseRef.current = import(
          '@/lib/engine/search'
        )
          .then((module) => {
            const engine: SearchEngineModule = {
              searchWords: module.searchWords,
            }

            engineRef.current = engine

            return engine
          })
          .catch((error: unknown) => {
            enginePromiseRef.current = null
            throw error
          })
      }

      return enginePromiseRef.current
    }, [])

  /**
   * Preload the engine during idle browser time.
   *
   * This keeps the dictionary out of the initial interactive bundle,
   * but usually prepares it before the user submits a search.
   */
  useEffect(() => {
    let cancelled = false
    let idleId: number | undefined
    let timeoutId: number | undefined

    const preloadEngine = () => {
      if (cancelled || engineRef.current) {
        return
      }

      void loadSearchEngine().catch((error: unknown) => {
        console.error(
          'Search engine preload failed:',
          error
        )
      })
    }

    const browserWindow = window as IdleWindow

    if (browserWindow.requestIdleCallback) {
      idleId = browserWindow.requestIdleCallback(
        preloadEngine,
        {
          timeout: 4000,
        }
      )
    } else {
      timeoutId = window.setTimeout(
        preloadEngine,
        1500
      )
    }

    return () => {
      cancelled = true

      if (
        idleId !== undefined &&
        browserWindow.cancelIdleCallback
      ) {
        browserWindow.cancelIdleCallback(idleId)
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [loadSearchEngine])

  /**
   * Restore a search from the URL:
   *
   * /word-finder?letters=triangle
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    )

    const initialLetters =
      params.get('letters')?.trim() ?? ''

    if (!initialLetters) {
      return
    }

    setLetters(initialLetters)
    setVisibleLimit(INITIAL_RESULT_LIMIT)

    startTransition(() => {
      setSubmitted(initialLetters)
    })
  }, [])

  /**
   * Run a search whenever the submitted letters or filters change.
   */
  useEffect(() => {
    if (!deferredSubmitted) {
      latestSearchIdRef.current += 1

      setResults([])
      setExactMatch(null)
      setEngineLoading(false)
      setSearchError('')

      return
    }

    const searchId =
      latestSearchIdRef.current + 1

    latestSearchIdRef.current = searchId

    let cancelled = false

    async function runSearch() {
      setEngineLoading(true)
      setSearchError('')

      try {
        const engine = await loadSearchEngine()

        if (
          cancelled ||
          searchId !== latestSearchIdRef.current
        ) {
          return
        }

        const matches = engine.searchWords(
          deferredSubmitted,
          deferredFilters
        )

        if (
          cancelled ||
          searchId !== latestSearchIdRef.current
        ) {
          return
        }

        const normalizedInput = deferredSubmitted
          .trim()
          .toLowerCase()

        const isPlainWord = /^[a-z]+$/.test(
          normalizedInput
        )

        const matchingEntry = isPlainWord
          ? matches.find(
              (entry) =>
                entry.word.toLowerCase() ===
                normalizedInput
            ) ?? null
          : null

        setExactMatch(matchingEntry)

        if (
          matchingEntry &&
          exactNavigationEnabled &&
          !hasConstrainedFilters
        ) {
          router.push(
            `/word/${encodeURIComponent(
              matchingEntry.word.toLowerCase()
            )}`
          )
          return
        }

        setResults(matches)
      } catch (error: unknown) {
        console.error('Word search failed:', error)

        enginePromiseRef.current = null

        if (
          !cancelled &&
          searchId === latestSearchIdRef.current
        ) {
          setResults([])
          setExactMatch(null)
          setSearchError(
            'The search engine could not be loaded. Please try again.'
          )
        }
      } finally {
        if (
          !cancelled &&
          searchId === latestSearchIdRef.current
        ) {
          setEngineLoading(false)
        }
      }
    }

    void runSearch()

    return () => {
      cancelled = true
    }
  }, [
    deferredSubmitted,
    deferredFilters,
    exactNavigationEnabled,
    hasConstrainedFilters,
    loadSearchEngine,
    router,
  ])

  const visibleResults = useMemo(
    () => results.slice(0, visibleLimit),
    [results, visibleLimit]
  )

  const grouped = useMemo(
    () => groupResultsByLength(visibleResults),
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
    engineLoading ||
    submitted !== deferredSubmitted ||
    filters !== deferredFilters

  const hasMoreResults =
    visibleResults.length < results.length

  function updateFilter<
    K extends keyof SearchFilters,
  >(
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

    if (!clean) {
      return
    }

    setLetters(clean)
    setVisibleLimit(INITIAL_RESULT_LIMIT)
    setExactMatch(null)
    setSearchError('')

    const params = new URLSearchParams(
      window.location.search
    )

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
    latestSearchIdRef.current += 1

    setLetters('')
    setSubmitted('')
    setResults([])
    setExactMatch(null)
    setEngineLoading(false)
    setSearchError('')
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
      Math.min(
        current + LOAD_MORE_AMOUNT,
        results.length
      )
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
          updateFilter(
            'startsWith',
            value || undefined
          )
        }
      />

      <FilterInput
        label="Ends"
        onChange={(value) =>
          updateFilter(
            'endsWith',
            value || undefined
          )
        }
      />

      <FilterInput
        label="Contains"
        onChange={(value) =>
          updateFilter(
            'contains',
            value || undefined
          )
        }
      />

      <FilterInput
        label="Exclude"
        onChange={(value) =>
          updateFilter(
            'excludes',
            value || undefined
          )
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
              event.target
                .value as SearchFilters['sortBy']
            )
          }
        >
          <option value="longest">
            Longest
          </option>

          <option value="score">
            Highest Score
          </option>

          <option value="alphabetical">
            Alphabetical
          </option>
        </select>
      </label>
    </div>
  )

  return (
    <section
      id="tool"
      className="container-page -mt-6"
    >
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
            setShowFilters(
              (current) => !current
            )
          }
          className="mt-5 h-12 w-full rounded-2xl border border-line px-5 text-sm font-bold text-gray-700 transition hover:border-brand hover:text-brand md:hidden"
        >
          {showFilters
            ? 'Hide Filters'
            : 'Show Filters'}
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
          ) : searchError ? (
            <SearchError
              message={searchError}
            />
          ) : !deferredSubmitted ? (
            <EmptyState />
          ) : results.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-extrabold">
                  {results.length.toLocaleString()}{' '}
                  words found
                </h2>

                <p className="text-gray-600">
                  Results for{' '}
                  <span className="font-bold">
                    {deferredSubmitted}
                  </span>
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Showing{' '}
                  {visibleResults.length.toLocaleString()}{' '}
                  of{' '}
                  {results.length.toLocaleString()}{' '}
                  results
                </p>
              </div>

              {exactMatch ? (
                <ExactDictionaryMatch
                  result={exactMatch}
                />
              ) : null}

              <BestPlays results={results} />

              {lengths.map((length) => (
                <section key={length}>
                  <h3 className="mb-4 text-xl font-extrabold">
                    {length} Letter Words
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {grouped[length].map(
                      (result) => (
                        <WordCard
                          key={result.word}
                          result={result}
                        />
                      )
                    )}
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


function ExactDictionaryMatch({
  result,
}: {
  result: SearchResult
}) {
  const normalizedWord =
    result.word.toLowerCase()

  return (
    <section className="rounded-3xl border border-brand/25 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
        Exact Dictionary Match
      </p>

      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-ink">
            {result.word}
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-gray-600">
            {result.definition ||
              'Open the dictionary page for definitions and complete word details.'}
          </p>

          <p className="mt-3 text-sm font-bold text-gray-500">
            {result.length} letters · Scrabble {result.score} · WWF {result.wwfScore}
          </p>
        </div>

        <Link
          href={`/word/${encodeURIComponent(
            normalizedWord
          )}`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-brand px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          View Dictionary Entry
        </Link>
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
        min={
          type === 'number'
            ? 1
            : undefined
        }
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
      <h3 className="font-extrabold">
        {title}
      </h3>

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
        Searching the dictionary and sorting your
        best results.
      </p>
    </div>
  )
}

function SearchError({
  message,
}: {
  message: string
}) {
  return (
    <div
      className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center"
      role="alert"
    >
      <h2 className="text-2xl font-extrabold text-red-900">
        Search unavailable
      </h2>

      <p className="mt-2 text-red-700">
        {message}
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
        Your words will be grouped by length with
        score, definition, and copy actions.
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
        Try fewer filters, add a blank tile, or use
        more letters.
      </p>
    </div>
  )
}