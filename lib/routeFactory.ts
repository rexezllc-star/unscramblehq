import {
  buildSeoPage,
  type LengthPatternValue,
  type PageBuilderOptions,
} from '@/lib/pageBuilder'

export type RouteFactoryResult = ReturnType<typeof buildSeoPage>

export function buildRoutePage(
  options: PageBuilderOptions
): RouteFactoryResult {
  return buildSeoPage(options)
}

export function isValidLength(
  value: string | number
): boolean {
  const length = Number(value)

  return (
    Number.isInteger(length) &&
    length >= 2 &&
    length <= 15
  )
}

export function isValidLetters(
  value: string
): boolean {
  return /^[a-z]+$/i.test(value)
}

export function parseLengthSlug(
  slug: string
): number | null {
  const match = slug.match(
    /^([2-9]|1[0-5])-letter-words$/
  )

  if (!match) return null

  const length = Number(match[1])

  return isValidLength(length)
    ? length
    : null
}

export function parseStartsWithSlug(
  slug: string
): string | null {
  const match = slug.match(
    /^words-starting-with-([a-z]+)$/
  )

  if (!match) return null

  const letters = match[1].toLowerCase()

  return isValidLetters(letters)
    ? letters
    : null
}

export function parseEndsWithSlug(
  slug: string
): string | null {
  const match = slug.match(
    /^words-ending-in-([a-z]+)$/
  )

  if (!match) return null

  const letters = match[1].toLowerCase()

  return isValidLetters(letters)
    ? letters
    : null
}

export function parseContainsSlug(
  slug: string
): string | null {
  const match = slug.match(
    /^words-containing-([a-z]+)$/
  )

  if (!match) return null

  const letters = match[1].toLowerCase()

  return isValidLetters(letters)
    ? letters
    : null
}

export function parseLengthStartsWithSlug(
  slug: string
): LengthPatternValue | null {
  const match = slug.match(
    /^([2-9]|1[0-5])-letter-words-starting-with-([a-z]+)$/
  )

  if (!match) return null

  const length = Number(match[1])
  const letters = match[2].toLowerCase()

  if (
    !isValidLength(length) ||
    !isValidLetters(letters)
  ) {
    return null
  }

  return {
    length,
    letters,
  }
}

export function parseLengthEndsWithSlug(
  slug: string
): LengthPatternValue | null {
  const match = slug.match(
    /^([2-9]|1[0-5])-letter-words-ending-in-([a-z]+)$/
  )

  if (!match) return null

  const length = Number(match[1])
  const letters = match[2].toLowerCase()

  if (
    !isValidLength(length) ||
    !isValidLetters(letters)
  ) {
    return null
  }

  return {
    length,
    letters,
  }
}

export function parseLengthContainsSlug(
  slug: string
): LengthPatternValue | null {
  const match = slug.match(
    /^([2-9]|1[0-5])-letter-words-containing-([a-z]+)$/
  )

  if (!match) return null

  const length = Number(match[1])
  const letters = match[2].toLowerCase()

  if (
    !isValidLength(length) ||
    !isValidLetters(letters)
  ) {
    return null
  }

  return {
    length,
    letters,
  }
}

export function parseScrabbleScoreSlug(
  slug: string
): number | null {
  const match = slug.match(
    /^words-with-(\d+)-scrabble-points$/
  )

  if (!match) return null

  const score = Number(match[1])

  if (
    !Number.isInteger(score) ||
    score < 1 ||
    score > 60
  ) {
    return null
  }

  return score
}