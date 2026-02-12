/**
 * @payload-shop/cart
 * Cart module - Shopping cart with B2B/B2C support
 */

import type { ModuleDefinition } from '@payload-shop/types'
import { Carts } from './collections'

export * from './collections'

export const CartModule: ModuleDefinition = {
  id: 'cart',
  name: 'Cart',
  description: 'Shopping cart with B2B/B2C support, quotes, and saved carts',
  version: '1.0.0',
  dependencies: ['catalog', 'accounts'],

  backend: {
    collections: [Carts],
    endpoints: [
      {
        path: '/cart',
        method: 'GET',
        handler: 'getCart',
        description: 'Get current cart (guest or customer)',
      },
      {
        path: '/cart/add',
        method: 'POST',
        handler: 'addToCart',
        description: 'Add item to cart',
      },
      {
        path: '/cart/update',
        method: 'PUT',
        handler: 'updateCartItem',
        description: 'Update cart item quantity',
      },
      {
        path: '/cart/remove/:itemId',
        method: 'DELETE',
        handler: 'removeFromCart',
        description: 'Remove item from cart',
      },
      {
        path: '/cart/clear',
        method: 'DELETE',
        handler: 'clearCart',
        description: 'Clear entire cart',
      },
      {
        path: '/cart/merge',
        method: 'POST',
        handler: 'mergeGuestCart',
        description: 'Merge guest cart with customer cart on login',
      },
      {
        path: '/cart/quote',
        method: 'POST',
        handler: 'convertToQuote',
        description: 'Convert cart to quote (B2B)',
      },
      {
        path: '/cart/apply-coupon',
        method: 'POST',
        handler: 'applyCoupon',
        description: 'Apply coupon code',
      },
    ],
  },

  frontend: {
    components: {
      CartDrawer: {
        path: './components/CartDrawer',
        description: 'Slide-out cart drawer',
      },
      CartIcon: {
        path: './components/CartIcon',
        description: 'Cart icon with item count badge',
      },
      CartItem: {
        path: './components/CartItem',
        description: 'Single cart item component',
      },
    },
    pages: {
      '/cart': {
        component: 'CartPage',
        layout: 'default',
      },
    },
  },

  config: {
    schema: {
      enableGuestCheckout: {
        type: 'boolean',
        label: 'Gastbestellingen Toestaan',
        defaultValue: true,
      },
      cartExpiration: {
        type: 'number',
        label: 'Winkelwagen Vervaltijd (dagen)',
        defaultValue: 30,
      },
      enableQuotes: {
        type: 'boolean',
        label: 'Offertes Inschakelen (B2B)',
        defaultValue: true,
      },
      enableSavedCarts: {
        type: 'boolean',
        label: 'Opslaan Winkelwagen Toestaan',
        defaultValue: true,
      },
      minOrderAmount: {
        type: 'number',
        label: 'Minimum Bestelbedrag',
        defaultValue: 0,
      },
    },
    defaults: {
      enableGuestCheckout: true,
      cartExpiration: 30,
      enableQuotes: true,
      enableSavedCarts: true,
      minOrderAmount: 0,
    },
  },
}
