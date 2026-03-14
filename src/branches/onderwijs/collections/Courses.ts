import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlug } from '@/utilities/slugify'

/**
 * Courses Collection — Onderwijs Branch
 *
 * Cursusbeheer voor online academies en trainingsplatformen.
 * Ondersteunt curriculum met secties en lessen, prijzen, statistieken en SEO.
 */
export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: {
    singular: 'Cursus',
    plural: 'Cursussen',
  },
  admin: {
    group: 'Onderwijs',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'level', 'studentCount', 'rating'],
    hidden: shouldHideCollection('education'),
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
  fields: [
    // ─── SIDEBAR ─────────────────────────────────────────────
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

    // ─── TABS ────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Algemeen ──
        {
          label: 'Algemeen',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Titel',
              admin: {
                description: 'Bijv. "Python voor Beginners"',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
              hooks: {
                beforeValidate: [autoGenerateSlug],
              },
              admin: {
                description: 'Automatisch gegenereerd uit de titel',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitel',
              maxLength: 300,
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'course-categories',
              label: 'Categorie',
            },
            {
              name: 'instructor',
              type: 'relationship',
              relationTo: 'content-team',
              label: 'Docent',
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              label: 'Thumbnail',
            },
            {
              name: 'videoPreviewUrl',
              type: 'text',
              label: 'Video preview URL',
              admin: {
                description: 'URL naar een preview/trailer video (bijv. YouTube of Vimeo)',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Korte beschrijving',
              maxLength: 500,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Uitgebreide beschrijving',
            },
          ],
        },

        // ── TAB 2: Curriculum ──
        {
          label: 'Curriculum',
          fields: [
            {
              name: 'sections',
              type: 'array',
              label: 'Secties',
              fields: [
                {
                  name: 'sectionNumber',
                  type: 'number',
                  label: 'Sectienummer',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titel',
                },
                {
                  name: 'lessons',
                  type: 'array',
                  label: 'Lessen',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      label: 'Type',
                      options: [
                        { label: 'Video', value: 'video' },
                        { label: 'Leesmateriaal', value: 'reading' },
                        { label: 'Quiz', value: 'quiz' },
                        { label: 'Opdracht', value: 'assignment' },
                      ],
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Titel',
                    },
                    {
                      name: 'duration',
                      type: 'text',
                      label: 'Duur',
                      admin: {
                        description: 'Bijv. "12:30" of "45 min"',
                      },
                    },
                    {
                      name: 'isPreview',
                      type: 'checkbox',
                      label: 'Gratis preview',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── TAB 3: Details ──
        {
          label: 'Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'level',
                  type: 'select',
                  label: 'Niveau',
                  options: [
                    { label: 'Beginner', value: 'beginner' },
                    { label: 'Gevorderd', value: 'gevorderd' },
                    { label: 'Expert', value: 'expert' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'language',
                  type: 'select',
                  label: 'Taal',
                  defaultValue: 'nederlands',
                  options: [
                    { label: 'Nederlands', value: 'nederlands' },
                    { label: 'Engels', value: 'engels' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  type: 'number',
                  label: 'Duur (uren)',
                  admin: { width: '50%' },
                },
                {
                  name: 'totalLessons',
                  type: 'number',
                  label: 'Totaal lessen',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'learningOutcomes',
              type: 'array',
              label: 'Wat leer je?',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Leerresultaat',
                },
              ],
            },
            {
              name: 'requirements',
              type: 'array',
              label: 'Vereisten',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Vereiste',
                },
              ],
            },
            {
              name: 'includes',
              type: 'array',
              label: 'Wat krijg je?',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Item',
                },
              ],
            },
            {
              name: 'certificate',
              type: 'checkbox',
              label: 'Certificaat bij voltooiing',
              defaultValue: false,
            },
          ],
        },

        // ── TAB 4: Prijzen ──
        {
          label: 'Prijzen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Prijs (€)',
                  admin: {
                    width: '50%',
                    step: 0.01,
                  },
                },
                {
                  name: 'originalPrice',
                  type: 'number',
                  label: 'Originele prijs (€)',
                  admin: {
                    width: '50%',
                    step: 0.01,
                    description: 'Wordt doorgestreept weergegeven',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'discountPercentage',
                  type: 'number',
                  label: 'Korting (%)',
                  min: 0,
                  max: 100,
                  admin: { width: '50%' },
                },
                {
                  name: 'discountEndsAt',
                  type: 'date',
                  label: 'Korting verloopt op',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 5: Statistieken ──
        {
          label: 'Statistieken',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Beoordeling',
                  min: 0,
                  max: 5,
                  admin: {
                    width: '50%',
                    step: 0.1,
                    description: 'Gemiddelde score van 0 tot 5',
                  },
                },
                {
                  name: 'reviewCount',
                  type: 'number',
                  label: 'Aantal reviews',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'studentCount',
                  type: 'number',
                  label: 'Aantal studenten',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'lastUpdated',
                  type: 'date',
                  label: 'Laatst bijgewerkt',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 6: SEO ──
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta titel',
              admin: {
                description: 'Wordt weergegeven in zoekresultaten (max. 60 tekens)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta beschrijving',
              maxLength: 160,
              admin: {
                description: 'Wordt weergegeven in zoekresultaten (max. 160 tekens)',
              },
            },
          ],
        },
      ],
    },
  ],
}
