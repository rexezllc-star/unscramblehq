export type WordEntry = {
  word: string
  definition: string
}

export type SearchFilters = {
  minLength?: number
  maxLength?: number
  exactLength?: number
  startsWith?: string
  endsWith?: string
  contains?: string
  excludes?: string
  minScore?: number
  sortBy?: 'alphabetical' | 'score' | 'longest'
}

export type SearchResult = WordEntry & {
  length: number
  score: number
  wwfScore: number
}
