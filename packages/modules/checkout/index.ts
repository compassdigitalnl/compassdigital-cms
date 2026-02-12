/**
 * @payload-shop/checkout
 * Checkout module - Orders and payments
 */

import type { ModuleDefinition } from '@payload-shop/types'
import { Orders } from './collections'

export * from './collections'

export const CheckoutModule: ModuleDefinition = {
  id: 'checkout',
  name: 'Checkout',
  description: 'Order management and checkout with multiple payment providers',
  version: '1.0.0',
  dependencies: ['catalog', 'accounts', 'cart', 'pricing'],

  backend: {
    collections: [Orders],
    endpoints: [
      {
        path: '/checkout/create-order',
        method: 'POST',
        handler: 'createOrder',
        description: 'Create order from cart',
        auth: false, // Allow guest checkout
      },
      {
        path: '/checkout/payment/initialize',
        method: 'POST',
        handler: 'initializePayment',
        description: 'Initialize payment (Mollie/Stripe)',
      },
      {
        path: '/checkout/payment/webhook',
        method: 'POST',
        handler: 'paymentWebhook',
        description: 'Payment webhook callback',
        auth: false,
      },
      {
        path: '/checkout/payment/status/:orderId',
        method: 'GET',
        handler: 'getPaymentStatus',
        description: 'Get payment status',
      },
      {
        path: '/orders/:id/invoice',
        method: 'GET',
        handler: 'generateInvoice',
        description: 'Generate PDF invoice',
        auth: true,
      },
      {
        path: '/orders/:id/cancel',
        method: 'POST',
        handler: 'cancelOrder',
        description: 'Cancel order',
        auth: true,
      },
      {
        path: '/orders/:id/track',
        method: 'GET',
        handler: 'trackOrder',
        description: 'Get order tracking info',
      },
    ],
  },

  frontend: {
    components: {
      CheckoutForm: {
        path: './components/CheckoutForm',
        description: 'Multi-step checkout form',
      },
      OrderSummary: {
        path: './components/OrderSummary',
        description: 'Order summary component',
      },
      PaymentMethods: {
        path: './components/PaymentMethods',
        description: 'Payment method selector',
      },
      OrderConfirmation: {
        path: './components/OrderConfirmation',
        description: 'Order confirmation page',
      },
      OrderTracking: {
        path: './components/OrderTracking',
        description: 'Order tracking component',
      },
    },
    pages: {
      '/checkout': {
        component: 'CheckoutPage',
        layout: 'checkout',
      },
      '/checkout/success': {
        component: 'CheckoutSuccess',
        layout: 'minimal',
      },
      '/checkout/failed': {
        component: 'CheckoutFailed',
        layout: 'minimal',
      },
      '/orders/[id]': {
        component: 'OrderDetail',
        layout: 'account',
      },
    },
  },

  config: {
    schema: {
      enableGuestCheckout: {
        type: 'boolean',
        label: 'Gastcheckout Toestaan',
        defaultValue: true,
      },
      requireAccountForB2B: {
        type: 'boolean',
        label: 'Account Vereist voor B2B',
        description: 'B2B orders vereisen account',
        defaultValue: true,
      },
      orderNumberPrefix: {
        type: 'string',
        label: 'Bestelnummer Prefix',
        defaultValue: 'ORD',
      },
      sendOrderConfirmation: {
        type: 'boolean',
        label: 'Bevestigingsmail Versturen',
        defaultValue: true,
      },
      sendShippingNotification: {
        type: 'boolean',
        label: 'Verzendnotificatie Versturen',
        defaultValue: true,
      },
      enableInvoiceGeneration: {
        type: 'boolean',
        label: 'Factuur Generatie',
        defaultValue: true,
      },
      autoApproveOrders: {
        type: 'boolean',
        label: 'Orders Automatisch Goedkeuren',
        description: 'B2B orders kunnen goedkeuring vereisen',
        defaultValue: true,
      },
    },
    defaults: {
      enableGuestCheckout: true,
      requireAccountForB2B: true,
      orderNumberPrefix: 'ORD',
      sendOrderConfirmation: true,
      sendShippingNotification: true,
      enableInvoiceGeneration: true,
      autoApproveOrders: true,
    },
  },
}
