import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://unscramblehq.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'UnscrambleHQ - Unscramble Letters Into Words Instantly',
    template: '%s | UnscrambleHQ'
  },
  description: 'Unscramble letters instantly with UnscrambleHQ. Find anagrams, Scrabble words, Wordle answers, word scores, and word game ideas fast.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'UnscrambleHQ - Unscramble Letters Into Words Instantly',
    description: 'Find every possible word, anagram, Scrabble play, and Wordle solution from your letters.',
    url: siteUrl,
    siteName: 'UnscrambleHQ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnscrambleHQ',
    description: 'Unscramble letters into words instantly.'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
