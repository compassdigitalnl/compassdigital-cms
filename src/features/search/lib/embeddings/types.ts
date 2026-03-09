export interface EmbeddingResult {
  id: string | number
  embedding: number[]
  text: string
}

export interface SimilarityResult {
  id: string | number
  score: number
  title?: string
}

export interface EmbeddingConfig {
  model: string
  dimensions: number
  batchSize: number
}

export const EMBEDDING_CONFIG: EmbeddingConfig = {
  model: 'text-embedding-3-small',
  dimensions: 1536,
  batchSize: 100,
}
