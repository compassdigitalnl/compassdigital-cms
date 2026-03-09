export interface HybridSearchResult {
  id: string | number
  title: string
  slug: string
  collection: 'products' | 'blog-posts' | 'pages'
  keywordScore: number
  semanticScore: number
  combinedScore: number
  // Original fields from Meilisearch result
  [key: string]: any
}

export interface HybridSearchOptions {
  query: string
  limit?: number
  collections?: ('products' | 'blog-posts' | 'pages')[]
  keywordWeight?: number // 0-1, default 0.7
  semanticWeight?: number // 0-1, default 0.3
}
