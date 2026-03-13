import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'
import { branchOptions } from '../ContentServices'

/**
 * Content Cases — Unified collection
 *
 * Vervangt: cases, professional-cases, construction-projects, projects
 * Portfolio/case studies/projecten in één collection.
 * URL wordt bepaald door Settings > casesModule.routeSlug (bijv. /projecten, /cases, /portfolio).
 */
export const ContentCases: CollectionConfig = {
  slug: 'content-cases',
  labels: {
    singular: 'Case',
    plural: 'Cases',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'branch', 'client', 'status', 'featured'],
    hidden: shouldHideCollection(),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  versions: {
    drafts: true,
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
      admin: {
        position: 'sidebar',
        description: 'Bepaalt welke velden zichtbaar zijn',
      },
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

    // ─── TABS ──────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Details ──
        {
          label: 'Details',
          fields: [
            {
              name: 'client',
              type: 'text',
              label: 'Klant',
            },
            {
              name: 'industry',
              type: 'text',
              label: 'Branche / Sector',
            },
            {
              name: 'badges',
              type: 'array',
              label: 'Badges',
              fields: [
                { name: 'badge', type: 'text', required: true, label: 'Badge' },
              ],
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Doorlooptijd',
            },
            {
              name: 'resultHighlight',
              type: 'text',
              label: 'Resultaat highlight',
              admin: { description: 'Kort resultaat, bijv. "40% meer conversie"' },
            },
            // ─── Bouw-specifiek
            {
              name: 'location',
              type: 'text',
              label: 'Locatie',
              admin: { condition: (_, s) => s?.branch === 'bouw' },
            },
            {
              name: 'year',
              type: 'number',
              label: 'Jaar',
              admin: { condition: (_, s) => ['bouw', 'general', 'tech'].includes(s?.branch) },
            },
            {
              name: 'size',
              type: 'text',
              label: 'Omvang',
              admin: {
                condition: (_, s) => s?.branch === 'bouw',
                description: 'Bijv. "250m²", "3 verdiepingen"',
              },
            },
            {
              name: 'budget',
              type: 'text',
              label: 'Budget',
              admin: { condition: (_, s) => s?.branch === 'bouw' },
            },
            // ─── Tech-specifiek
            {
              name: 'websiteUrl',
              type: 'text',
              label: 'Website URL',
              admin: { condition: (_, s) => ['tech', 'dienstverlening'].includes(s?.branch) },
            },
            {
              name: 'technologies',
              type: 'array',
              label: 'Technologieën',
              admin: { condition: (_, s) => s?.branch === 'tech' },
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Naam' },
                { name: 'icon', type: 'text', label: 'Icoon' },
                { name: 'category', type: 'text', label: 'Categorie' },
              ],
            },
            // ─── Universeel
            {
              name: 'metrics',
              type: 'array',
              label: 'Resultaat metrics',
              fields: [
                { name: 'value', type: 'text', required: true, label: 'Waarde' },
                { name: 'label', type: 'text', required: true, label: 'Label' },
                { name: 'icon', type: 'text', label: 'Icoon' },
                { name: 'suffix', type: 'text', label: 'Suffix' },
              ],
            },
            {
              name: 'timeline',
              type: 'array',
              label: 'Timeline',
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Titel' },
                { name: 'description', type: 'textarea', label: 'Beschrijving' },
                { name: 'duration', type: 'text', label: 'Duur' },
              ],
            },
          ],
        },

        // ── TAB 2: Inhoud ──
        {
          label: 'Inhoud',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              label: 'Korte beschrijving',
              maxLength: 300,
            },
            { name: 'challenge', type: 'richText', label: 'Uitdaging' },
            { name: 'solution', type: 'richText', label: 'Oplossing' },
            { name: 'resultDescription', type: 'richText', label: 'Resultaat' },
          ],
        },

        // ── TAB 3: Media ──
        {
          label: 'Media',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Uitgelichte afbeelding',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galerij',
            },
            {
              name: 'beforeAfter',
              type: 'group',
              label: 'Voor / Na',
              admin: { condition: (_, s) => s?.branch === 'bouw' },
              fields: [
                { name: 'before', type: 'upload', relationTo: 'media', label: 'Voor' },
                { name: 'after', type: 'upload', relationTo: 'media', label: 'Na' },
              ],
            },
          ],
        },

        // ── TAB 4: Testimonial ──
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'testimonial',
              type: 'group',
              label: 'Klanttestimonial',
              fields: [
                { name: 'quote', type: 'textarea', label: 'Quote' },
                { name: 'name', type: 'text', label: 'Naam' },
                { name: 'role', type: 'text', label: 'Functie' },
              ],
            },
          ],
        },

        // ── TAB 5: Relaties ──
        {
          label: 'Relaties',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'content-services',
              hasMany: true,
              label: 'Gerelateerde diensten',
            },
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
                { name: 'keywords', type: 'text', label: 'Keywords' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
