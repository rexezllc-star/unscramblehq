import { buildSeoPage, PageBuilderOptions } from '@/lib/pageBuilder'

export type RouteFactoryResult = ReturnType<typeof buildSeoPage>

export function buildRoutePage(
  type: PageBuilderOptions['type'],
  value: PageBuilderOptions['value']
): RouteFactoryResult {
  return buildSeoPage({ type, value })
}

export function parseLengthSlug(slug: string): number | null {
  const match = slug.match(/^([2-9]|1[0-5])-letter-words$/)
  return match ? Number(match[1]) : null
}

export function parseStartsWithSlug(slug: string): string | null {
  const match = slug.match(/^words-starting-with-([a-z]+)$/)
  return match ? match[1].toLowerCase() : null
}

export function parseEndsWithSlug(slug: string): string | null {
  const match = slug.match(/^words-ending-in-([a-z]+)$/)
  return match ? match[1].toLowerCase() : null
}

export function parseContainsSlug(slug: string): string | null {
  const match = slug.match(/^words-containing-([a-z]+)$/)
  return match ? match[1].toLowerCase() : null
}

export function parseScrabbleScoreSlug(slug: string): number | null {
  const match = slug.match(/^words-with-([0-9]+)-scrabble-points$/)
  return match ? Number(match[1]) : null
}

export function parseVowelsSlug(slug: string): number | null {
  const match = slug.match(/^words-with-([0-9]+)-vowels$/)
  return match ? Number(match[1]) : null
}

export function parseConsonantsSlug(slug: string): number | null {
  const match = slug.match(/^words-with-([0-9]+)-consonants$/)
  return match ? Number(match[1]) : null
}

export function parseLengthStartsWithSlug(slug: string): string | null {
  const match = slug.match(/^([2-9]|1[0-5])-letter-words-starting-with-([a-z]+)$/)
  return match ? `${Number(match[1])}:${match[2].toLowerCase()}` : null
}

export function parseLengthEndsWithSlug(slug: string): string | null {
  const match = slug.match(/^([2-9]|1[0-5])-letter-words-ending-in-([a-z]+)$/)
  return match ? `${Number(match[1])}:${match[2].toLowerCase()}` : null
}