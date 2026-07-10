import { filterWords } from '@/lib/filters'
import { getDictionary } from '@/lib/dictionary'
import { createSeoPageDefinition } from '@/lib/seo'
import { buildRelatedLinks } from '@/lib/relatedLinks'
import { getWordStats } from '@/lib/wordStats'

export type PageBuilderOptions = {
  type:
    | 'length'
    | 'startsWith'
    | 'endsWith'
    | 'contains'
    | 'scrabbleScore'
  value: string | number
}

export function buildSeoPage(options: PageBuilderOptions) {
  const words = getDictionary()

  let filtered: string[] = []

  switch (options.type) {
    case 'length':
      filtered = filterWords(words, {
        length: Number(options.value),
      })
      break

    case 'startsWith':
      filtered = filterWords(words, {
        startsWith: String(options.value),
      })
      break

    case 'endsWith':
      filtered = filterWords(words, {
        endsWith: String(options.value),
      })
      break

    case 'contains':
      filtered = filterWords(words, {
        contains: String(options.value),
      })
      break

    case 'scrabbleScore':
      filtered = words.filter(
        (word) => getWordStats(word).score === Number(options.value)
      )
      break
  }

  const seo =
    options.type === 'scrabbleScore'
      ? {
          title: `Words With ${options.value} Scrabble Points | UnscrambleHQ`,
          h1: `Words With ${options.value} Scrabble Points`,
          description: `Browse words worth exactly ${options.value} Scrabble points. Use this list to find playable words, compare scores, and improve your word game strategy.`,
          canonical: `https://www.unscramblehq.com/words-with-${options.value}-scrabble-points`,
        }
      : createSeoPageDefinition(options.type, options.value)

  return {
    ...seo,
    words: filtered,
    total: filtered.length,
    relatedLinks: buildRelatedLinks(options),
  }
}