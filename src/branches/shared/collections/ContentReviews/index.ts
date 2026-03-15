import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideContentCollection } from '@/lib/tenant/shouldHideCollection'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'
import { branchOptions } from '../ContentServices'
import { courseReviewHook } from '@/branches/shared/hooks/courseReviewHook'

const colorOptions = [
  { label: 'Teal', value: 'teal' },
  { label: 'Blauw', value: 'blue' },
  { label: 'Groen', value: 'green' },
  { label: 'Paars', value: 'purple' },
  { label: 'Amber', value: 'amber' },
  { label: 'Koraal', value: 'coral' },
]

/**
 * Content Reviews — Unified collection
 *
 * Vervangt: testimonials, professional-reviews, construction-reviews, experience-reviews
 * NIET: product-reviews (product-gebonden) en vendor-reviews (vendor-gebonden)
 */
export const ContentReviews: CollectionConfig = {
  slug: 'content-reviews',
  labels: {
    singular: 'Review',
    plural: 'Reviews',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'branch', 'rating', 'featured', 'status'],
    hidden: shouldHideContentCollection('content-reviews'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.branch) {
          data.branch = getCachedSiteBranch()
        }
        return data
      },
    ],
    afterChange: [courseReviewHook],
  },
  fields: [
    // ─── TOP FIELDS ────────────────────────────────────────
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'branch',
      type: 'select',
      required: true,
      label: 'Branche',
      options: branchOptions,
      defaultValue: () => getCachedSiteBranch(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Waardering (1-5)',
      min: 1,
      max: 5,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── CONTENT ───────────────────────────────────────────
    { name: 'authorRole', type: 'text', label: 'Functie' },
    { name: 'authorCompany', type: 'text', label: 'Bedrijf' },
    {
      name: 'authorPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
    },
    { name: 'authorInitials', type: 'text', label: 'Initialen', maxLength: 3 },
    {
      name: 'authorColor',
      type: 'select',
      label: 'Avatar kleur',
      options: colorOptions,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Review tekst',
    },

    // ─── RELATIES ──────────────────────────────────────────
    {
      name: 'relatedCase',
      type: 'relationship',
      relationTo: 'content-cases',
      label: 'Gerelateerde case',
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'content-services',
      label: 'Gerelateerde dienst',
    },

    // ─── ONDERWIJS-SPECIFIEK ────────────────────────────────
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Cursus',
      admin: {
        condition: (_, s) => s?.branch === 'onderwijs',
        description: 'Gekoppelde cursus voor deze review',
      },
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Geverifieerde student',
      defaultValue: false,
      admin: {
        condition: (_, s) => s?.branch === 'onderwijs',
        description: 'Student heeft een actieve inschrijving voor deze cursus',
      },
    },

    // ─── ERVARINGEN-SPECIFIEK ──────────────────────────────
    {
      name: 'detailedRatings',
      type: 'group',
      label: 'Gedetailleerde beoordelingen',
      admin: { condition: (_, s) => s?.branch === 'ervaringen' },
      fields: [
        { name: 'organization', type: 'number', label: 'Organisatie', min: 1, max: 10 },
        { name: 'location', type: 'number', label: 'Locatie', min: 1, max: 10 },
        { name: 'foodDrink', type: 'number', label: 'Eten & Drinken', min: 1, max: 10 },
        { name: 'atmosphere', type: 'number', label: 'Sfeer', min: 1, max: 10 },
        { name: 'valueForMoney', type: 'number', label: 'Prijs-kwaliteit', min: 1, max: 10 },
      ],
    },
    {
      name: 'groupType',
      type: 'text',
      label: 'Groepstype',
      admin: {
        condition: (_, s) => s?.branch === 'ervaringen',
        description: 'Bijv. "Vrijgezellenfeest", "Teamuitje", "Familiedag"',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Datum bezoek',
      admin: {
        condition: (_, s) => s?.branch === 'ervaringen',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
  ],
}
