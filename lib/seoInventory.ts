import { DICTIONARY } from '@/lib/dictionary'
import { getWordStats } from '@/lib/wordStats'

const MIN_MATCHING_WORDS = 3
const STATIC_SEO_ROUTES = 8000
const SITEMAP_SEO_ROUTES = 80000

export type LengthPattern = {
  length: number
  letters: string
}

export type SeoInventory = {
  lengths: number[]
  prefixes: string[]
  suffixes: string[]
  contains: string[]
  scrabbleScores: number[]
  vowelCounts: number[]
  consonantCounts: number[]
  lengthPrefixes: LengthPattern[]
  lengthSuffixes: LengthPattern[]
}

type RouteBucket =
  | { type: 'prefixes'; value: string }
  | { type: 'suffixes'; value: string }
  | { type: 'contains'; value: string }
  | { type: 'scrabbleScores'; value: number }
  | { type: 'vowelCounts'; value: number }
  | { type: 'consonantCounts'; value: number }
  | { type: 'lengthPrefixes'; value: LengthPattern }
  | { type: 'lengthSuffixes'; value: LengthPattern }

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, '')
}

function addCount<T>(map: Map<T, number>, key: T) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + 1)
}

function getQualifiedKeys(map: Map<string, number>) {
  return Array.from(map.entries())
    .filter(([, count]) => count >= MIN_MATCHING_WORDS)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key]) => key)
}

function getQualifiedNumbers(map: Map<number, number>) {
  return Array.from(map.entries())
    .filter(([, count]) => count >= MIN_MATCHING_WORDS)
    .sort((a, b) => a[0] - b[0])
    .map(([key]) => key)
}

function getQualifiedPatterns(map: Map<string, number>) {
  return Array.from(map.entries())
    .filter(([, count]) => count >= MIN_MATCHING_WORDS)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key]) => {
      const [length, letters] = key.split(':')
      return {
        length: Number(length),
        letters,
      }
    })
}

let allRoutesCache: {
  lengths: number[]
  routes: RouteBucket[]
} | null = null

let staticInventoryCache: SeoInventory | null = null
let sitemapInventoryCache: SeoInventory | null = null

function emptyInventory(lengths: number[]): SeoInventory {
  return {
    lengths,
    prefixes: [],
    suffixes: [],
    contains: [],
    scrabbleScores: [],
    vowelCounts: [],
    consonantCounts: [],
    lengthPrefixes: [],
    lengthSuffixes: [],
  }
}

function getAllSeoRoutes() {
  if (allRoutesCache) return allRoutesCache

  const lengthSet = new Set<number>()
  const prefixCounts = new Map<string, number>()
  const suffixCounts = new Map<string, number>()
  const containsCounts = new Map<string, number>()
  const scrabbleScoreCounts = new Map<number, number>()
  const vowelCounts = new Map<number, number>()
  const consonantCounts = new Map<number, number>()
  const lengthPrefixCounts = new Map<string, number>()
  const lengthSuffixCounts = new Map<string, number>()

  for (const entry of DICTIONARY) {
    const word = normalizeWord(entry.word)

    if (!word || word.length < 2 || word.length > 15) continue

    const stats = getWordStats(word)

    lengthSet.add(word.length)

    addCount(prefixCounts, word.slice(0, 1))
    addCount(prefixCounts, word.slice(0, 2))
    addCount(prefixCounts, word.slice(0, 3))
    addCount(prefixCounts, word.slice(0, 4))

    addCount(suffixCounts, word.slice(-1))
    addCount(suffixCounts, word.slice(-2))
    addCount(suffixCounts, word.slice(-3))
    addCount(suffixCounts, word.slice(-4))

    for (let size = 2; size <= 5; size += 1) {
      for (let index = 0; index <= word.length - size; index += 1) {
        addCount(containsCounts, word.slice(index, index + size))
      }
    }

    addCount(scrabbleScoreCounts, stats.score)
    addCount(vowelCounts, stats.vowels)
    addCount(consonantCounts, stats.consonants)

    for (let size = 1; size <= 3; size += 1) {
      if (word.length >= size) {
        addCount(lengthPrefixCounts, `${word.length}:${word.slice(0, size)}`)
        addCount(lengthSuffixCounts, `${word.length}:${word.slice(-size)}`)
      }
    }
  }

  const lengths = Array.from(lengthSet).sort((a, b) => a - b)
  const prefixes = getQualifiedKeys(prefixCounts)
  const suffixes = getQualifiedKeys(suffixCounts)
  const contains = getQualifiedKeys(containsCounts)
  const scrabbleScores = getQualifiedNumbers(scrabbleScoreCounts)
  const qualifiedVowelCounts = getQualifiedNumbers(vowelCounts)
  const qualifiedConsonantCounts = getQualifiedNumbers(consonantCounts)
  const lengthPrefixes = getQualifiedPatterns(lengthPrefixCounts)
  const lengthSuffixes = getQualifiedPatterns(lengthSuffixCounts)

  allRoutesCache = {
    lengths,
    routes: [
      ...prefixes.map((value) => ({ type: 'prefixes' as const, value })),
      ...suffixes.map((value) => ({ type: 'suffixes' as const, value })),
      ...contains.map((value) => ({ type: 'contains' as const, value })),
      ...scrabbleScores.map((value) => ({ type: 'scrabbleScores' as const, value })),
      ...qualifiedVowelCounts.map((value) => ({ type: 'vowelCounts' as const, value })),
      ...qualifiedConsonantCounts.map((value) => ({ type: 'consonantCounts' as const, value })),
      ...lengthPrefixes.map((value) => ({ type: 'lengthPrefixes' as const, value })),
      ...lengthSuffixes.map((value) => ({ type: 'lengthSuffixes' as const, value })),
    ],
  }

  return allRoutesCache
}

function buildInventory(limit: number): SeoInventory {
  const { lengths, routes } = getAllSeoRoutes()
  const inventory = emptyInventory(lengths)

  for (const route of routes.slice(0, limit)) {
    if (route.type === 'prefixes') inventory.prefixes.push(route.value)
    if (route.type === 'suffixes') inventory.suffixes.push(route.value)
    if (route.type === 'contains') inventory.contains.push(route.value)
    if (route.type === 'scrabbleScores') inventory.scrabbleScores.push(route.value)
    if (route.type === 'vowelCounts') inventory.vowelCounts.push(route.value)
    if (route.type === 'consonantCounts') inventory.consonantCounts.push(route.value)
    if (route.type === 'lengthPrefixes') inventory.lengthPrefixes.push(route.value)
    if (route.type === 'lengthSuffixes') inventory.lengthSuffixes.push(route.value)
  }

  return inventory
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