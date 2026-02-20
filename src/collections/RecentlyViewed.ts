import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const RecentlyViewed: CollectionConfig = {
  slug: 'recently-viewed',
  labels: {
    singular: 'Recent Bekeken',
    plural: 'Recent Bekeken',
  },
  admin: {
    useAsTitle: 'product',
    group: 'E-commerce',
    defaultColumns: ['user', 'product', 'viewedAt'],
    description: 'Recent bekeken producten tracking voor gepersonaliseerde aanbevelingen',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, users can only read their own views
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Anyone can create views (including anonymous users via API)
    update: () => false, // Views are immutable once created
    delete: ({ req: { user } }) => {
      // Users can delete their own history, admins can delete all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Gebruiker',
      admin: {
        position: 'sidebar',
        description: 'Optioneel: null voor anonymous users (tracking via cookie/session)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Sessie ID',
      admin: {
        description: 'Voor anonymous users: track via session/cookie ID',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'viewedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Bekeken op',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // Product Snapshot (for display if product is deleted)
    {
      name: 'productSnapshot',
      type: 'group',
      label: 'Product Snapshot',
      admin: {
        description: 'Snapshot voor weergave indien product verwijderd wordt',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Product Naam',
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Prijs (€)',
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Afbeelding URL',
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Merk',
        },
      ],
    },
    // Viewing Context
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer',
      admin: {
        description: 'Vorige pagina / hoe kwam gebruiker bij dit product',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      options: [
        { label: 'Directe weergave', value: 'direct' },
        { label: 'Zoekresultaten', value: 'search' },
        { label: 'Categoriepagina', value: 'category' },
        { label: 'Gerelateerde producten', value: 'related' },
        { label: 'Recent bekeken carousel', value: 'recently_viewed' },
        { label: 'Aanbevelingen', value: 'recommendations' },
        { label: 'Externe link', value: 'external' },
      ],
      admin: {
        description: 'Waar kwam de gebruiker vandaan?',
      },
    },
    {
      name: 'device',
      type: 'select',
      label: 'Apparaat',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
      ],
      admin: {
        description: 'Type apparaat waarop product is bekeken',
      },
    },
    {
      name: 'timeOnPage',
      type: 'number',
      label: 'Tijd op pagina (seconden)',
      admin: {
        description: 'Hoelang gebruiker op productpagina heeft doorgebracht',
      },
    },
    {
      name: 'scrollDepth',
      type: 'number',
      label: 'Scroll diepte (%)',
      admin: {
        description: 'Hoeveel % van de pagina de gebruiker heeft gezien (0-100)',
      },
    },
    // Interaction Tracking
    {
      name: 'addedToCart',
      type: 'checkbox',
      defaultValue: false,
      label: 'Toegevoegd aan winkelwagen',
      admin: {
        description: 'Heeft gebruiker product aan winkelwagen toegevoegd tijdens deze view?',
      },
    },
    {
      name: 'addedToFavorites',
      type: 'checkbox',
      defaultValue: false,
      label: 'Toegevoegd aan favorieten',
      admin: {
        description: 'Heeft gebruiker product als favoriet gemarkeerd tijdens deze view?',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Clean up old views - keep only last 50 per user
        if (operation === 'create' && doc.user) {
          try {
            const { payload } = req

            // Get all views for this user, sorted by date
            const allViews = await payload.find({
              collection: 'recently-viewed',
              where: {
                user: {
                  equals: doc.user,
                },
              },
              sort: '-viewedAt',
              limit: 100,
            })

            // If more than 50 views, delete the oldest ones
            if (allViews.docs.length > 50) {
              const viewsToDelete = allViews.docs.slice(50)
              for (const view of viewsToDelete) {
                if (typeof view.id === 'string' || typeof view.id === 'number') {
                  await payload.delete({
                    collection: 'recently-viewed',
                    id: view.id,
                  })
                }
              }
            }
          } catch (error) {
            console.error('Error cleaning up old recently viewed items:', error)
          }
        }
      },
    ],
  },
}
