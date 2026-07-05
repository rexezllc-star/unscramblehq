import dynamic from 'next/dynamic'
import { Footer } from '@/components/Footer'
import { HomeFeatures } from '@/components/HomeFeatures'
import { HomeHero } from '@/components/HomeHero'
import { HomeSeoContent } from '@/components/HomeSeoContent'
import { HomeSidebar } from '@/components/HomeSidebar'
import { Navbar } from '@/components/Navbar'

const Unscrambler = dynamic(
  () => import('@/components/Unscrambler').then((mod) => mod.Unscrambler),
  {
    loading: () => (
      <section id="tool" className="container-page -mt-6">
        <div className="card p-5 md:p-8">
          <div className="h-16 animate-pulse rounded-2xl bg-soft" />
          <p className="mt-3 text-sm text-gray-500">
            Loading word finder...
          </p>
        </div>
      </section>
    ),
  }
)

const faq = [
  ['How does a word unscrambler work?', 'A word unscrambler compares the letters you enter against a dictionary and returns valid words that can be made from those letters.'],
  ['Can I use UnscrambleHQ for Scrabble?', 'Yes. UnscrambleHQ shows Scrabble-style scores so you can quickly identify stronger word plays.'],
  ['Can I use this for Wordle?', 'Yes. Use length, starts with, ends with, contains, and exclude filters to narrow possible Wordle answers.'],
  ['What is an anagram?', 'An anagram is a word or phrase made by rearranging the letters of another word or phrase.'],
]

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        <HomeHero />

        <section id="unscrambler">
          <Unscrambler />
        </section>

        <HomeFeatures />

        <section className="container-page mt-20 grid gap-12 lg:grid-cols-[1fr_340px]">
          <HomeSeoContent />
          <HomeSidebar />
        </section>
      </main>

      <Footer />
    </>
  )
}