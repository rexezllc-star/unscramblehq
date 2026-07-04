import type { MetadataRoute } from 'next'
import { getSeoInventory } from '@/lib/seoInventory'

const SITE_URL = 'https://www.unscramblehq.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const inventory = getSeoInventory()

  const staticPages = [
    '',
    '/word-finder',
    '/anagram-solver',
    '/scrabble-word-finder',
    '/wordle-helper',
  ]

  const lengthPages = inventory.lengths.map(
    (length) => `/${length}-letter-words`
  )

  const startsWithPages = inventory.prefixes.map(
    (prefix) => `/words-starting-with-${prefix}`
  )

  const endingPages = inventory.suffixes.map(
    (suffix) => `/words-ending-in-${suffix}`
  )

  const containsPages = inventory.contains.map(
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