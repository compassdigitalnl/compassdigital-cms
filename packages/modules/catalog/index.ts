/**
 * @payload-shop/catalog
 * Complete product catalog module with 63+ fields
 */

import type { ModuleDefinition } from '@payload-shop/types'
import { Products, ProductCategories, ProductCollections, ProductReviews } from './collections'

// Export collections
export * from './collections'

// Export components
export * from './components'

/**
 * Catalog Module Definition
 * Backend (Payload collections) + Frontend (React components)
 */
export const CatalogModule: ModuleDefinition = {
  id: 'catalog',
  name: 'Product Catalog',
  description: 'Enterprise product catalog with 63+ fields, B2B/B2C/Hybrid support',
  version: '1.0.0',
  dependencies: [],

  backend: {
    collections: [Products, ProductCategories, ProductCollections, ProductReviews],
    endpoints: [
      {
        path: '/products/search',
        method: 'GET',
        handler: 'searchProducts',
        description: 'Full-text product search',
      },
      {
        path: '/products/filters',
        method: 'GET',
        handler: 'getProductFilters',
        description: 'Get available filter options',
      },
      {
        path: '/products/:slug',
        method: 'GET',
        handler: 'getProductBySlug',
        description: 'Get product by slug',
      },
      {
        path: '/products/:id/reviews',
        method: 'GET',
        handler: 'getProductReviews',
        description: 'Get product reviews',
      },
      {
        path: '/products/:id/reviews',
        method: 'POST',
        handler: 'submitProductReview',
        description: 'Submit product review',
        auth: false,
      },
    ],
  },

  frontend: {
    components: {
      ProductCard: {
        path: './components/ProductCard',
        description: 'Product card component (grid/list layout)',
        props: {
          product: 'Partial<Product>',
          layout: '"grid" | "list"',
          onAddToCart: '(product: Product) => void',
        },
      },
      ProductGrid: {
        path: './components/ProductGrid',
        description: 'Responsive product grid with 2-6 columns',
        props: {
          products: 'Partial<Product>[]',
          columns: '2 | 3 | 4 | 5 | 6',
          layout: '"grid" | "list"',
        },
      },
      ProductFilters: {
        path: './components/ProductFilters',
        description: 'Sidebar filter panel (categories, brands, price, attributes)',
        props: {
          categories: 'ProductCategory[]',
          brands: 'FilterOption[]',
          onFilterChange: '(filters: Record<string, string[]>) => void',
        },
      },
    },
    pages: {
      '/products': {
        component: 'ProductArchive',
        layout: 'shop',
      },
      '/products/[slug]': {
        component: 'ProductDetail',
        layout: 'shop',
      },
      '/categories/[slug]': {
        component: 'CategoryArchive',
        layout: 'shop',
      },
      '/collections/[slug]': {
        component: 'CollectionArchive',
        layout: 'shop',
      },
    },
  },

  config: {
    schema: {
      enableReviews: {
        type: 'boolean',
        label: 'Reviews Inschakelen',
        description: 'Klanten kunnen reviews plaatsen',
        required: false,
        defaultValue: true,
      },
      moderateReviews: {
        type: 'boolean',
        label: 'Reviews Modereren',
        description: 'Reviews vereisen goedkeuring',
        required: false,
        defaultValue: true,
      },
      enableWishlist: {
        type: 'boolean',
        label: 'Verlanglijst Inschakelen',
        required: false,
        defaultValue: true,
      },
      enableCompare: {
        type: 'boolean',
        label: 'Vergelijken Inschakelen',
        required: false,
        defaultValue: true,
      },
      productsPerPage: {
        type: 'number',
        label: 'Producten per Pagina',
        required: false,
        defaultValue: 24,
      },
    },
    defaults: {
      enableReviews: true,
      moderateReviews: true,
      enableWishlist: true,
      enableCompare: true,
      productsPerPage: 24,
    },
  },
}
