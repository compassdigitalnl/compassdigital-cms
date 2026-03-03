import type { Payload } from 'payload'
import type { MeilisearchSetting as MeilisearchSettingsType } from '@/payload-types'

/**
 * Meilisearch Settings Helper
 *
 * Fetches and merges CMS-configured Meilisearch settings with sensible defaults.
 * Provides type-safe access to search configuration.
 *
 * @see src/globals/MeilisearchSettings.ts
 * @see docs/MEILISEARCH_SETTINGS_GUIDE.md
 */

// ───────────────────────────────────────────────────────────────────────────
// DEFAULT SETTINGS (Fallbacks when CMS settings not configured)
// ───────────────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  // Default indexed collections
  indexedCollections: [
    { collection: 'products' as const, enabled: true, priority: 1, indexName: 'products' },
    { collection: 'blog-posts' as const, enabled: true, priority: 1, indexName: 'blog-posts' },
    { collection: 'pages' as const, enabled: false, priority: 1, indexName: 'pages' },
  ],

  // Default searchable fields per collection
  searchableFields: {
    products: ['title', 'brand', 'sku', 'ean', 'shortDescription', 'description', 'categories', 'tags', 'specsFlatSearch'] as string[],
    blogPosts: ['title', 'excerpt', 'categories', 'tags', 'author'] as string[],
    pages: ['title', 'metaDescription', 'content'] as string[],
  },

  // Default filterable fields per collection
  filterableFields: {
    products: ['brand', 'brandId', 'brandLevel', 'manufacturer', 'productLine', 'categories', 'categoryIds', 'price', 'effectivePrice', 'stock', 'stockStatus', 'status', 'featured', 'badge', 'productType', 'backordersAllowed', 'specs'] as string[],
    blogPosts: ['categories', 'status', 'featured', 'publishedAt'] as string[],
  },

  // Default sortable fields per collection
  sortableFields: {
    products: ['effectivePrice', 'createdAt', 'title', 'stock'] as string[],
    blogPosts: ['publishedAt', 'title', 'viewCount'] as string[],
  },

  // Default ranking rules
  rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],

  // Default typo tolerance
  typoTolerance: {
    enabled: true,
    minWordSizeForOneTypo: 4,
    minWordSizeForTwoTypos: 8,
  },

  // Default pagination
  pagination: {
    maxTotalHits: 1000,
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Default performance settings
  performance: {
    enableHighlighting: true,
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
    cropLength: 200,
    cropMarker: '...',
  },

  // Default auto-indexing
  autoIndexing: {
    enabled: true,
    indexOnPublish: true,
    batchSize: 100,
    debounceMs: 1000,
  },

  // Default exclusions
  excludeStatuses: ['draft', 'archived'],
  excludePatterns: [
    { pattern: '/admin/*', type: 'url' },
    { pattern: '/api/*', type: 'url' },
  ],
}

// ───────────────────────────────────────────────────────────────────────────
// SETTINGS FETCHER
// ───────────────────────────────────────────────────────────────────────────

/**
 * Fetch Meilisearch settings from CMS
 * Falls back to defaults if not configured
 */
export async function getMeilisearchSettings(
  payload: Payload,
): Promise<MeilisearchSettingsType> {
  try {
    const settings = await payload.findGlobal({
      slug: 'meilisearch-settings',
    })
    return settings as MeilisearchSettingsType
  } catch (error) {
    console.warn('[Meilisearch] Failed to fetch settings from CMS, using defaults:', error)
    return null as any // Will trigger default usage
  }
}

// ───────────────────────────────────────────────────────────────────────────
// SETTINGS MERGER (CMS + Defaults)
// ───────────────────────────────────────────────────────────────────────────

/**
 * Merge CMS settings with defaults
 * CMS settings override defaults
 */
