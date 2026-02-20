import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { features } from '@/lib/features'

/**
 * VendorReviews Collection (Sprint 5 - Marketplace)
 *
 * Customer reviews and ratings for vendors
 *
 * Features:
 * - Star ratings (1-5)
 * - Review text
 * - Author information
 * - Moderation (approved/pending)
 * - Helpful votes
 */
export const VendorReviews: CollectionConfig = {
  slug: 'vendor-reviews',
  labels: {
    singular: 'Vendor Review',
    plural: 'Vendor Reviews',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Marketplace',
    defaultColumns: ['vendor', 'authorName', 'rating', 'isApproved', 'createdAt'],
    description: 'Klantbeoordelingen voor leveranciers',
    // Hide if feature disabled
    hidden: !features.vendorReviews,
  },
  access: {
    read: () => true, // Publicly accessible (only approved reviews)
    create: () => true, // Anyone can submit a review
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // === Vendor Relationship ===
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      required: true,
      label: 'Leverancier',
      admin: {
        position: 'sidebar',
        description: 'Voor welke leverancier is deze review?',
      },
    },

    // === Review Content ===
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      maxLength: 100,
      admin: {
        description: 'Korte titel voor de review',
        placeholder: 'Bijv: Uitstekende service en kwaliteit',
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
        description: '1-5 sterren',
        step: 1,
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Review Tekst',
      maxLength: 1000,
      admin: {
        description: 'De volledige review tekst (max 1000 tekens)',
        rows: 6,
      },
    },

    // === Author Information ===
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Naam Auteur',
      admin: {
        description: 'Naam van de reviewer',
      },
    },
    {
      name: 'authorEmail',
      type: 'email',
      label: 'E-mail Auteur',
      admin: {
        description: 'Voor verificatie (niet publiek zichtbaar)',
      },
    },
    {
      name: 'authorCompany',
      type: 'text',
      label: 'Bedrijf',
      admin: {
        description: 'Optioneel: bedrijfsnaam van de reviewer',
      },
    },
    {
      name: 'authorInitials',
      type: 'text',
      label: 'Initialen',
      maxLength: 3,
      admin: {
        description: 'Voor avatar display (automatisch gegenereerd uit naam)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.authorName) {
              // Extract initials from name (e.g., "Jan Jansen" -> "JJ")
              const words = data.authorName.split(' ')
              return words
                .slice(0, 2)
                .map((w) => w[0])
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
      name: 'isApproved',
      type: 'checkbox',
      label: 'Goedgekeurd',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Alleen goedgekeurde reviews zijn publiek zichtbaar',
      },
    },
    {
      name: 'isVerifiedPurchase',
      type: 'checkbox',
      label: 'Geverifieerde Aankoop',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Reviewer heeft daadwerkelijk bij deze vendor gekocht',
      },
    },
    {
      name: 'moderationNotes',
      type: 'textarea',
      label: 'Moderatie Notities',
      admin: {
        description: 'Interne notities (niet publiek)',
        condition: (data) => !data.isApproved,
      },
    },

    // === Engagement ===
    {
      name: 'helpfulCount',
      type: 'number',
      label: 'Aantal "Nuttig" stemmen',
      defaultValue: 0,
      admin: {
        description: 'Hoeveel mensen vonden deze review nuttig',
      },
    },

    // === Vendor Response (Optional) ===
    {
      name: 'vendorResponse',
      type: 'group',
      label: 'Reactie Leverancier',
      admin: {
        description: 'Optionele reactie van de leverancier',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Reactie',
          admin: {
            rows: 4,
          },
        },
        {
          name: 'respondedAt',
          type: 'date',
          label: 'Reactie Datum',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },

    // === Metadata ===
    {
      name: 'reviewDate',
      type: 'date',
      label: 'Review Datum',
      admin: {
        position: 'sidebar',
        description: 'Datum wanneer review is geschreven',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            // Auto-set to today if not provided
            return value || new Date().toISOString()
          },
        ],
      },
    },
  ],
  hooks: {
    // After a review is created/updated, update vendor rating
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only recalculate if approved status changed or new review
        if (operation === 'create' || doc.isApproved) {
          try {
            // Get all approved reviews for this vendor
            const reviews = await req.payload.find({
              collection: 'vendor-reviews',
              where: {
                vendor: {
                  equals: doc.vendor,
                },
                isApproved: {
                  equals: true,
                },
              },
              limit: 1000, // Adjust if needed
            })

            if (reviews.docs.length > 0) {
              // Calculate average rating
              const totalRating = reviews.docs.reduce((sum, review) => sum + review.rating, 0)
              const averageRating = totalRating / reviews.docs.length

              // Update vendor stats
              await req.payload.update({
                collection: 'vendors',
                id: typeof doc.vendor === 'string' ? doc.vendor : doc.vendor.id,
                data: {
                  stats: {
                    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                    reviewCount: reviews.docs.length,
                  },
                },
              })
            }
          } catch (error) {
            console.error('Error updating vendor rating:', error)
          }
        }
      },
    ],
  },
}
