import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Workshops Collection (Sprint 5 - Marketplace)
 *
 * Training sessions, webinars, and educational events
 * Often organized by vendors/suppliers
 *
 * Features:
 * - Workshop details (title, description, dates)
 * - Vendor association
 * - Registration/booking
 * - Location (physical/online)
 * - Pricing and capacity
 * - Skill level and categories
 */
export const Workshops: CollectionConfig = {
  slug: 'workshops',
  labels: {
    singular: 'Workshop',
    plural: 'Workshops',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Marketplace',
    defaultColumns: ['title', 'vendor', 'date', 'location', 'status', 'updatedAt'],
    description: 'Trainingen, workshops en webinars',
    hidden: shouldHideCollection('workshops'),
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Bijv: Wondverzorging Masterclass, Handhygiëne Training',
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
        description: 'Automatisch gegenereerd uit de titel',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.title && !value) {
              return data.title
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
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Beschrijving',
      admin: {
        description: 'Uitgebreide beschrijving van de workshop',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Korte Beschrijving',
      maxLength: 200,
      admin: {
        description: 'Korte samenvatting voor overzichten (max 200 tekens)',
        rows: 3,
      },
    },

    // === Visual ===
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Afbeelding',
      admin: {
        description: 'Workshop banner/afbeelding (1200x600px)',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      label: 'Emoji',
      maxLength: 2,
      admin: {
        description: 'Emoji voor visuele weergave (bijv: 🎓, 🏥, 🩺)',
        placeholder: '🎓',
      },
    },

    // === Vendor/Organizer ===
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      label: 'Organiserende Leverancier',
      admin: {
        description: 'Welke vendor organiseert deze workshop?',
      },
    },
    {
      name: 'instructor',
      type: 'text',
      label: 'Docent/Trainer',
      admin: {
        description: 'Naam van de trainer/instructeur',
        placeholder: 'Bijv: Dr. A. van den Berg',
      },
    },

    // === Scheduling ===
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
      admin: {
        description: 'Wanneer vindt de workshop plaats?',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duur (minuten)',
      admin: {
        description: 'Duur in minuten (bijv: 120 = 2 uur)',
        placeholder: '120',
      },
    },
    {
      name: 'durationDisplay',
      type: 'text',
      label: 'Duur Weergave',
      admin: {
        description: 'Menselijk leesbare duur (bijv: "2 uur", "halve dag")',
        placeholder: '2 uur',
      },
    },

    // === Location ===
    {
      name: 'locationType',
      type: 'select',
      required: true,
      label: 'Locatie Type',
      defaultValue: 'physical',
      options: [
        {
          label: 'Fysieke Locatie',
          value: 'physical',
        },
        {
          label: 'Online (Webinar)',
          value: 'online',
        },
        {
          label: 'Hybride',
          value: 'hybrid',
        },
      ],
    },
    {
      name: 'locationName',
      type: 'text',
      label: 'Locatie Naam',
      admin: {
        description: 'Naam van de locatie of platform',
        placeholder: 'Bijv: Hartmann Training Center, Microsoft Teams',
        condition: (data) => data.locationType !== 'online',
      },
    },
    {
      name: 'locationAddress',
      type: 'textarea',
      label: 'Adres',
      admin: {
        description: 'Volledig adres van fysieke locatie',
        rows: 3,
        condition: (data) => data.locationType === 'physical' || data.locationType === 'hybrid',
      },
    },
    {
      name: 'locationCity',
      type: 'text',
      label: 'Plaats',
      admin: {
        description: 'Stad/plaats van de workshop',
        placeholder: 'Amsterdam',
      },
    },

    // === Registration ===
    {
      name: 'registrationUrl',
      type: 'text',
      label: 'Aanmeldings URL',
      admin: {
        description: 'Link naar aanmeldpagina of formulier',
        placeholder: 'https://...',
      },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      label: 'Max Deelnemers',
      admin: {
        description: 'Maximaal aantal deelnemers',
        placeholder: '25',
      },
    },
    {
      name: 'currentParticipants',
      type: 'number',
      label: 'Huidige Deelnemers',
      defaultValue: 0,
      admin: {
        description: 'Aantal huidige aanmeldingen',
      },
    },

    // === Pricing ===
    {
      name: 'isFree',
      type: 'checkbox',
      label: 'Gratis',
      defaultValue: false,
      admin: {
        description: 'Is deze workshop gratis?',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Prijs (€)',
      admin: {
        description: 'Prijs in euro',
        condition: (data) => !data.isFree,
        placeholder: '149',
      },
    },
    {
      name: 'priceDisplay',
      type: 'text',
      label: 'Prijs Weergave',
      admin: {
        description: 'Bijv: "€149 ex BTW" of "Gratis voor partners"',
        placeholder: '€149 ex BTW',
      },
    },

    // === Classification ===
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Wondverzorging', value: 'wondverzorging' },
        { label: 'Handhygiëne', value: 'handygiene' },
        { label: 'Diagnostiek', value: 'diagnostiek' },
        { label: 'Sterilisatie', value: 'sterilisatie' },
        { label: 'Product Training', value: 'product-training' },
        { label: 'Algemeen', value: 'algemeen' },
      ],
    },
    {
      name: 'level',
      type: 'select',
      label: 'Niveau',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Gemiddeld', value: 'intermediate' },
        { label: 'Gevorderd', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
    },
    {
      name: 'targetAudience',
      type: 'select',
      label: 'Doelgroep',
      hasMany: true,
      options: [
        { label: 'Verpleegkundigen', value: 'nurses' },
        { label: 'Artsen', value: 'doctors' },
        { label: 'Zorgmedewerkers', value: 'care-workers' },
        { label: 'Apothekers', value: 'pharmacists' },
        { label: 'Management', value: 'management' },
      ],
    },

    // === Status ===
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      label: 'Status',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Aankomend', value: 'upcoming' },
        { label: 'Inschrijving Open', value: 'open' },
        { label: 'Bijna Vol', value: 'almost-full' },
        { label: 'Volgeboekt', value: 'full' },
        { label: 'Afgelopen', value: 'completed' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon als featured workshop',
      },
    },

    // === Additional Information ===
    {
      name: 'learningObjectives',
      type: 'array',
      label: 'Leerdoelen',
      admin: {
        description: 'Wat leren deelnemers in deze workshop?',
      },
      fields: [
        {
          name: 'objective',
          type: 'text',
          required: true,
          label: 'Leerdoel',
        },
      ],
    },
    {
      name: 'prerequisites',
      type: 'textarea',
      label: 'Voorkennis',
      admin: {
        description: 'Vereiste voorkennis voor deelname',
        rows: 3,
      },
    },
    {
      name: 'certificateAwarded',
      type: 'checkbox',
      label: 'Certificaat Verstrekt',
      defaultValue: false,
      admin: {
        description: 'Krijgen deelnemers een certificaat?',
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
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Beschrijving',
          maxLength: 160,
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-calculate spots available
        if (data.maxParticipants && data.currentParticipants !== undefined) {
          const spotsLeft = data.maxParticipants - data.currentParticipants

          // Auto-update status based on capacity
          if (spotsLeft === 0 && data.status !== 'full' && data.status !== 'completed') {
            data.status = 'full'
          } else if (spotsLeft <= 3 && spotsLeft > 0 && data.status === 'open') {
            data.status = 'almost-full'
          }
        }

        // Auto-set to completed if date has passed
        if (data.date && new Date(data.date) < new Date() && data.status !== 'cancelled') {
          data.status = 'completed'
        }

        return data
      },
    ],
  },
}
