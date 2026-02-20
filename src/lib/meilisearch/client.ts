import { MeiliSearch } from 'meilisearch'

/**
 * Meilisearch Client Configuration
 *
 * Instant search engine with:
 * - <50ms search response times
 * - Typo tolerance
 * - Faceted search & filters
 * - Highlighting
 *
 * Setup:
 * 1. Install: brew install meilisearch (macOS)
 * 2. Start: meilisearch (runs on http://localhost:7700)
 * 3. Or use Docker: docker run -p 7700:7700 getmeili/meilisearch:latest
 */

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
const MEILISEARCH_MASTER_KEY = process.env.MEILISEARCH_MASTER_KEY || ''

if (!MEILISEARCH_HOST) {
  console.warn('⚠️ MEILISEARCH_HOST not configured. Search features will be disabled.')
}

// Server-side client (full access with master key)
export const meilisearchClient = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_MASTER_KEY,
})

// Index names
export const INDEXES = {
  PRODUCTS: process.env.MEILISEARCH_PRODUCTS_INDEX || 'products',
  BLOG_POSTS: process.env.MEILISEARCH_BLOG_INDEX || 'blog-posts',
  PAGES: process.env.MEILISEARCH_PAGES_INDEX || 'pages',
} as const

/**
 * Get or create an index
 */
export async function getOrCreateIndex(indexName: string) {
  try {
    const index = meilisearchClient.index(indexName)

    // Check if index exists by trying to get stats
    await index.getStats()

    return index
  } catch (error: any) {
    if (error.code === 'index_not_found') {
      // Create index if it doesn't exist
      console.log(`📋 Creating Meilisearch index: ${indexName}`)
      await meilisearchClient.createIndex(indexName, { primaryKey: 'id' })
      return meilisearchClient.index(indexName)
    }
    throw error
  }
}

/**
 * Check if Meilisearch is available
 */
export async function isMeilisearchAvailable(): Promise<boolean> {
  try {
    await meilisearchClient.health()
    return true
  } catch (error) {
    console.error('❌ Meilisearch not available:', error)
    return false
  }
}

/**
 * Configure index settings for products
 */
export async function configureProductsIndex() {
  const index = await getOrCreateIndex(INDEXES.PRODUCTS)

  await index.updateSettings({
    // Searchable attributes (in order of importance)
    searchableAttributes: [
      'title',
      'brand',
      'sku',
      'description',
      'categories',
      'tags',
    ],

    // Filterable attributes (for faceted search)
    filterableAttributes: [
      'brand',
      'categories',
      'price',
      'stock',
      'status',
      'featured',
    ],

    // Sortable attributes
    sortableAttributes: [
      'price',
      'createdAt',
      'title',
      'stock',
    ],

    // Display attributes
    displayedAttributes: [
      'id',
      'title',
      'slug',
      'brand',
      'sku',
      'price',
      'image',
      'stock',
      'categories',
      'description',
      'status',
    ],

    // Ranking rules (in order of importance)
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],

    // Typo tolerance
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
    },

    // Pagination
    pagination: {
      maxTotalHits: 1000,
    },
  })

  console.log('✅ Products index configured')
}

/**
 * Configure index settings for blog posts
 */
export async function configureBlogIndex() {
  const index = await getOrCreateIndex(INDEXES.BLOG_POSTS)

  await index.updateSettings({
    searchableAttributes: [
      'title',
      'excerpt',
      'categories',
      'tags',
      'author',
    ],

    filterableAttributes: [
      'categories',
      'status',
      'featured',
      'publishedAt',
    ],

    sortableAttributes: [
      'publishedAt',
      'title',
      'viewCount',
    ],

    displayedAttributes: [
      'id',
      'title',
      'slug',
      'excerpt',
      'featuredImage',
      'featuredImageEmoji',
      'categories',
      'publishedAt',
      'readingTime',
      'status',
    ],

    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],

    typoTolerance: {
      enabled: true,
    },
  })

  console.log('✅ Blog posts index configured')
}

/**
 * Initialize all indexes
 */
export async function initializeMeilisearch() {
  const available = await isMeilisearchAvailable()

  if (!available) {
    console.warn('⚠️ Meilisearch not available. Skipping index initialization.')
    return false
  }

  try {
    console.log('🔍 Initializing Meilisearch indexes...')

    await configureProductsIndex()
    await configureBlogIndex()

    console.log('✅ Meilisearch initialized successfully!')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize Meilisearch:', error)
    return false
  }
}
