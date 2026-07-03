import type { MetadataRoute } from 'next'
import {
  CONTAINS_COMBINATIONS,
  ENDING_SUFFIXES,
  STARTING_PREFIXES,
} from '@/lib/seoRouteLists'

const SITE_URL = 'https://www.unscramblehq.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/word-finder',
    '/anagram-solver',
    '/scrabble-word-finder',
    '/wordle-helper',
  ]

  const lengthPages = Array.from(
    { length: 14 },
    (_, index) => `/${index + 2}-letter-words`
  )

  const startsWithPages = STARTING_PREFIXES.map(
    (prefix) => `/words-starting-with-${prefix}`
  )

  const endingPages = ENDING_SUFFIXES.map(
    (suffix) => `/words-ending-in-${suffix}`
  )

  const containsPages = CONTAINS_COMBINATIONS.map(
    (letters) => `/words-containing-${letters}`
  )

  return [
    ...staticPages,
    ...lengthPages,
    ...startsWithPages,
    ...endingPages,
    ...containsPages,
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}