import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'
import { indexProduct, deleteProductFromIndex } from '@/lib/meilisearch/indexProducts'
import { notifyEditionSubscribers } from '../../hooks/notifyEditionSubscribers'

import {
  basicInfoTab,
  pricesTab,
  stockTab,
  shippingTab,
  mediaTab,
  groupedTab,
  variableProductTabs,
  bundleProductTabs,
  mixAndMatchTabs,
  bookableProductTabs,
  configuratorProductTabs,
  personalizedProductTabs,
  subscriptionProductTabs,
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
      async ({ doc, operation }) => {
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

        // Product-type-specific tabs
        groupedTab,
        ...variableProductTabs,
        ...bundleProductTabs,
        ...mixAndMatchTabs,
        ...bookableProductTabs,
        ...configuratorProductTabs,
        ...personalizedProductTabs,
        ...subscriptionProductTabs,

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
