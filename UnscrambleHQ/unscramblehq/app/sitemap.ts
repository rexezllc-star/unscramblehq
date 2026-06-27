import type { MetadataRoute } from 'next'

const base = 'https://unscramblehq.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/anagram-solver', '/word-finder', '/wordle-helper', '/scrabble-word-finder']
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8
  }))
}
