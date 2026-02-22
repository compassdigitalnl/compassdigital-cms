import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'

/**
 * Meilisearch Settings Global
 *
 * Complete CMS-driven configuration for Meilisearch search engine.
 * Allows per-client customization of:
 * - Which collections to index
 * - Searchable, filterable, and sortable fields
 * - Ranking rules and weights
 * - Typo tolerance
 * - Synonyms and stop words
 * - Exclusion patterns
 * - Auto-indexing behavior
 *
 * @see docs/MEILISEARCH_SETTINGS_GUIDE.md
 */
export const MeilisearchSettings: GlobalConfig = {
  slug: 'meilisearch-settings',
  label: 'Meilisearch Settings',
  access: {
    read: () => true, // Public read (used by search)
    update: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    description:
      'Configure Meilisearch search engine behavior, indexing, and ranking rules.',
    group: 'Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ═══════════════════════════════════════════════════════════
        // TAB 1: INDEXED COLLECTIONS
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Indexed Collections',
          description: 'Configure which collections to index and search',
          fields: [
            {
              name: 'indexedCollections',
              type: 'array',
              label: 'Indexed Collections',
              admin: {
                description:
                  'Select which collections to include in the search index. Each collection can be customized individually.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'collection',
                      type: 'select',
                      required: true,
                      label: 'Collection',
                      options: [
                        { label: 'Products', value: 'products' },
                        { label: 'Blog Posts', value: 'blog-posts' },
                        { label: 'Pages', value: 'pages' },
                        { label: 'Cases', value: 'cases' },
                        { label: 'FAQs', value: 'faqs' },
                        { label: 'Testimonials', value: 'testimonials' },
                        { label: 'Services', value: 'services' },
                      ],
                      admin: {
                        width: '40%',
                      },
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Indexing',
                      admin: {
                        width: '30%',
                      },
                    },
                    {
                      name: 'priority',
                      type: 'number',
                      label: 'Priority',
                      defaultValue: 1,
                      min: 0,
                      max: 10,
                      admin: {
                        width: '30%',
                        description: 'Higher = more important (0-10)',
                      },
                    },
                  ],
                },
                {
                  name: 'indexName',
                  type: 'text',
                  label: 'Custom Index Name',
                  admin: {
                    description:
                      'Optional custom index name (defaults to collection slug). Use for multi-tenant setups.',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 2: SEARCHABLE FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Searchable Fields',
          description: 'Configure which fields are searchable and their importance',
          fields: [
            {
              name: 'searchableFields',
              type: 'group',
              label: 'Searchable Fields Configuration',
              fields: [
                {
                  name: 'products',
                  type: 'array',
                  label: 'Products - Searchable Fields',
                  admin: {
                    description: 'Fields to search in Products collection (in order of importance)',
                  },
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Title', value: 'title' },
                        { label: 'SKU', value: 'sku' },
                        { label: 'EAN', value: 'ean' },
                        { label: 'Brand', value: 'brand' },
                        { label: 'Description', value: 'description' },
                        { label: 'Short Description', value: 'shortDescription' },
                        { label: 'Categories', value: 'categories' },
                        { label: 'Tags', value: 'tags' },
                      ],
                    },
                  ],
                },
                {
                  name: 'blogPosts',
                  type: 'array',
                  label: 'Blog Posts - Searchable Fields',
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Title', value: 'title' },
                        { label: 'Excerpt', value: 'excerpt' },
                        { label: 'Content', value: 'content' },
                        { label: 'Categories', value: 'categories' },
                        { label: 'Tags', value: 'tags' },
                        { label: 'Author', value: 'author' },
                      ],
                    },
                  ],
                },
                {
                  name: 'pages',
                  type: 'array',
                  label: 'Pages - Searchable Fields',
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Title', value: 'title' },
                        { label: 'Meta Description', value: 'metaDescription' },
                        { label: 'Content Blocks', value: 'content' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 3: FILTERABLE & SORTABLE FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Filterable & Sortable',
          description: 'Configure faceted search and sorting options',
          fields: [
            {
              name: 'filterableFields',
              type: 'group',
              label: 'Filterable Fields (Faceted Search)',
              fields: [
                {
                  name: 'products',
                  type: 'array',
                  label: 'Products - Filterable Fields',
                  admin: {
                    description: 'Fields that can be used for filtering (facets)',
                  },
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Brand', value: 'brand' },
                        { label: 'Categories', value: 'categories' },
                        { label: 'Price', value: 'price' },
                        { label: 'Stock', value: 'stock' },
                        { label: 'Status', value: 'status' },
                        { label: 'Featured', value: 'featured' },
                        { label: 'Condition', value: 'condition' },
                        { label: 'Tags', value: 'tags' },
                      ],
                    },
                  ],
                },
                {
                  name: 'blogPosts',
                  type: 'array',
                  label: 'Blog Posts - Filterable Fields',
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Categories', value: 'categories' },
                        { label: 'Status', value: 'status' },
                        { label: 'Featured', value: 'featured' },
                        { label: 'Published At', value: 'publishedAt' },
                        { label: 'Author', value: 'author' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'sortableFields',
              type: 'group',
              label: 'Sortable Fields',
              fields: [
                {
                  name: 'products',
                  type: 'array',
                  label: 'Products - Sortable Fields',
                  admin: {
                    description: 'Fields that users can sort by',
                  },
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Price', value: 'price' },
                        { label: 'Created At', value: 'createdAt' },
                        { label: 'Title', value: 'title' },
                        { label: 'Stock', value: 'stock' },
                        { label: 'Sales Count', value: 'salesCount' },
                      ],
                    },
                  ],
                },
                {
                  name: 'blogPosts',
                  type: 'array',
                  label: 'Blog Posts - Sortable Fields',
                  fields: [
                    {
                      name: 'field',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Published At', value: 'publishedAt' },
                        { label: 'Title', value: 'title' },
                        { label: 'View Count', value: 'viewCount' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 4: RANKING & RELEVANCE
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Ranking & Relevance',
          description: 'Configure how search results are ranked',
          fields: [
            {
              name: 'rankingRules',
              type: 'array',
              label: 'Ranking Rules',
              admin: {
                description:
                  'Order of importance for ranking search results. Drag to reorder. First rule = highest priority.',
              },
              fields: [
                {
                  name: 'rule',
                  type: 'select',
                  required: true,
                  options: [
                    {
                      label: 'Words (Matching terms count)',
                      value: 'words',
                    },
                    {
                      label: 'Typo (Typo tolerance)',
                      value: 'typo',
                    },
                    {
                      label: 'Proximity (Term proximity)',
                      value: 'proximity',
                    },
                    {
                      label: 'Attribute (Field importance)',
                      value: 'attribute',
                    },
                    {
                      label: 'Sort (Custom sorting)',
                      value: 'sort',
                    },
                    {
                      label: 'Exactness (Exact matches)',
                      value: 'exactness',
                    },
                  ],
                },
              ],
            },
            {
              name: 'customRankingAttributes',
              type: 'array',
              label: 'Custom Ranking Attributes',
              admin: {
                description:
                  'Boost specific fields in ranking (e.g., boost featured products or popular posts)',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'attribute',
                      type: 'text',
                      required: true,
                      label: 'Attribute',
                      admin: {
                        width: '60%',
                        description: 'Field name (e.g., "featured", "salesCount")',
                      },
                    },
                    {
                      name: 'order',
                      type: 'select',
                      required: true,
                      label: 'Order',
                      defaultValue: 'desc',
                      options: [
                        { label: 'Ascending (low to high)', value: 'asc' },
                        { label: 'Descending (high to low)', value: 'desc' },
                      ],
                      admin: {
                        width: '40%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 5: TYPO TOLERANCE & SYNONYMS
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Typo & Synonyms',
          description: 'Configure typo tolerance and search synonyms',
          fields: [
            {
              name: 'typoTolerance',
              type: 'group',
              label: 'Typo Tolerance',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Typo Tolerance',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'disableOnWords',
                      type: 'array',
                      label: 'Disable on Words',
                      admin: {
                        width: '50%',
                        description: 'Words where typos should NOT be tolerated (e.g., brand names)',
                      },
                      fields: [
                        {
                          name: 'word',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'minWordSizeForOneTypo',
                      type: 'number',
                      label: 'Min Word Size for 1 Typo',
                      defaultValue: 4,
                      min: 1,
                      admin: {
                        width: '50%',
                        description: 'Minimum characters before allowing 1 typo',
                      },
                    },
                    {
                      name: 'minWordSizeForTwoTypos',
                      type: 'number',
                      label: 'Min Word Size for 2 Typos',
                      defaultValue: 8,
                      min: 1,
                      admin: {
                        width: '50%',
                        description: 'Minimum characters before allowing 2 typos',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'synonyms',
              type: 'array',
              label: 'Synonyms',
              admin: {
                description:
                  'Define synonym groups. Searching for one word will also return results for its synonyms.',
              },
              fields: [
                {
                  name: 'group',
                  type: 'text',
                  required: true,
                  label: 'Synonym Group',
                  admin: {
                    description: 'Comma-separated words (e.g., "laptop,notebook,computer")',
                    placeholder: 'laptop,notebook,computer',
                  },
                },
              ],
            },
            {
              name: 'stopWords',
              type: 'array',
              label: 'Stop Words',
              admin: {
                description:
                  'Words to ignore in search queries (e.g., "the", "a", "an"). Use sparingly!',
              },
              fields: [
                {
                  name: 'word',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 6: EXCLUSIONS & AUTO-INDEXING
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Exclusions & Auto-Index',
          description: 'Configure what NOT to index and auto-indexing behavior',
          fields: [
            {
              name: 'excludePatterns',
              type: 'array',
              label: 'Exclude Patterns',
              admin: {
                description:
                  'URL patterns or content patterns to exclude from indexing (supports wildcards)',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'pattern',
                      type: 'text',
                      required: true,
                      label: 'Pattern',
                      admin: {
                        width: '60%',
                        description: 'e.g., "/admin/*", "/draft/*", "*concept*"',
                        placeholder: '/admin/*',
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      label: 'Type',
                      defaultValue: 'url',
                      options: [
                        { label: 'URL Pattern', value: 'url' },
                        { label: 'Content Pattern', value: 'content' },
                        { label: 'Field Value', value: 'field' },
                      ],
                      admin: {
                        width: '40%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'excludeStatuses',
              type: 'array',
              label: 'Exclude by Status',
              admin: {
                description: 'Document statuses to exclude from indexing',
              },
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' },
                    { label: 'Pending Review', value: 'pending' },
                    { label: 'Sold Out', value: 'sold-out' },
                  ],
                },
              ],
            },
            {
              name: 'autoIndexing',
              type: 'group',
              label: 'Auto-Indexing Behavior',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Auto-Indexing',
                      admin: {
                        width: '50%',
                        description: 'Auto-index documents on create/update',
                      },
                    },
                    {
                      name: 'indexOnPublish',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Index Only on Publish',
                      admin: {
                        width: '50%',
                        description: 'Only index when status = published',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'batchSize',
                      type: 'number',
                      label: 'Batch Size',
                      defaultValue: 100,
                      min: 1,
                      max: 1000,
                      admin: {
                        width: '50%',
                        description: 'Documents per batch when bulk indexing',
                      },
                    },
                    {
                      name: 'debounceMs',
                      type: 'number',
                      label: 'Debounce (ms)',
                      defaultValue: 1000,
                      min: 0,
                      admin: {
                        width: '50%',
                        description: 'Delay before indexing (prevents spam)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 7: PAGINATION & PERFORMANCE
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Pagination & Performance',
          description: 'Configure pagination and performance settings',
          fields: [
            {
              name: 'pagination',
              type: 'group',
              label: 'Pagination Settings',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'maxTotalHits',
                      type: 'number',
                      label: 'Max Total Hits',
                      defaultValue: 1000,
                      min: 1,
                      admin: {
                        width: '33%',
                        description: 'Maximum search results to return',
                      },
                    },
                    {
                      name: 'defaultLimit',
                      type: 'number',
                      label: 'Default Results per Page',
                      defaultValue: 20,
                      min: 1,
                      max: 100,
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'maxLimit',
                      type: 'number',
                      label: 'Max Results per Page',
                      defaultValue: 100,
                      min: 1,
                      admin: {
                        width: '34%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'performance',
              type: 'group',
              label: 'Performance & Caching',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enableHighlighting',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Search Highlighting',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'highlightPreTag',
                      type: 'text',
                      label: 'Highlight Pre Tag',
                      defaultValue: '<mark>',
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'highlightPostTag',
                      type: 'text',
                      label: 'Highlight Post Tag',
                      defaultValue: '</mark>',
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cropLength',
                      type: 'number',
                      label: 'Crop Length',
                      defaultValue: 200,
                      min: 10,
                      admin: {
                        width: '50%',
                        description: 'Characters to show in search snippets',
                      },
                    },
                    {
                      name: 'cropMarker',
                      type: 'text',
                      label: 'Crop Marker',
                      defaultValue: '...',
                      admin: {
                        width: '50%',
                        description: 'Marker for cropped text',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
