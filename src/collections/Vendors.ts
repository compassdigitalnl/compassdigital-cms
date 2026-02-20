import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'
import { features } from '@/lib/features'

/**
 * Vendors Collection (Sprint 5 - Marketplace)
 *
 * Represents suppliers, manufacturers, or service providers
 * Used for multi-vendor marketplaces like Plastimed
 *
 * Features:
 * - Vendor profile pages
 * - Product associations
 * - Ratings and reviews
 * - Contact information
 * - Categories and certifications
 * - Premium/Featured vendors
 */
export const Vendors: CollectionConfig = {
  slug: 'vendors',
  labels: {
    singular: 'Leverancier',
    plural: 'Leveranciers',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Marketplace',
    defaultColumns: ['name', 'isPremium', 'isVerified', 'rating', 'updatedAt'],
    description: 'Leveranciers, fabrikanten en partners',
    // Hide if feature disabled
    hidden: !features.vendors,
  },
  access: {
    read: () => true, // Publicly accessible
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // === Basic Information ===
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Bedrijfsnaam',
      admin: {
        description: 'Bijv: Paul Hartmann AG, Becton Dickinson, 3M',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gegenereerd uit de naam',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.name && !value) {
              return data.name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'shortName',
      type: 'text',
      label: 'Korte naam',
      admin: {
        description: 'Korte naam voor logo (bijv: "Hartmann", "BD", "3M")',
        placeholder: 'Wordt getoond als logo tekst niet beschikbaar is',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      maxLength: 120,
      admin: {
        description: 'Korte beschrijvende tekst (max 120 tekens)',
        placeholder: 'Bijv: Marktleider in wondverzorging sinds 1818',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
      admin: {
        description: 'Uitgebreide beschrijving over de leverancier',
      },
    },

    // === Visual Identity ===
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description: 'Bedrijfslogo (voorkeur: SVG of PNG met transparante achtergrond)',
      },
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      label: 'Banner Image',
      admin: {
        description: 'Hero banner voor vendor detail pagina (1200x300px)',
      },
    },
    {
      name: 'bannerColor',
      type: 'text',
      label: 'Banner Achtergrondkleur',
      admin: {
        description: 'Hex kleurcode voor banner gradient (bijv: #0A1628)',
        placeholder: '#0A1628',
      },
    },

    // === Status & Classification ===
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Geverifieerd',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon "Geverifieerd" badge',
      },
    },
    {
      name: 'isPremium',
      type: 'checkbox',
      label: 'Premium Partner',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Premium partners worden uitgelicht',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon in "Uitgelichte partners" sectie',
      },
    },

    // === Contact Information ===
    {
      name: 'contact',
      type: 'group',
      label: 'Contactgegevens',
      fields: [
        {
          name: 'website',
          type: 'text',
          label: 'Website URL',
          admin: {
            placeholder: 'https://www.example.com',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-mailadres',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefoonnummer',
          admin: {
            placeholder: '+31 20 123 4567',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Adres',
          admin: {
            rows: 3,
          },
        },
        {
          name: 'country',
          type: 'text',
          label: 'Land',
          admin: {
            placeholder: 'Nederland',
          },
        },
      ],
    },

    // === Statistics & Metrics ===
    {
      name: 'stats',
      type: 'group',
      label: 'Statistieken',
      admin: {
        description: 'Automatisch berekende statistieken (handmatig overschrijfbaar)',
      },
      fields: [
        {
          name: 'productCount',
          type: 'number',
          label: 'Aantal Producten',
          admin: {
            description: 'Wordt automatisch geteld uit Products met deze vendor',
          },
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Gemiddelde Beoordeling',
          min: 0,
          max: 5,
          admin: {
            step: 0.1,
            description: 'Gemiddelde rating (0-5 sterren)',
          },
        },
        {
          name: 'reviewCount',
          type: 'number',
          label: 'Aantal Reviews',
          admin: {
            description: 'Totaal aantal reviews',
          },
        },
        {
          name: 'establishedYear',
          type: 'number',
          label: 'Opgericht in',
          admin: {
            placeholder: '1818',
            description: 'Bijv: 1818',
          },
        },
      ],
    },

    // === Categories & Certifications ===
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: 'Productcategorieën',
      admin: {
        description: 'In welke categorieën is deze leverancier actief?',
      },
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Certificeringen',
      admin: {
        description: 'Certificaten en keurmerken (CE, ISO, etc.)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Naam',
          admin: {
            placeholder: 'CE Gecertificeerd',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icoon',
          options: [
            { label: 'Shield Check', value: 'shield-check' },
            { label: 'Award', value: 'award' },
            { label: 'Leaf (Duurzaam)', value: 'leaf' },
            { label: 'Star', value: 'star' },
            { label: 'Check Circle', value: 'check-circle' },
          ],
        },
      ],
    },

    // === Delivery & Service ===
    {
      name: 'delivery',
      type: 'group',
      label: 'Levering & Service',
      fields: [
        {
          name: 'deliveryTime',
          type: 'text',
          label: 'Levertijd',
          admin: {
            placeholder: '1-2 werkdagen',
          },
        },
        {
          name: 'freeShippingFrom',
          type: 'number',
          label: 'Gratis verzending vanaf',
          admin: {
            description: 'Bedrag in euro (bijv: 50)',
            placeholder: '50',
          },
        },
        {
          name: 'offersWorkshops',
          type: 'checkbox',
          label: 'Biedt workshops aan',
          defaultValue: false,
          admin: {
            description: 'Deze leverancier biedt trainingen/workshops aan',
          },
        },
      ],
    },

    // === Related Content ===
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Featured Producten',
      admin: {
        description: 'Handmatig geselecteerde uitgelichte producten (max 6)',
      },
      filterOptions: {
        // Could filter by vendor if Products has vendor field
      },
    },

    // === Ordering ===
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Sorteer volgorde (lager = eerder getoond)',
      },
    },

    // === SEO ===
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'SEO titel voor de vendor pagina',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Beschrijving',
          maxLength: 160,
          admin: {
            description: 'Korte beschrijving voor zoekmachines (max 160 tekens)',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },
  ],
}
