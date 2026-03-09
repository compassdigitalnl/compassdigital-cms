import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'
import { indexProduct, deleteProductFromIndex } from '@/features/search/lib/meilisearch/indexProducts'
import { notifyEditionSubscribers } from '../../hooks/notifyEditionSubscribers'

import {
  basicInfoTab,
  pricesTab,
  stockTab,
  shippingTab,
  mediaTab,
  typeConfigTab,
  b2bTabs,
  seoTab,
  specificationsTab,
  relatedTab,
} from './tabs'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Producten',
  },
  admin: {
    useAsTitle: 'title',
    group: 'E-commerce',
    defaultColumns: ['title', 'sku', 'ean', 'price', 'stock', 'status', 'productType', 'updatedAt'],
    hidden: shouldHideCollection('shop'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-generate slug from title if not provided
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Auto-fill canonical URL for child products of grouped products
        try {
          const { sql } = await import('drizzle-orm')
          if (doc.productType === 'simple' && !doc.meta?.canonicalUrl) {
            // Simple product saved — check if it belongs to a grouped parent
            const parentResult: any = await req.payload.db.drizzle.execute(
              sql`SELECT p.slug FROM products p
                  INNER JOIN products_child_products cp ON cp._parent_id = p.id
                  WHERE cp.product_id = ${doc.id}
                    AND p.product_type = 'grouped'
                    AND p.status = 'published'
                  LIMIT 1`
            )
            const parentSlug = parentResult?.rows?.[0]?.slug
            if (parentSlug) {
              const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
              const canonicalUrl = `${baseUrl}/${parentSlug}`
              await req.payload.db.drizzle.execute(
                sql`UPDATE products SET meta_canonical_url = ${canonicalUrl} WHERE id = ${doc.id}`
              )
            }
          } else if (doc.productType === 'grouped') {
            // Grouped product saved — auto-fill canonical for all its children
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
            const canonicalUrl = `${baseUrl}/${doc.slug}`
            await req.payload.db.drizzle.execute(
              sql`UPDATE products SET meta_canonical_url = ${canonicalUrl}
                  WHERE id IN (SELECT product_id FROM products_child_products WHERE _parent_id = ${doc.id})
                    AND (meta_canonical_url IS NULL OR meta_canonical_url = '')`
            )
          }
        } catch (e) {
          // Silently fail — canonical is optional
        }
        // Index product in Meilisearch
        if (operation === 'create' || operation === 'update') {
          indexProduct(doc).catch((err: any) =>
            console.error('Failed to index product in Meilisearch:', err)
          )
        }
      },
      notifyEditionSubscribers,
    ],
    afterDelete: [
      async ({ doc }) => {
        deleteProductFromIndex(doc.id).catch((err: any) =>
          console.error('Failed to delete product from Meilisearch:', err)
        )
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Core tabs (always visible)
        basicInfoTab,
        pricesTab,
        stockTab,
        shippingTab,
        mediaTab,

        // Single tab for all product-type-specific config (conditionally shows content)
        typeConfigTab,

        // Feature-gated tabs
        ...b2bTabs,

        // Universal tabs
        seoTab,
        specificationsTab,
        relatedTab,
      ],
    },
  ],
}

export default Products
