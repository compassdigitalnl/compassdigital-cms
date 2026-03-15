import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

/**
 * Workshops Collection (Marketplace Rebuild)
 *
 * Training sessions, webinars, and educational events.
 * Often organized by vendors/suppliers.
 *
 * Changes from v1:
 * - category: relationship to product-categories (was hardcoded select)
 * - targetAudience: array of { name } (was hardcoded select)
 * - No client-specific defaults
 */
export const Workshops: CollectionConfig = {
  slug: 'workshops',
  labels: {
    singular: 'Workshop',
    plural: 'Workshops',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Marktplaats',
    defaultColumns: ['title', 'vendor', 'date', 'locationCity', 'status', 'updatedAt'],
    description: 'Trainingen, workshops en webinars',
    hidden: shouldHideCollection('workshops'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ── Sidebar ───────────────────────────────────────────────────────────
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
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      label: 'Status',
      admin: { position: 'sidebar' },
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

    // ── Basic Information ─────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Beschrijving',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Korte Beschrijving',
      maxLength: 200,
      admin: { rows: 3 },
    },

    // ── Visual ────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Afbeelding',
          admin: { width: '80%' },
        },
        {
          name: 'emoji',
          type: 'text',
          label: 'Emoji',
          maxLength: 2,
          admin: { width: '20%' },
        },
      ],
    },

    // ── Vendor/Organizer ──────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'vendor',
          type: 'relationship',
          relationTo: 'vendors',
          label: 'Organiserende Leverancier',
          admin: { width: '50%' },
        },
        {
          name: 'instructor',
          type: 'text',
          label: 'Docent/Trainer',
          admin: { width: '50%' },
        },
      ],
    },

    // ── Scheduling ────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Datum',
          admin: {
            width: '34%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Duur (minuten)',
          admin: { width: '33%' },
        },
        {
          name: 'durationDisplay',
          type: 'text',
          label: 'Duur Weergave',
          admin: { width: '33%' },
        },
      ],
    },

    // ── Location ──────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'locationType',
          type: 'select',
          required: true,
          label: 'Locatie Type',
          defaultValue: 'physical',
          admin: { width: '30%' },
          options: [
            { label: 'Fysieke Locatie', value: 'physical' },
            { label: 'Online (Webinar)', value: 'online' },
            { label: 'Hybride', value: 'hybrid' },
          ],
        },
        {
          name: 'locationName',
          type: 'text',
          label: 'Locatie Naam',
          admin: {
            width: '35%',
            condition: (data) => data.locationType !== 'online',
          },
        },
        {
          name: 'locationCity',
          type: 'text',
          label: 'Plaats',
          admin: { width: '35%' },
        },
      ],
    },
    {
      name: 'locationAddress',
      type: 'textarea',
      label: 'Adres',
      admin: {
        rows: 2,
        condition: (data) => data.locationType === 'physical' || data.locationType === 'hybrid',
      },
    },

    // ── Registration ──────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'registrationUrl',
          type: 'text',
          label: 'Aanmeldings URL',
          admin: { width: '50%' },
        },
        {
          name: 'maxParticipants',
          type: 'number',
          label: 'Max Deelnemers',
          admin: { width: '25%' },
        },
        {
          name: 'currentParticipants',
          type: 'number',
          label: 'Huidige Aanmeldingen',
          defaultValue: 0,
          admin: { width: '25%' },
        },
      ],
    },

    // ── Pricing ───────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'isFree',
          type: 'checkbox',
          label: 'Gratis',
          defaultValue: false,
          admin: { width: '20%' },
        },
        {
          name: 'price',
          type: 'number',
          label: 'Prijs (€)',
          admin: {
            width: '40%',
            condition: (data) => !data.isFree,
          },
        },
        {
          name: 'priceDisplay',
          type: 'text',
          label: 'Prijs Weergave',
          admin: { width: '40%' },
        },
      ],
    },

    // ── Classification ────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'product-categories',
          label: 'Categorie',
          admin: {
            width: '50%',
            description: 'Productcategorie van deze workshop',
          },
        },
        {
          name: 'level',
          type: 'select',
          label: 'Niveau',
          admin: { width: '50%' },
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Gemiddeld', value: 'intermediate' },
            { label: 'Gevorderd', value: 'advanced' },
            { label: 'Expert', value: 'expert' },
          ],
        },
      ],
    },
    {
      name: 'targetAudience',
      type: 'array',
      label: 'Doelgroep',
      admin: {
        description: 'Voor wie is deze workshop bedoeld?',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Doelgroep',
        },
      ],
    },

    // ── Additional Information ─────────────────────────────────────────────
    {
      name: 'learningObjectives',
      type: 'array',
      label: 'Leerdoelen',
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
      admin: { rows: 3 },
    },
    {
      name: 'certificateAwarded',
      type: 'checkbox',
      label: 'Certificaat Verstrekt',
      defaultValue: false,
    },

    // ── SEO ───────────────────────────────────────────────────────────────
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
        if (!data) return data

        // Auto-calculate spots available
        if (data.maxParticipants && data.currentParticipants !== undefined) {
          const spotsLeft = data.maxParticipants - data.currentParticipants

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

export default Workshops
