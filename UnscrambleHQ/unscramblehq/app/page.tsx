import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Unscrambler } from '@/components/Unscrambler'

const faq = [
  ['How does a word unscrambler work?', 'A word unscrambler compares the letters you enter against a dictionary and returns every word that can be built from those letters.'],
  ['Can I use UnscrambleHQ for Scrabble?', 'Yes. Each result includes a Scrabble-style score so you can quickly spot stronger plays.'],
  ['Does it work for Wordle?', 'Yes. Use exact length, starts with, ends with, contains, and exclude filters to narrow possible Wordle answers.'],
  ['What is an anagram?', 'An anagram is a word or phrase made by rearranging the letters of another word or phrase.'],
  ['How are Scrabble scores calculated?', 'Each letter has a point value. Common letters like A and E are worth 1 point, while rare letters like Q and Z are worth 10 points.']
]

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } }))
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-soft to-white pb-20 pt-20">
          <div className="container-page text-center">
            <p className="mx-auto mb-4 inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-brand shadow-sm">Fast word tools for Scrabble, Wordle, anagrams, and more</p>
            <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-ink md:text-7xl">Unscramble Letters Into Words Instantly</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">Enter your letters and instantly discover every possible word, anagram, Scrabble play, and Wordle solution.</p>
          </div>
        </section>
        <Unscrambler />
        <SeoContent />
      </main>
      <Footer />
    </>
  )
}

function SeoContent() {
  return (
    <section className="container-page mt-20 grid gap-12 lg:grid-cols-[1fr_320px]">
      <article className="prose prose-gray max-w-none prose-headings:font-extrabold prose-h2:text-3xl prose-p:leading-8">
        <h2>What Is a Word Unscrambler?</h2>
        <p>A word unscrambler is a tool that turns a scrambled set of letters into valid words. It is useful when you are playing Scrabble, Words With Friends, Wordle, crosswords, classroom vocabulary games, or any puzzle where letters need to become meaningful words.</p>
        <p>UnscrambleHQ is designed to be fast, simple, and practical. Enter letters, add filters, and review words grouped by length. Each word card shows the word, length, score, definition placeholder, and a copy button.</p>
        <h2>How Anagrams Work</h2>
        <p>An anagram is made by rearranging letters. For example, “listen” can become “silent,” “enlist,” and “tinsel.” The best anagram solvers do more than shuffle letters; they compare possible combinations against a dictionary so the output is useful.</p>
        <h2>How to Win More Scrabble Games</h2>
        <p>Strong Scrabble play combines vocabulary, board position, and score awareness. High-value letters like Q, Z, X, and J can create large scores, but short words are often just as important because they let you connect with existing tiles on the board.</p>
        <h2>Wordle Strategies</h2>
        <p>For Wordle, start with a balanced word that includes common vowels and consonants. After each guess, use exact length, contains, starts with, ends with, and exclude filters to narrow the answer list.</p>
        <h2>Word Game Tips</h2>
        <p>Learn common two-letter words, prefixes, suffixes, and high-probability letter combinations. Good players do not simply know long words; they know flexible words that fit many board situations.</p>
      </article>
      <aside className="rounded-3xl border border-line bg-soft p-6">
        <h2 className="text-xl font-extrabold">FAQ</h2>
        <div className="mt-5 grid gap-5">
          {faq.map(([q, a]) => <div key={q}><h3 className="font-bold">{q}</h3><p className="mt-1 text-sm leading-6 text-gray-600">{a}</p></div>)}
        </div>
      </aside>
    </section>
  )
}
