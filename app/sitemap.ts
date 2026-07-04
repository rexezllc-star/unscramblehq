import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.unscramblehq.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/word-finder',
    '/anagram-solver',
    '/scrabble-word-finder',
    '/wordle-helper',
  ]

  return staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}