import { filterWords } from '@/lib/filters'
import { getDictionary } from '@/lib/dictionary'
import { getWordStats } from '@/lib/wordStats'

const SITE_URL = 'https://www.unscramblehq.com'

export type PageBuilderOptions = {
  type:
    | 'length'
    | 'startsWith'
    | 'endsWith'
    | 'contains'
    | 'scrabbleScore'
    | 'vowels'
    | 'consonants'
    | 'lengthStartsWith'
    | 'lengthEndsWith'
  value: string | number
}

function parseCombo(value: string | number) {
  const [length, letters] = String(value).split(':')
  return {
    length: Number(length),
    letters: letters || '',
  }
}

function getSlug(options: PageBuilderOptions) {
  switch (options.type) {
    case 'length':
      return `/${options.value}-letter-words`
    case 'startsWith':
      return `/words-starting-with-${options.value}`
    case 'endsWith':
      return `/words-ending-in-${options.value}`
    case 'contains':
      return `/words-containing-${options.value}`
    case 'scrabbleScore':
      return `/words-with-${options.value}-scrabble-points`
    case 'vowels':
      return `/words-with-${options.value}-vowels`
    case 'consonants':
      return `/words-with-${options.value}-consonants`
    case 'lengthStartsWith': {
      const combo = parseCombo(options.value)
      return `/${combo.length}-letter-words-starting-with-${combo.letters}`
    }
    case 'lengthEndsWith': {
      const combo = parseCombo(options.value)
      return `/${combo.length}-letter-words-ending-in-${combo.letters}`
    }
  }
}

function getTitle(options: PageBuilderOptions) {
  switch (options.type) {
    case 'length':
      return `${options.value} Letter Words`
    case 'startsWith':
      return `Words Starting With ${String(options.value).toUpperCase()}`
    case 'endsWith':
      return `Words Ending In ${String(options.value).toUpperCase()}`
    case 'contains':
      return `Words Containing ${String(options.value).toUpperCase()}`
    case 'scrabbleScore':
      return `Words With ${options.value} Scrabble Points`
    case 'vowels':
      return `Words With ${options.value} Vowels`
    case 'consonants':
      return `Words With ${options.value} Consonants`
    case 'lengthStartsWith': {
      const combo = parseCombo(options.value)
      return `${combo.length} Letter Words Starting With ${combo.letters.toUpperCase()}`
    }
    case 'lengthEndsWith': {
      const combo = parseCombo(options.value)
      return `${combo.length} Letter Words Ending In ${combo.letters.toUpperCase()}`
    }
  }
}

function getDescription(options: PageBuilderOptions) {
  const title = getTitle(options)

  return `${title} for Scrabble, Wordle, crosswords, anagrams, and word games. Browse matching words with letter counts, Scrabble scores, and useful word details.`
}

function buildRelatedLinks(options: PageBuilderOptions) {
  return [
    { label: 'Word Finder', href: '/word-finder' },
    { label: 'Anagram Solver', href: '/anagram-solver' },
    { label: 'Scrabble Word Finder', href: '/scrabble-word-finder' },
    { label: 'Wordle Helper', href: '/wordle-helper' },
    { label: '2 Letter Words', href: '/2-letter-words' },
    { label: '3 Letter Words', href: '/3-letter-words' },
    { label: '4 Letter Words', href: '/4-letter-words' },
    { label: '5 Letter Words', href: '/5-letter-words' },
  ]
}

export function buildSeoPage(options: PageBuilderOptions) {
  const words = getDictionary()

  let filtered: string[] = []

  switch (options.type) {
    case 'length':
      filtered = filterWords(words, { length: Number(options.value) })
      break

    case 'startsWith':
      filtered = filterWords(words, { startsWith: String(options.value) })
      break

    case 'endsWith':
      filtered = filterWords(words, { endsWith: String(options.value) })
      break

    case 'contains':
      filtered = filterWords(words, { contains: String(options.value) })
      break

    case 'scrabbleScore':
      filtered = words.filter((word) => getWordStats(word).score === Number(options.value))
      break

    case 'vowels':
      filtered = words.filter((word) => getWordStats(word).vowels === Number(options.value))
      break

    case 'consonants':
      filtered = words.filter((word) => getWordStats(word).consonants === Number(options.value))
      break

    case 'lengthStartsWith': {
      const combo = parseCombo(options.value)
      filtered = words.filter(
        (word) =>
          word.length === combo.length &&
          word.toLowerCase().startsWith(combo.letters)
      )
      break
    }

    case 'lengthEndsWith': {
      const combo = parseCombo(options.value)
      filtered = words.filter(
        (word) =>
          word.length === combo.length &&
          word.toLowerCase().endsWith(combo.letters)
      )
      break
    }
  }

  const title = getTitle(options)
  const description = getDescription(options)
  const canonical = `${SITE_URL}${getSlug(options)}`

  return {
    title: `${title} | UnscrambleHQ`,
    h1: title,
    description,
    canonical,
    words: filtered,
    total: filtered.length,
    relatedLinks: buildRelatedLinks(options),
  }
}