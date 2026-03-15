import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
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
  multistoreHubTab,
  multistoreChildTab,
  seoTab,
  specificationsTab,
  relatedTab,
} from './tabs'
import { multistoreProductSyncHook } from '@/features/multistore/hooks/multistoreProductSyncHook'
import { multistoreChildProductHook } from '@/features/multistore/hooks/multistoreChildProductHook'
import { multistoreStockHook } from '@/features/multistore/hooks/multistoreStockHook'
import { multistoreProductDeleteHook } from '@/features/multistore/hooks/multistoreProductDeleteHook'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Producten',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Webshop',
    defaultColumns: ['title', 'sku', 'ean', 'price', 'stock', 'status', 'productType', 'updatedAt'],
    hidden: shouldHideCollection('shop'),
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Auto-fill canonical URL for child products of grouped products
        try {
          const { sql } = await import('drizzle-orm')
          if (doc.productType === 'simple' && !doc.meta?.canonicalUrl) {
            // Simple product saved — check if it belongs to a grouped parent
            const parentResult: any = await (req.payload.db as any).drizzle.execute(
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
              await (req.payload.db as any).drizzle.execute(
                sql`UPDATE products SET meta_canonical_url = ${canonicalUrl} WHERE id = ${doc.id}`
              )
            }
          } else if (doc.productType === 'grouped') {
            // Grouped product saved — auto-fill canonical for all its children
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
            const canonicalUrl = `${baseUrl}/${doc.slug}`
            await (req.payload.db as any).drizzle.execute(
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
          indexProduct(doc).catch((err: unknown) =>
            console.error('Failed to index product in Meilisearch:', err)
          )
        }
      },
      notifyEditionSubscribers,
      multistoreProductSyncHook,
      multistoreChildProductHook,
      multistoreStockHook,
    ],
    afterDelete: [
      async ({ doc }) => {
        deleteProductFromIndex(doc.id).catch((err: unknown) =>
          console.error('Failed to delete product from Meilisearch:', err)
        )
      },
      multistoreProductDeleteHook,
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
        ...multistoreHubTab,
        ...multistoreChildTab,

        // Universal tabs
        seoTab,
        specificationsTab,
        relatedTab,
      ],
    },

    // Review aggregates (auto-updated by ProductReviews afterChange hook)
    {
      name: 'reviewCount',
      type: 'number',
      label: 'Aantal Reviews',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatisch bijgewerkt',
      },
    },
    {
      name: 'reviewAverage',
      type: 'number',
      label: 'Gemiddelde Score',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Gemiddelde van goedgekeurde reviews',
      },
    },
  ],
}

export default Products
