import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Read the UnscrambleHQ disclaimer regarding word results, scores, dictionaries, and third-party word games.'
}

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold">Disclaimer</h1>

      <p className="mb-6">
        UnscrambleHQ provides word-finding, anagram, Scrabble, Wordle, and other
        word-game tools for informational and entertainment purposes.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        Accuracy of Results
      </h2>

      <p className="mb-6">
        We aim to provide accurate word results, definitions, letter
        combinations, and scores. However, we do not guarantee that every
        result is complete, error-free, or accepted by every dictionary, word
        game, tournament, or platform.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        Word-Game Acceptance
      </h2>

      <p className="mb-6">
        Different games may use different dictionaries, regional spelling
        rules, scoring systems, and eligibility requirements. A word shown on
        UnscrambleHQ may not be accepted in every version of Scrabble, Words
        With Friends, Wordle-style game, crossword, or other word game.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        No Affiliation
      </h2>

      <p className="mb-6">
        UnscrambleHQ is an independent website and is not affiliated with,
        endorsed by, or sponsored by the owners or publishers of Scrabble,
        Wordle, Words With Friends, or any other third-party game or brand
        referenced on the site.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        External Links
      </h2>

      <p className="mb-6">
        The website may include links to third-party websites. We are not
        responsible for the accuracy, availability, content, or privacy
        practices of those external sites.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        Limitation of Liability
      </h2>

      <p className="mb-6">
        Your use of UnscrambleHQ is at your own discretion. We are not liable
        for losses, damages, missed game opportunities, scoring disputes, or
        other consequences resulting from reliance on the website or its
        results.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        Changes to This Disclaimer
      </h2>

      <p>
        We may update this disclaimer from time to time. Any changes will be
        posted on this page.
      </p>
    </main>
  )
}