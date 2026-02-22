import { MeiliSearch } from 'meilisearch'
import type { Payload } from 'payload'
import { getMeilisearchSettings, mergeSettings, getSearchableFields, getFilterableFields, getSortableFields } from './settings'

/**
 * Meilisearch Client Configuration
 *
 * CMS-driven search engine with:
 * - <50ms search response times
 * - Typo tolerance
 * - Faceted search & filters
 * - Highlighting
 * - 100% configurable via Meilisearch Settings global
 *
 * Setup:
 * 1. Install: brew install meilisearch (macOS)
 * 2. Start: meilisearch (runs on http://localhost:7700)
 * 3. Or use Docker: docker run -p 7700:7700 getmeili/meilisearch:latest
 * 4. Configure: /admin/globals/meilisearch-settings
 *
 * @see src/globals/MeilisearchSettings.ts
 * @see docs/MEILISEARCH_SETTINGS_GUIDE.md
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
 * Uses CMS settings from Meilisearch Settings global
 *
 * @param payload - Payload instance to fetch settings
 */
export async function configureProductsIndex(payload: Payload) {
  const index = await getOrCreateIndex(INDEXES.PRODUCTS)

  // Fetch CMS settings
  const cmsSettings = await getMeilisearchSettings(payload)
  const settings = mergeSettings(cmsSettings)

  // Get collection-specific fields
  const searchableAttributes = getSearchableFields('products', settings)
  const filterableAttributes = getFilterableFields('products', settings)
  const sortableAttributes = getSortableFields('products', settings)

  await index.updateSettings({
    // Searchable attributes (from CMS)
    searchableAttributes,

    // Filterable attributes (from CMS)
    filterableAttributes,

    // Sortable attributes (from CMS)
    sortableAttributes,

    // Display attributes (always show these)
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
      'magazineTitle', // For Aboland
    ],

    // Ranking rules (from CMS)
    rankingRules: settings.rankingRules as any[],

    // Typo tolerance (from CMS)
    typoTolerance: {
      enabled: settings.typoTolerance.enabled,
      minWordSizeForTypos: {
        oneTypo: settings.typoTolerance.minWordSizeForOneTypo,
        twoTypos: settings.typoTolerance.minWordSizeForTwoTypos,
      },
      disableOnWords: settings.typoTolerance.disableOnWords,
    },

    // Synonyms (from CMS)
    synonyms: settings.synonyms.reduce((acc, group) => {
      const key = group[0]
      acc[key] = group
      return acc
    }, {} as Record<string, string[]>),

    // Stop words (from CMS)
    stopWords: settings.stopWords,

    // Pagination (from CMS)
    pagination: {
      maxTotalHits: settings.pagination.maxTotalHits,
    },
  })

  console.log('✅ Products index configured with CMS settings')
}

/**
 * Configure index settings for blog posts
 * Uses CMS settings from Meilisearch Settings global
 *
 * @param payload - Payload instance to fetch settings
 */
export async function configureBlogIndex(payload: Payload) {
  const index = await getOrCreateIndex(INDEXES.BLOG_POSTS)

  // Fetch CMS settings
  const cmsSettings = await getMeilisearchSettings(payload)
  const settings = mergeSettings(cmsSettings)

  // Get collection-specific fields
  const searchableAttributes = getSearchableFields('blog-posts', settings)
  const filterableAttributes = getFilterableFields('blog-posts', settings)
  const sortableAttributes = getSortableFields('blog-posts', settings)

  await index.updateSettings({
    // Searchable attributes (from CMS)
    searchableAttributes,

    // Filterable attributes (from CMS)
    filterableAttributes,

    // Sortable attributes (from CMS)
    sortableAttributes,

    // Display attributes (always show these)
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

    // Ranking rules (from CMS)
    rankingRules: settings.rankingRules as any[],

    // Typo tolerance (from CMS)
    typoTolerance: {
      enabled: settings.typoTolerance.enabled,
      minWordSizeForTypos: {
        oneTypo: settings.typoTolerance.minWordSizeForOneTypo,
        twoTypos: settings.typoTolerance.minWordSizeForTwoTypos,
      },
      disableOnWords: settings.typoTolerance.disableOnWords,
    },

    // Synonyms (from CMS)
    synonyms: settings.synonyms.reduce((acc, group) => {
      const key = group[0]
      acc[key] = group
      return acc
    }, {} as Record<string, string[]>),

    // Stop words (from CMS)
    stopWords: settings.stopWords,

    // Pagination (from CMS)
    pagination: {
      maxTotalHits: settings.pagination.maxTotalHits,
    },
  })

  console.log('✅ Blog posts index configured with CMS settings')
}

/**
 * Initialize all indexes
 * Uses CMS settings from Meilisearch Settings global
 *
 * @param payload - Payload instance to fetch settings
 */
export async function initializeMeilisearch(payload: Payload) {
  const available = await isMeilisearchAvailable()

  if (!available) {
    console.warn('⚠️ Meilisearch not available. Skipping index initialization.')
    return false
  }

  try {
    console.log('🔍 Initializing Meilisearch indexes with CMS settings...')

    await configureProductsIndex(payload)
    await configureBlogIndex(payload)

    console.log('✅ Meilisearch initialized successfully with CMS settings!')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize Meilisearch:', error)
    return false
  }
}
