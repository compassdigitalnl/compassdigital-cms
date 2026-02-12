/**
 * @payload-shop/core
 * Core module - Users, Media, Pages, Navigation
 */

import type { ModuleDefinition } from '@payload-shop/types'
import { Users, Media, Pages, Navigation } from './collections'

// Export collections
export * from './collections'

/**
 * Core Module Definition
 * Essential CMS functionality (Users, Media, Pages, Navigation)
 */
export const CoreModule: ModuleDefinition = {
  id: 'core',
  name: 'Core',
  description: 'Essential CMS functionality - Users, Media, Pages, Navigation',
  version: '1.0.0',
  dependencies: [],

  backend: {
    collections: [Users, Media, Pages, Navigation],
    endpoints: [
      {
        path: '/pages/by-slug/:slug',
        method: 'GET',
        handler: 'getPageBySlug',
        description: 'Get page by slug',
      },
      {
        path: '/navigation/:location',
        method: 'GET',
        handler: 'getNavigationByLocation',
        description: 'Get navigation menu by location',
      },
    ],
  },

  frontend: {
    components: {
      // Page rendering components would go here
      // We'll implement these when building the generator
    },
    pages: {
      '/[slug]': {
        component: 'DynamicPage',
        layout: 'default',
      },
    },
  },

  config: {
    schema: {
      allowRegistration: {
        type: 'boolean',
        label: 'Open Registratie',
        description: 'Sta nieuwe gebruikers toe om te registreren',
        required: false,
        defaultValue: false,
      },
      requireEmailVerification: {
        type: 'boolean',
        label: 'E-mail Verificatie Vereist',
        required: false,
        defaultValue: true,
      },
      mediaStorageProvider: {
        type: 'select',
        label: 'Media Opslag',
        options: [
          { label: 'Local Filesystem', value: 'local' },
          { label: 'AWS S3', value: 's3' },
          { label: 'Cloudinary', value: 'cloudinary' },
        ],
        required: false,
        defaultValue: 'local',
      },
      maxUploadSize: {
        type: 'number',
        label: 'Max Upload Size (MB)',
        required: false,
        defaultValue: 10,
      },
    },
    defaults: {
      allowRegistration: false,
      requireEmailVerification: true,
      mediaStorageProvider: 'local',
      maxUploadSize: 10,
    },
  },
}
