import type { CollectionConfig } from 'payload'

/**
 * Product Reviews Collection
 * Customer reviews and ratings for products
 */
export const ProductReviews: CollectionConfig = {
  slug: 'product-reviews',
  labels: {
    singular: 'Product Review',
    plural: 'Product Reviews',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'author', 'rating', 'status', 'createdAt'],
    group: 'Catalog',
    description: 'Beheer product reviews en ratings',
  },
  access: {
    read: () => true,
    create: () => true, // Public can submit
    update: ({ req: { user } }) => !!user, // Only admins can update
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
      admin: {
        description: 'Product dat wordt gereviewed',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Naam',
          admin: {
            width: '50%',
            description: 'Naam van de reviewer',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          admin: {
            width: '50%',
            description: 'Voor verificatie (niet publiek)',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          label: 'Rating',
          admin: {
            width: '33%',
            description: '1-5 sterren',
          },
        },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
          label: 'Geverifieerde Aankoop',
          admin: {
            width: '33%',
            description: 'Is dit een geverifieerde aankoop?',
          },
        },
        {
          name: 'helpful',
          type: 'number',
          defaultValue: 0,
          min: 0,
          label: 'Helpfulness Score',
          admin: {
            width: '34%',
            description: 'Aantal "helpful" votes',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Review Titel',
      admin: {
        description: 'Korte samenvatting (optioneel)',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Review Tekst',
      admin: {
        description: 'Volledige review',
      },
    },
    {
      name: 'pros',
      type: 'array',
      label: 'Voordelen',
      admin: {
        description: 'Positieve punten',
      },
      fields: [
        {
          name: 'pro',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'cons',
      type: 'array',
      label: 'Nadelen',
      admin: {
        description: 'Negatieve punten',
      },
      fields: [
        {
          name: 'con',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Review Afbeeldingen',
      maxRows: 5,
      admin: {
        description: 'Foto\'s toegevoegd door reviewer',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'In Afwachting', value: 'pending' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgekeurd', value: 'rejected' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        description: 'Moderatie status',
      },
    },
    {
      type: 'collapsible',
      label: 'Admin Notities',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'moderatorNotes',
          type: 'textarea',
          label: 'Moderator Notities',
          admin: {
            description: 'Interne notities (niet publiek)',
          },
        },
        {
          name: 'reportedCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
          label: 'Aantal Rapportages',
          admin: {
            description: 'Hoeveel keer is deze review gerapporteerd',
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // When a review is approved, update product's review stats
        if (doc.status === 'approved' && operation === 'update') {
          // This would trigger recalculation of product's average rating
          console.log(`Review approved for product ${doc.product}`)
        }
      },
    ],
  },
  timestamps: true,
}
