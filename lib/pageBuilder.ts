import { filterWords } from '@/lib/filters'
import { getDictionary } from '@/lib/dictionary'
import { createSeoPageDefinition } from '@/lib/seo'
import { buildRelatedLinks } from '@/lib/relatedLinks'
import { getWordStats } from '@/lib/wordStats'

export type LengthPatternValue = {
  length: number
  letters: string
}

export type PageBuilderOptions =
  | {
      type:
        | 'length'
        | 'startsWith'
        | 'endsWith'
        | 'contains'
        | 'scrabbleScore'
      value: string | number
    }
  | {
      type:
        | 'lengthStartsWith'
        | 'lengthEndsWith'
        | 'lengthContains'
      value: LengthPatternValue
    }

function normalizeLetters(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function buildLengthPatternSeo(
  type: 'lengthStartsWith' | 'lengthEndsWith' | 'lengthContains',
  value: LengthPatternValue
) {
  const length = value.length
  const letters = normalizeLetters(value.letters)
  const displayLetters = letters.toUpperCase()

  if (type === 'lengthStartsWith') {
    return {
      title: `${length}-Letter Words Starting With ${displayLetters} | UnscrambleHQ`,
      h1: `${length}-Letter Words Starting With ${displayLetters}`,
      description: `Find ${length}-letter words starting with ${displayLetters}. Browse playable words, Scrabble scores, definitions, and related word lists.`,
      canonical: `https://unscramblehq.com/${length}-letter-words-starting-with-${letters}`,
    }
  }

  if (type === 'lengthEndsWith') {
    return {
      title: `${length}-Letter Words Ending In ${displayLetters} | UnscrambleHQ`,
      h1: `${length}-Letter Words Ending In ${displayLetters}`,
      description: `Find ${length}-letter words ending in ${displayLetters}. Browse playable words, Scrabble scores, definitions, and related word lists.`,
      canonical: `https://unscramblehq.com/${length}-letter-words-ending-in-${letters}`,
    }
  }

  return {
    title: `${length}-Letter Words Containing ${displayLetters} | UnscrambleHQ`,
    h1: `${length}-Letter Words Containing ${displayLetters}`,
    description: `Find ${length}-letter words containing ${displayLetters}. Browse playable words, Scrabble scores, definitions, and related word lists.`,
    canonical: `https://unscramblehq.com/${length}-letter-words-containing-${letters}`,
  }
}

export function buildSeoPage(options: PageBuilderOptions) {
  const words = getDictionary()

  let filtered: string[] = []
  let seo:
    | ReturnType<typeof createSeoPageDefinition>
    | {
        title: string
        h1: string
        description: string
        canonical: string
      }

  switch (options.type) {
    case 'length': {
      const length = Number(options.value)

      filtered = filterWords(words, {
        length,
      })

      seo = createSeoPageDefinition('length', length)
      break
    }

    case 'startsWith': {
      const letters = normalizeLetters(String(options.value))

      filtered = filterWords(words, {
        startsWith: letters,
      })

      seo = createSeoPageDefinition('startsWith', letters)
      break
    }

    case 'endsWith': {
      const letters = normalizeLetters(String(options.value))

      filtered = filterWords(words, {
        endsWith: letters,
      })

      seo = createSeoPageDefinition('endsWith', letters)
      break
    }

    case 'contains': {
      const letters = normalizeLetters(String(options.value))

      filtered = filterWords(words, {
        contains: letters,
      })

      seo = createSeoPageDefinition('contains', letters)
      break
    }

    case 'scrabbleScore': {
      const score = Number(options.value)

      filtered = words.filter(
        (word) => getWordStats(word).score === score
      )

      seo = {
        title: `Words With ${score} Scrabble Points | UnscrambleHQ`,
        h1: `Words With ${score} Scrabble Points`,
        description: `Browse words worth exactly ${score} Scrabble points. Use this list to find playable words, compare scores, and improve your word game strategy.`,
        canonical: `https://unscramblehq.com/words-with-${score}-scrabble-points`,
      }
      break
    }

    case 'lengthStartsWith': {
      const length = Number(options.value.length)
      const letters = normalizeLetters(options.value.letters)

      filtered = filterWords(words, {
        length,
        startsWith: letters,
      })

      seo = buildLengthPatternSeo('lengthStartsWith', {
        length,
        letters,
      })
      break
    }

    case 'lengthEndsWith': {
      const length = Number(options.value.length)
      const letters = normalizeLetters(options.value.letters)

      filtered = filterWords(words, {
        length,
        endsWith: letters,
      })

      seo = buildLengthPatternSeo('lengthEndsWith', {
        length,
        letters,
      })
      break
    }

    case 'lengthContains': {
      const length = Number(options.value.length)
      const letters = normalizeLetters(options.value.letters)

      filtered = filterWords(words, {
        length,
        contains: letters,
      })

      seo = buildLengthPatternSeo('lengthContains', {
        length,
        letters,
      })
      break
    }
  }

  let relatedLinks

switch (options.type) {
  case 'lengthStartsWith':
  case 'lengthEndsWith':
  case 'lengthContains':
    relatedLinks = buildRelatedLinks({
      type: 'length',
      value: options.value.length,
    })
    break

  case 'length':
    relatedLinks = buildRelatedLinks({
      type: 'length',
      value: options.value,
    })
    break

  case 'startsWith':
    relatedLinks = buildRelatedLinks({
      type: 'startsWith',
      value: options.value,
    })
    break

  case 'endsWith':
    relatedLinks = buildRelatedLinks({
      type: 'endsWith',
      value: options.value,
    })
    break

  case 'contains':
    relatedLinks = buildRelatedLinks({
      type: 'contains',
      value: options.value,
    })
    break

  case 'scrabbleScore':
    relatedLinks = buildRelatedLinks({
      type: 'scrabbleScore',
      value: options.value,
    })
    break
}

  return {
    ...seo,
    words: filtered,
    total: filtered.length,
    relatedLinks,
  }
}