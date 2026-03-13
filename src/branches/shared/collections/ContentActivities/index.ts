import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { isCollectionEnabled } from '@/lib/tenant/isCollectionDisabled'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'
import { branchOptions } from '../ContentServices'

/**
 * Content Activities — Unified collection
 *
 * Vervangt: experiences, events, workshops
 * Alle activiteiten, events en workshops in één collection.
 */
export const ContentActivities: CollectionConfig = {
  slug: 'content-activities',
  labels: {
    singular: 'Activiteit',
    plural: 'Activiteiten',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'branch', 'date', 'status', 'featured'],
    hidden: shouldHideCollection(),
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
  },
  fields: [
    // ─── TOP FIELDS ────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { position: 'sidebar' },
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
      name: 'type',
      type: 'select',
      required: true,
      label: 'Type',
      options: [
        { label: 'Ervaring / Arrangement', value: 'experience' },
        { label: 'Evenement', value: 'event' },
        { label: 'Workshop', value: 'workshop' },
      ],
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
        { label: 'Gearchiveerd', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── TABS ──────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Inhoud ──
        {
          label: 'Inhoud',
          fields: [
            { name: 'excerpt', type: 'textarea', label: 'Korte beschrijving', maxLength: 200 },
            { name: 'description', type: 'richText', label: 'Uitgebreide beschrijving' },
            // Ervaringen-specifiek
            {
              name: 'highlights',
              type: 'array',
              label: 'Highlights',
              admin: {
                condition: (_, s) => s?.type === 'experience' || s?.branch === 'ervaringen',
              },
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Label' },
                { name: 'icon', type: 'text', label: 'Icoon' },
              ],
            },
            {
              name: 'included',
              type: 'array',
              label: 'Inclusief',
              admin: {
                condition: (_, s) => s?.type === 'experience' || s?.branch === 'ervaringen',
              },
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Label' },
                { name: 'icon', type: 'text', label: 'Icoon' },
              ],
            },
            // Workshop-specifiek
            {
              name: 'learningObjectives',
              type: 'array',
              label: 'Leerdoelen',
              admin: { condition: (_, s) => s?.type === 'workshop' },
              fields: [
                { name: 'objective', type: 'text', required: true, label: 'Leerdoel' },
              ],
            },
            {
              name: 'level',
              type: 'select',
              label: 'Niveau',
              admin: { condition: (_, s) => s?.type === 'workshop' },
              options: [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Gemiddeld', value: 'intermediate' },
                { label: 'Gevorderd', value: 'advanced' },
                { label: 'Expert', value: 'expert' },
              ],
            },
            {
              name: 'instructor',
              type: 'text',
              label: 'Docent / Instructeur',
              admin: { condition: (_, s) => s?.type === 'workshop' },
            },
          ],
        },

        // ── TAB 2: Datum & Locatie ──
        {
          label: 'Datum & Locatie',
          fields: [
            { name: 'date', type: 'date', label: 'Startdatum', admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'endDate', type: 'date', label: 'Einddatum', admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'duration', type: 'text', label: 'Duur', admin: { description: 'Bijv. "2 uur", "halve dag", "3 dagen"' } },
            { name: 'location', type: 'text', label: 'Locatie' },
          ],
        },

        // ── TAB 3: Prijzen & Deelname ──
        {
          label: 'Prijzen & Deelname',
          fields: [
            { name: 'price', type: 'number', label: 'Prijs (€)', admin: { step: 0.01 } },
            {
              name: 'priceType',
              type: 'select',
              label: 'Prijs type',
              options: [
                { label: 'Per persoon', value: 'per-person' },
                { label: 'Vast bedrag', value: 'fixed' },
                { label: 'Vanaf', value: 'from' },
                { label: 'Gratis', value: 'free' },
              ],
            },
            { name: 'maxParticipants', type: 'number', label: 'Max deelnemers' },
            { name: 'bookingRequired', type: 'checkbox', label: 'Reservering verplicht', defaultValue: false },
            // Ervaringen-specifiek: extras
            {
              name: 'extras',
              type: 'array',
              label: 'Extra opties',
              admin: {
                condition: (_, s) => s?.type === 'experience' || s?.branch === 'ervaringen',
              },
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Naam' },
                { name: 'price', type: 'number', required: true, label: 'Prijs (€)', admin: { step: 0.01 } },
                { name: 'popular', type: 'checkbox', label: 'Populair', defaultValue: false },
              ],
            },
          ],
        },

        // ── TAB 4: Media ──
        {
          label: 'Media',
          fields: [
            { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Uitgelichte afbeelding' },
            {
              name: 'gallery',
              type: 'array',
              label: 'Galerij',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Afbeelding' },
                { name: 'caption', type: 'text', label: 'Bijschrift' },
              ],
            },
          ],
        },

        // ── TAB 5: Relaties ──
        {
          label: 'Relaties',
          fields: [
            ...(isCollectionEnabled('vendors') ? [{
              name: 'vendor',
              type: 'relationship' as const,
              relationTo: 'vendors' as const,
              label: 'Aanbieder',
              admin: {
                condition: (_: any, s: any) => s?.branch === 'marketplace',
              },
            }] : []),
          ],
        },

        // ── TAB 6: SEO ──
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Meta',
              fields: [
                { name: 'title', type: 'text', label: 'Meta titel' },
                { name: 'description', type: 'textarea', label: 'Meta beschrijving', maxLength: 160 },
              ],
            },
          ],
        },
      ],
    },
  ],
}
