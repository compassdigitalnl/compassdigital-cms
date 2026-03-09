export interface QueryAnalysis {
  originalQuery: string
  isNaturalLanguage: boolean
  extractedKeywords: string[]
  extractedFilters: Record<string, string> // e.g., { brand: 'Plastimed', price_max: '50' }
  suggestedCategory?: string
  intent: 'search' | 'navigate' | 'compare' | 'question'
}
