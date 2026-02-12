/**
 * @payload-shop/pricing
 * Pricing module - Role-based and volume pricing calculations
 */

import type { ModuleDefinition } from '@payload-shop/types'

export * from './lib/calculatePrice'

export const PricingModule: ModuleDefinition = {
  id: 'pricing',
  name: 'Pricing',
  description: 'Dynamic pricing with role-based, volume, and customer-specific discounts',
  version: '1.0.0',
  dependencies: ['catalog', 'accounts'],

  backend: {
    collections: [], // No collections, only logic/endpoints
    endpoints: [
      {
        path: '/pricing/calculate',
        method: 'POST',
        handler: 'calculateProductPrice',
        description: 'Calculate price for product with customer context',
        auth: false, // Public for pricing display
      },
      {
        path: '/pricing/cart-total',
        method: 'POST',
        handler: 'calculateCartTotal',
        description: 'Calculate cart total with all discounts',
      },
      {
        path: '/pricing/volume-tiers/:productId',
        method: 'GET',
        handler: 'getVolumeTiers',
        description: 'Get volume pricing tiers for product',
      },
      {
        path: '/pricing/customer-price/:productId',
        method: 'GET',
        handler: 'getCustomerPrice',
        description: 'Get customer-specific price',
        auth: true,
      },
    ],
  },

  frontend: {
    components: {
      PriceDisplay: {
        path: './components/PriceDisplay',
        description: 'Dynamic price display with role-based pricing',
      },
      VolumePricingTable: {
        path: './components/VolumePricingTable',
        description: 'Volume pricing tier table',
      },
      DiscountBadge: {
        path: './components/DiscountBadge',
        description: 'Discount percentage badge',
      },
    },
  },

  config: {
    schema: {
      showPricesPublic: {
        type: 'boolean',
        label: 'Prijzen Publiek Tonen',
        description: 'Toon prijzen zonder login (B2C)',
        defaultValue: true,
      },
      requireLoginForPrices: {
        type: 'boolean',
        label: 'Login Vereist voor Prijzen',
        description: 'Verberg prijzen voor niet-ingelogde gebruikers (B2B)',
        defaultValue: false,
      },
      showDiscountPercentage: {
        type: 'boolean',
        label: 'Kortingspercentage Tonen',
        defaultValue: true,
      },
      showVolumeDiscounts: {
        type: 'boolean',
        label: 'Volume Kortingen Tonen',
        defaultValue: true,
      },
      pricePrecision: {
        type: 'number',
        label: 'Prijs Precisie (decimalen)',
        defaultValue: 2,
      },
    },
    defaults: {
      showPricesPublic: true,
      requireLoginForPrices: false,
      showDiscountPercentage: true,
      showVolumeDiscounts: true,
      pricePrecision: 2,
    },
  },
}
