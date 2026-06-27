import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Unscrambler } from '@/components/Unscrambler'

export const metadata: Metadata = {
  title: 'Scrabble Word Finder',
  description: 'Use the Scrabble Word Finder tool from UnscrambleHQ to find words, anagrams, scores, and useful word game answers fast.',
  alternates: { canonical: '/scrabble-word-finder' }
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-soft py-16">
          <div className="container-page text-center">
            <h1 className="text-5xl font-black tracking-tight text-ink">Scrabble Word Finder</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">Enter letters, add filters, and find useful words instantly.</p>
          </div>
        </section>
        <Unscrambler />
        <section className="container-page mt-20 max-w-3xl">
          <h2 className="text-3xl font-extrabold">About this tool</h2>
          <p className="mt-4 leading-8 text-gray-600">This page is part of the UnscrambleHQ word tools platform. It uses the same dictionary engine as the main word unscrambler, with a focused landing page built for search intent and future expansion.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
