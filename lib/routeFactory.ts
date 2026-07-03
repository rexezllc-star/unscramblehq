import { buildSeoPage, PageBuilderOptions } from '@/lib/pageBuilder'

export type RouteFactoryResult = ReturnType<typeof buildSeoPage>

export function buildRoutePage(
  type: PageBuilderOptions['type'],
  value: PageBuilderOptions['value']
): RouteFactoryResult {
  return buildSeoPage({
    type,
    value,
  })
}

export function isValidLength(value: string | number): boolean {
  const length = Number(value)
  return Number.isInteger(length) && length >= 2 && length <= 15
}

export function isValidLetters(value: string): boolean {
  return /^[a-z]+$/.test(value.toLowerCase())
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