import { getWordsByLengthIndex } from '@/lib/patternIndex'
import type {
  ParsedPatternRoute,
  PatternRouteType,
} from '@/lib/patternTypes'

const MIN_LENGTH = 2
const MAX_LENGTH = 15

const MIN_PREFIX_SUFFIX_SIZE = 1
const MAX_PREFIX_SUFFIX_SIZE = 7

const MIN_CONTAINS_SIZE = 2
const MAX_CONTAINS_SIZE = 6

function isValidLength(length: number): boolean {
  return (
    Number.isInteger(length) &&
    length >= MIN_LENGTH &&
    length <= MAX_LENGTH
  )
}

function isValidLetters(
  letters: string,
  minimum: number,
  maximum: number
): boolean {
  return (
    /^[a-z]+$/.test(letters) &&
    letters.length >= minimum &&
    letters.length <= maximum
  )
}

function createParsedRoute(
  type: PatternRouteType,
  lengthValue: string,
  lettersValue: string
): ParsedPatternRoute | null {
  const length = Number(lengthValue)
  const letters = lettersValue.toLowerCase()

  if (!isValidLength(length)) {
    return null
  }

  if (type === 'length-contains') {
    if (
      !isValidLetters(
        letters,
        MIN_CONTAINS_SIZE,
        MAX_CONTAINS_SIZE
      )
    ) {
      return null
    }
  } else if (
    !isValidLetters(
      letters,
      MIN_PREFIX_SUFFIX_SIZE,
      MAX_PREFIX_SUFFIX_SIZE
    )
  ) {
    return null
  }

  if (letters.length >= length) {
    return null
  }

  return {
    type,
    length,
    letters,
  }
}

export function parsePatternSlug(
  slug: string
): ParsedPatternRoute | null {
  const normalized = slug
    .trim()
    .toLowerCase()

  const startsWithMatch = normalized.match(
    /^([2-9]|1[0-5])-letter-words-starting-with-([a-z]+)$/
  )

  if (startsWithMatch) {
    return createParsedRoute(
      'length-starts-with',
      startsWithMatch[1],
      startsWithMatch[2]
    )
  }

  const endsWithMatch = normalized.match(
    /^([2-9]|1[0-5])-letter-words-ending-in-([a-z]+)$/
  )

  if (endsWithMatch) {
    return createParsedRoute(
      'length-ends-with',
      endsWithMatch[1],
      endsWithMatch[2]
    )
  }

  const containsMatch = normalized.match(
    /^([2-9]|1[0-5])-letter-words-containing-([a-z]+)$/
  )

  if (containsMatch) {
    return createParsedRoute(
      'length-contains',
      containsMatch[1],
      containsMatch[2]
    )
  }

  return null
}

export function getPatternMatches(
  route: ParsedPatternRoute
): string[] {
  const words =
    getWordsByLengthIndex().get(route.length) ?? []

  switch (route.type) {
    case 'length-starts-with':
      return words.filter((word) =>
        word.startsWith(route.letters)
      )

    case 'length-ends-with':
      return words.filter((word) =>
        word.endsWith(route.letters)
      )

    case 'length-contains':
      return words.filter((word) =>
        word.includes(route.letters)
      )
  }
}

export function filterPatternWords(
  route: ParsedPatternRoute,
  limit = 100
): string[] {
  const matches = getPatternMatches(route)

  return matches.slice(
    0,
    Math.max(1, Math.floor(limit))
  )
}

export function getPatternMatchCount(
  route: ParsedPatternRoute
): number {
  return getPatternMatches(route).length
}

export function isQualifiedPatternRoute(
  route: ParsedPatternRoute,
  minimumMatches = 2
): boolean {
  return (
    getPatternMatchCount(route) >= minimumMatches
  )
}