export function mergeSettings(cmsSettings: MeilisearchSettingsType | null) {
  // If no CMS settings, return defaults
  if (!cmsSettings) {
    return DEFAULT_SETTINGS
  }

  // Helper: extract field values from CMS array, fall back to defaults if empty
  const extractFields = (cmsArray: any[] | undefined | null, defaults: string[]): string[] => {
    const fields = cmsArray?.map((f: any) => f.field).filter(Boolean)
    return fields && fields.length > 0 ? fields : defaults
  }

  return {
    // Indexed Collections
    indexedCollections:
      cmsSettings.indexedCollections && cmsSettings.indexedCollections.length > 0
        ? cmsSettings.indexedCollections
        : DEFAULT_SETTINGS.indexedCollections,

    // Searchable Fields
    searchableFields: {
      products: extractFields(cmsSettings.searchableFields?.products, DEFAULT_SETTINGS.searchableFields.products),
      blogPosts: extractFields(cmsSettings.searchableFields?.blogPosts, DEFAULT_SETTINGS.searchableFields.blogPosts),
      pages: extractFields(cmsSettings.searchableFields?.pages, DEFAULT_SETTINGS.searchableFields.pages),
    },

    // Filterable Fields
    filterableFields: {
      products: extractFields(cmsSettings.filterableFields?.products, DEFAULT_SETTINGS.filterableFields.products),
      blogPosts: extractFields(cmsSettings.filterableFields?.blogPosts, DEFAULT_SETTINGS.filterableFields.blogPosts),
    },

    // Sortable Fields
    sortableFields: {
      products: extractFields(cmsSettings.sortableFields?.products, DEFAULT_SETTINGS.sortableFields.products),
      blogPosts: extractFields(cmsSettings.sortableFields?.blogPosts, DEFAULT_SETTINGS.sortableFields.blogPosts),
    },

    // Ranking Rules
    rankingRules:
      cmsSettings.rankingRules && cmsSettings.rankingRules.length > 0
        ? cmsSettings.rankingRules.map((r: any) => r.rule)
        : DEFAULT_SETTINGS.rankingRules,

    // Custom Ranking Attributes
    customRankingAttributes: cmsSettings.customRankingAttributes || [],

    // Typo Tolerance
    typoTolerance: {
      enabled: cmsSettings.typoTolerance?.enabled ?? DEFAULT_SETTINGS.typoTolerance.enabled,
      minWordSizeForOneTypo:
        cmsSettings.typoTolerance?.minWordSizeForOneTypo ??
        DEFAULT_SETTINGS.typoTolerance.minWordSizeForOneTypo,
      minWordSizeForTwoTypos:
        cmsSettings.typoTolerance?.minWordSizeForTwoTypos ??
        DEFAULT_SETTINGS.typoTolerance.minWordSizeForTwoTypos,
      disableOnWords: cmsSettings.typoTolerance?.disableOnWords?.map((w: any) => w.word) || [],
    },

    // Synonyms
    synonyms: cmsSettings.synonyms?.map((s: any) => s.group.split(',').map((w: any) => w.trim())) || [],

    // Stop Words
    stopWords: cmsSettings.stopWords?.map((w: any) => w.word) || [],

    // Pagination
    pagination: {
      maxTotalHits:
        cmsSettings.pagination?.maxTotalHits ?? DEFAULT_SETTINGS.pagination.maxTotalHits,
      defaultLimit: cmsSettings.pagination?.defaultLimit ?? DEFAULT_SETTINGS.pagination.defaultLimit,
      maxLimit: cmsSettings.pagination?.maxLimit ?? DEFAULT_SETTINGS.pagination.maxLimit,
    },

    // Performance
    performance: {
      enableHighlighting:
        cmsSettings.performance?.enableHighlighting ??
        DEFAULT_SETTINGS.performance.enableHighlighting,
      highlightPreTag:
        cmsSettings.performance?.highlightPreTag ?? DEFAULT_SETTINGS.performance.highlightPreTag,
      highlightPostTag:
        cmsSettings.performance?.highlightPostTag ?? DEFAULT_SETTINGS.performance.highlightPostTag,
      cropLength: cmsSettings.performance?.cropLength ?? DEFAULT_SETTINGS.performance.cropLength,
      cropMarker: cmsSettings.performance?.cropMarker ?? DEFAULT_SETTINGS.performance.cropMarker,
    },

    // Auto-Indexing
    autoIndexing: {
      enabled: cmsSettings.autoIndexing?.enabled ?? DEFAULT_SETTINGS.autoIndexing.enabled,
      indexOnPublish:
        cmsSettings.autoIndexing?.indexOnPublish ?? DEFAULT_SETTINGS.autoIndexing.indexOnPublish,
      batchSize: cmsSettings.autoIndexing?.batchSize ?? DEFAULT_SETTINGS.autoIndexing.batchSize,
      debounceMs: cmsSettings.autoIndexing?.debounceMs ?? DEFAULT_SETTINGS.autoIndexing.debounceMs,
    },

    // Exclusions
    excludePatterns: cmsSettings.excludePatterns || DEFAULT_SETTINGS.excludePatterns,
    excludeStatuses:
      cmsSettings.excludeStatuses?.map((s: any) => s.status) || DEFAULT_SETTINGS.excludeStatuses,
  }
}

// ───────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────────────

/**
 * Check if a collection is enabled for indexing
 */
export function isCollectionIndexed(
  collection: string,
  settings: ReturnType<typeof mergeSettings>,
): boolean {
  const config = settings.indexedCollections.find((c: any) => c.collection === collection)
  return config?.enabled ?? false
}

/**
 * Get index name for a collection (supports custom naming)
 */
export function getIndexName(
  collection: string,
  settings: ReturnType<typeof mergeSettings>,
): string {
  const config = settings.indexedCollections.find((c: any) => c.collection === collection)
  return config?.indexName || collection
}

/**
 * Check if a document should be excluded from indexing
 */
export function shouldExcludeDocument(
  doc: any,
  settings: ReturnType<typeof mergeSettings>,
): boolean {
  // Check status exclusion
  if (doc.status && settings.excludeStatuses.includes(doc.status)) {
    return true
  }

  // Check if indexOnPublish is enabled and doc is not published
  if (settings.autoIndexing.indexOnPublish && doc.status !== 'published') {
    return true
  }

  // Check pattern exclusions (basic implementation)
  if (doc.slug) {
    for (const pattern of settings.excludePatterns) {
      if (pattern.type === 'url') {
        const regex = new RegExp(pattern.pattern.replace(/\*/g, '.*'))
        if (regex.test(doc.slug)) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Get searchable fields for a collection
 */
export function getSearchableFields(
  collection: string,
  settings: ReturnType<typeof mergeSettings>,
): string[] {
  const collectionKey = collection.replace('-', '') as keyof typeof settings.searchableFields
  return settings.searchableFields[collectionKey] || []
}

/**
 * Get filterable fields for a collection
 */
export function getFilterableFields(
  collection: string,
  settings: ReturnType<typeof mergeSettings>,
): string[] {
  const collectionKey = collection.replace('-', '') as keyof typeof settings.filterableFields
  return settings.filterableFields[collectionKey] || []
}

/**
 * Get sortable fields for a collection
 */
export function getSortableFields(
  collection: string,
  settings: ReturnType<typeof mergeSettings>,
): string[] {
  const collectionKey = collection.replace('-', '') as keyof typeof settings.sortableFields
  return settings.sortableFields[collectionKey] || []
}
