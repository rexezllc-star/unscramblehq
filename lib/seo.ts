export type SeoPageType = 'length' | 'startsWith' | 'endsWith' | 'contains' | 'word'

export type SeoPageDefinition = {
  type: SeoPageType
  value: string | number
  path: string
  title: string
  h1: string
  description: string
  canonical: string
}

const SITE_URL = 'https://unscramblehq.com'

export function createSeoPageDefinition(
  type: SeoPageType,
  value: string | number
): SeoPageDefinition {
  const cleanValue = String(value).toLowerCase()

  if (type === 'length') {
    return {
      type,
      value,
      path: `/${cleanValue}-letter-words`,
      title: `${cleanValue} Letter Words | UnscrambleHQ`,
      h1: `${cleanValue} Letter Words`,
      description: `Find ${cleanValue} letter words for word games, anagrams, Scrabble, Wordle, and word puzzles.`,
      canonical: `${SITE_URL}/${cleanValue}-letter-words`,
    }
  }

  if (type === 'startsWith') {
    return {
      type,
      value: cleanValue,
      path: `/words-starting-with-${cleanValue}`,
      title: `Words Starting With ${cleanValue.toUpperCase()} | UnscrambleHQ`,
      h1: `Words Starting With ${cleanValue.toUpperCase()}`,
      description: `Browse words starting with ${cleanValue.toUpperCase()} for word games, anagrams, Scrabble, Wordle, and crossword puzzles.`,
      canonical: `${SITE_URL}/words-starting-with-${cleanValue}`,
    }
  }

  if (type === 'endsWith') {
    return {
      type,
      value: cleanValue,
      path: `/words-ending-in-${cleanValue}`,
      title: `Words Ending In ${cleanValue.toUpperCase()} | UnscrambleHQ`,
      h1: `Words Ending In ${cleanValue.toUpperCase()}`,
      description: `Find words ending in ${cleanValue.toUpperCase()} for word games, anagrams, Scrabble, Wordle, and crossword puzzles.`,
      canonical: `${SITE_URL}/words-ending-in-${cleanValue}`,
    }
  }

  if (type === 'contains') {
    return {
      type,
      value: cleanValue,
      path: `/words-containing-${cleanValue}`,
      title: `Words Containing ${cleanValue.toUpperCase()} | UnscrambleHQ`,
      h1: `Words Containing ${cleanValue.toUpperCase()}`,
      description: `Explore words containing ${cleanValue.toUpperCase()} for anagrams, Scrabble, Wordle, and word puzzle solving.`,
      canonical: `${SITE_URL}/words-containing-${cleanValue}`,
    }
  }

  return {
    type,
    value: cleanValue,
    path: `/word/${cleanValue}`,
    title: `${cleanValue} Definition & Word Details | UnscrambleHQ`,
    h1: `${cleanValue}`,
    description: `View the definition, word score, length, and related word details for ${cleanValue}.`,
    canonical: `${SITE_URL}/word/${cleanValue}`,
  }
}