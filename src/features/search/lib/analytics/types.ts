export interface SearchLogEntry {
  query: string
  queryType: 'keyword' | 'semantic' | 'hybrid'
  resultsCount: number
  responseTimeMs: number
  sessionId?: string
  userId?: number
}

export interface SearchClickEntry {
  query: string
  clickedId: number
  clickedCollection: string
  clickedPosition: number
  sessionId?: string
}

export interface SearchAnalyticsSummary {
  totalSearches: number
  uniqueQueries: number
  zeroResultQueries: string[]
  topQueries: { query: string; count: number }[]
  avgResponseTime: number
  clickThroughRate: number
}
