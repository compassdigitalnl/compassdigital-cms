/**
 * @payload-shop/accounts
 * Accounts module - Customers, Groups, Addresses
 */

import type { ModuleDefinition } from '@payload-shop/types'
import { Customers, CustomerGroups, Addresses } from './collections'

// Export collections
export * from './collections'

/**
 * Accounts Module Definition
 * Customer management with B2B/B2C support
 */
export const AccountsModule: ModuleDefinition = {
  id: 'accounts',
  name: 'Accounts',
  description: 'Customer management with B2B/B2C support, groups, and addresses',
  version: '1.0.0',
  dependencies: ['core'],

  backend: {
    collections: [Customers, CustomerGroups, Addresses],
    endpoints: [
      {
        path: '/customers/register',
        method: 'POST',
        handler: 'registerCustomer',
        description: 'Customer registration (B2C/B2B)',
        auth: false,
      },
      {
        path: '/customers/:id/approve',
        method: 'POST',
        handler: 'approveCustomer',
        description: 'Approve B2B customer (admin only)',
        auth: true,
      },
      {
        path: '/customers/:id/addresses',
        method: 'GET',
        handler: 'getCustomerAddresses',
        description: 'Get customer addresses',
        auth: true,
      },
      {
        path: '/customer-groups/public',
        method: 'GET',
        handler: 'getPublicGroups',
        description: 'Get customer groups for registration',
        auth: false,
      },
    ],
  },

  frontend: {
    components: {
      // Account components would go here
    },
    pages: {
      '/account': {
        component: 'AccountDashboard',
        layout: 'account',
      },
      '/account/orders': {
        component: 'OrderHistory',
        layout: 'account',
      },
      '/account/addresses': {
        component: 'AddressManagement',
        layout: 'account',
      },
      '/account/settings': {
        component: 'AccountSettings',
        layout: 'account',
      },
      '/register': {
        component: 'Registration',
        layout: 'auth',
      },
      '/login': {
        component: 'Login',
        layout: 'auth',
      },
    },
  },

  config: {
    schema: {
      requireApproval: {
        type: 'boolean',
        label: 'B2B Goedkeuring Vereist',
        description: 'Nieuwe B2B klanten vereisen admin goedkeuring',
        required: false,
        defaultValue: true,
      },
      allowB2CRegistration: {
        type: 'boolean',
        label: 'B2C Registratie Toegestaan',
        required: false,
        defaultValue: true,
      },
      allowB2BRegistration: {
        type: 'boolean',
        label: 'B2B Registratie Toegestaan',
        required: false,
        defaultValue: true,
      },
      defaultCustomerGroup: {
        type: 'string',
        label: 'Standaard Klantengroep',
        description: 'Slug van standaard klantengroep',
        required: false,
      },
      requireVATValidation: {
        type: 'boolean',
        label: 'BTW Validatie Vereist',
        description: 'Valideer BTW nummer bij B2B registratie',
        required: false,
        defaultValue: false,
      },
    },
    defaults: {
      requireApproval: true,
      allowB2CRegistration: true,
      allowB2BRegistration: true,
      requireVATValidation: false,
    },
  },
}
