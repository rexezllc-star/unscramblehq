'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const Unscrambler = dynamic(
  () => import('@/components/Unscrambler').then((mod) => mod.Unscrambler),
  {
    ssr: false,
    loading: () => (
      <div className="card p-5 md:p-8">
        <div className="h-16 animate-pulse rounded-2xl bg-soft" />
        <p className="mt-3 text-sm text-gray-500">Loading word finder...</p>
      </div>
    ),
  }
)

export function LazyUnscrambler() {
  const [isLoaded, setIsLoaded] = useState(false)

  if (isLoaded) {
    return <Unscrambler />
  }

  return (
    <section id="tool" className="container-page -mt-6">
      <div className="card p-5 md:p-8">
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="h-16 w-full rounded-2xl bg-brand px-8 font-bold text-white shadow-soft hover:bg-brand/95"
        >
          Open Word Unscrambler
        </button>

        <p className="mt-3 text-sm text-gray-500">
          Tap to load the full word finder, filters, scores, and results.
        </p>
      </div>
    </section>
  )
}