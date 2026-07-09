import { DICTIONARY } from '@/lib/dictionary'

const MIN_MATCHING_WORDS = 3
const STATIC_SEO_ROUTES = 8000
const SITEMAP_SEO_ROUTES = 80000

export type SeoInventory = {
  lengths: number[]
  prefixes: string[]
  suffixes: string[]
  contains: string[]
}

type RouteBucket = {
  type: 'prefixes' | 'suffixes' | 'contains'
  value: string
}

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, '')
}

function addCount(map: Map<string, number>, key: string) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + 1)
}

function getQualifiedKeys(map: Map<string, number>) {
  return Array.from(map.entries())
    .filter(([, count]) => count >= MIN_MATCHING_WORDS)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key]) => key)
}

let allRoutesCache: {
  lengths: number[]
  routes: RouteBucket[]
} | null = null

let staticInventoryCache: SeoInventory | null = null
let sitemapInventoryCache: SeoInventory | null = null

function getAllSeoRoutes() {
  if (allRoutesCache) return allRoutesCache

  const lengthSet = new Set<number>()
  const prefixCounts = new Map<string, number>()
  const suffixCounts = new Map<string, number>()
  const containsCounts = new Map<string, number>()

  for (const entry of DICTIONARY) {
    const word = normalizeWord(entry.word)

    if (!word || word.length < 2 || word.length > 15) continue

    lengthSet.add(word.length)

    addCount(prefixCounts, word.slice(0, 1))
    addCount(prefixCounts, word.slice(0, 2))
    addCount(prefixCounts, word.slice(0, 3))

    addCount(suffixCounts, word.slice(-1))
    addCount(suffixCounts, word.slice(-2))
    addCount(suffixCounts, word.slice(-3))

    for (let size = 2; size <= 3; size += 1) {
      for (let index = 0; index <= word.length - size; index += 1) {
        addCount(containsCounts, word.slice(index, index + size))
      }
    }
  }

  const lengths = Array.from(lengthSet).sort((a, b) => a - b)
  const prefixes = getQualifiedKeys(prefixCounts)
  const suffixes = getQualifiedKeys(suffixCounts)
  const contains = getQualifiedKeys(containsCounts)

  allRoutesCache = {
    lengths,
    routes: [
      ...prefixes.map((value) => ({ type: 'prefixes' as const, value })),
      ...suffixes.map((value) => ({ type: 'suffixes' as const, value })),
      ...contains.map((value) => ({ type: 'contains' as const, value })),
    ],
  }

  return allRoutesCache
}

function buildInventory(limit: number): SeoInventory {
  const { lengths, routes } = getAllSeoRoutes()
  const cappedRoutes = routes.slice(0, limit)

  return {
    lengths,
    prefixes: cappedRoutes
      .filter((route) => route.type === 'prefixes')
      .map((route) => route.value),
    suffixes: cappedRoutes
      .filter((route) => route.type === 'suffixes')
      .map((route) => route.value),
    contains: cappedRoutes
      .filter((route) => route.type === 'contains')
      .map((route) => route.value),
  }
}

export function getSeoInventory(): SeoInventory {
  if (staticInventoryCache) return staticInventoryCache
  staticInventoryCache = buildInventory(STATIC_SEO_ROUTES)
  return staticInventoryCache
}

export function getSitemapSeoInventory(): SeoInventory {
  if (sitemapInventoryCache) return sitemapInventoryCache
  sitemapInventoryCache = buildInventory(SITEMAP_SEO_ROUTES)
  return sitemapInventoryCache
}