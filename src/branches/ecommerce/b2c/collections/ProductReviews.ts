import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

/**
 * ProductReviews Collection (Feature #32 + #43)
 *
 * Customer reviews and ratings for products with AI moderation.
 *
 * Features:
 * - Star ratings (1-5)
 * - Review text with AI moderation
 * - Author information (linked to user or guest)
 * - Moderation status (pending/approved/rejected/flagged)
 * - AI analysis (sentiment, toxicity score, topics)
 * - Helpful votes
 * - Verified purchase badge
 * - Seller/admin response
 */
export const ProductReviews: CollectionConfig = {
  slug: 'product-reviews',
  labels: {
    singular: 'Product Review',
    plural: 'Product Reviews',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['product', 'authorName', 'rating', 'status', 'aiScore', 'createdAt'],
    description: 'Klantbeoordelingen voor producten met AI-moderatie',
    hidden: shouldHideCollection('productReviews'),
  },
  access: {
    // Public: only approved reviews; Admins: all
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      return { status: { equals: 'approved' } }
    },
    // Anyone can submit a review
    create: () => true,
    // Admins/editors can moderate
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    // Only admins can delete
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // === Product Relationship ===
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
      admin: {
        position: 'sidebar',
      },
    },

    // === Review Content ===
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      maxLength: 120,
      admin: {
        placeholder: 'Bijv: Uitstekend product, snel geleverd',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Beoordeling',
      admin: {
        position: 'sidebar',
        description: '1-5 sterren',
        step: 1,
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Review Tekst',
      maxLength: 2000,
      admin: {
        rows: 6,
      },
    },

    // === Author Information ===
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Gebruiker',
      admin: {
        position: 'sidebar',
        description: 'Ingelogde gebruiker (optioneel voor gastreviews)',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Naam Auteur',
    },
    {
      name: 'authorEmail',
      type: 'email',
      label: 'E-mail Auteur',
      admin: {
        description: 'Voor verificatie (niet publiek)',
      },
    },
    {
      name: 'authorInitials',
      type: 'text',
      label: 'Initialen',
      maxLength: 3,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.authorName) {
              const words = data.authorName.split(' ')
              return words
                .slice(0, 2)
                .map((w: string) => w[0])
                .join('')
                .toUpperCase()
            }
            return value
          },
        ],
      },
    },

    // === Moderation ===
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'In afwachting', value: 'pending' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgewezen', value: 'rejected' },
        { label: 'Gemarkeerd', value: 'flagged' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isVerifiedPurchase',
      type: 'checkbox',
      label: 'Geverifieerde Aankoop',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'moderationNotes',
      type: 'textarea',
      label: 'Moderatie Notities',
      admin: {
        description: 'Interne notities (niet publiek)',
      },
    },

    // === AI Analysis ===
    {
      name: 'ai',
      type: 'group',
      label: 'AI Analyse',
      admin: {
        description: 'Automatische analyse door AI-moderatie',
      },
      fields: [
        {
          name: 'moderated',
          type: 'checkbox',
          label: 'AI Gemodereerd',
          defaultValue: false,
        },
        {
          name: 'score',
          type: 'number',
          label: 'AI Score',
          min: 0,
          max: 100,
          admin: {
            description: '0=afwijzen, 100=perfect. Auto-approve boven 70.',
          },
        },
        {
          name: 'sentiment',
          type: 'select',
          label: 'Sentiment',
          options: [
            { label: 'Positief', value: 'positive' },
            { label: 'Neutraal', value: 'neutral' },
            { label: 'Negatief', value: 'negative' },
          ],
        },
        {
          name: 'topics',
          type: 'json',
          label: 'Onderwerpen',
          admin: {
            description: 'Gedetecteerde onderwerpen (bijv. kwaliteit, levering, prijs)',
          },
        },
        {
          name: 'toxicity',
          type: 'number',
          label: 'Toxiciteit',
          min: 0,
          max: 100,
          admin: {
            description: '0=veilig, 100=zeer toxisch',
          },
        },
        {
          name: 'isFake',
          type: 'checkbox',
          label: 'Verdacht (Fake)',
          defaultValue: false,
        },
        {
          name: 'summary',
          type: 'text',
          label: 'AI Samenvatting',
          admin: {
            description: 'Korte samenvatting van de AI-analyse',
          },
        },
      ],
    },

    // === Engagement ===
    {
      name: 'helpfulYes',
      type: 'number',
      label: '"Nuttig" stemmen',
      defaultValue: 0,
    },
    {
      name: 'helpfulNo',
      type: 'number',
      label: '"Niet nuttig" stemmen',
      defaultValue: 0,
    },

    // === Seller Response ===
    {
      name: 'response',
      type: 'group',
      label: 'Reactie Verkoper',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Reactie',
          admin: { rows: 4 },
        },
        {
          name: 'respondedAt',
          type: 'date',
          label: 'Reactie Datum',
        },
      ],
    },
  ],
  hooks: {
    // After a review is created/updated with approved status, update product rating
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' || doc.status === 'approved') {
          try {
            const productId = typeof doc.product === 'object' ? doc.product.id : doc.product
            const reviews = await req.payload.find({
              collection: 'product-reviews',
              where: {
                product: { equals: productId },
                status: { equals: 'approved' },
              },
              limit: 10000,
            })

            if (reviews.docs.length > 0) {
              const totalRating = reviews.docs.reduce((sum, r) => sum + r.rating, 0)
              const averageRating = Math.round((totalRating / reviews.docs.length) * 10) / 10

              await req.payload.update({
                collection: 'products',
                id: productId,
                data: {
                  reviewCount: reviews.docs.length,
                  reviewAverage: averageRating,
                },
              })
            }
          } catch (error) {
            console.error('[ProductReviews] Error updating product rating:', error)
          }
        }
      },
    ],
  },
}

export default ProductReviews
