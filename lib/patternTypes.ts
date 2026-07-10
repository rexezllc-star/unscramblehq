export type PatternRouteType =
  | 'length-starts-with'
  | 'length-ends-with'
  | 'length-contains'

export type PatternRoute = {
  slug: string
  type: PatternRouteType
  length: number
  letters: string
  matchCount: number
  score: number
}

export type ParsedPatternRoute = {
  type: PatternRouteType
  length: number
  letters: string
}

export type PatternIndexEntry = {
  type: PatternRouteType
  length: number
  letters: string
  matchCount: number
}

export type PatternChunk = {
  page: number
  pageSize: number
  totalRoutes: number
  totalPages: number
  routes: PatternRoute[]
}