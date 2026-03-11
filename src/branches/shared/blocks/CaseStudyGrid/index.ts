import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-43 CaseStudyGrid Block
 *
 * Case study cards with client name, results metrics, image, and link.
 * Grid layout or featured layout (first case large).
 */
export const CaseStudyGrid: Block = {
  slug: 'caseStudyGrid',
  interfaceName: 'CaseStudyGridBlock',
  labels: {
    singular: 'Case Study Grid',
    plural: 'Case Study Grids',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              admin: {
                placeholder: 'Onze Succesverhalen',
                description: 'Optionele koptekst boven de case studies',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Ontdek hoe we bedrijven hebben geholpen groeien',
                description: 'Optionele subtekst onder de titel',
              },
            },
            {
              name: 'cases',
              type: 'array',
              label: 'Case studies',
              minRows: 1,
              admin: {
                description: 'Case studies met klantgegevens, resultaten en afbeelding',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titel',
                  required: true,
                  admin: {
                    placeholder: 'Webshop migratie naar modern platform',
                  },
                },
                {
                  name: 'client',
                  type: 'text',
                  label: 'Klant',
                  admin: {
                    placeholder: 'Medisch Totaal BV',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  admin: {
                    rows: 3,
                    placeholder: 'Korte omschrijving van het project en de uitdaging...',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Afbeelding',
                  admin: {
                    description: 'Screenshot of afbeelding van het project',
                  },
                },
                {
                  name: 'results',
                  type: 'array',
                  label: 'Resultaten',
                  maxRows: 4,
                  admin: {
                    description: 'Meetbare resultaten (bijv. +200% omzet, 3x sneller)',
                  },
                  fields: [
                    {
                      name: 'metric',
                      type: 'text',
                      label: 'Metriek',
                      admin: {
                        placeholder: 'bijv. Omzet, Conversie, Laadtijd',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Waarde',
                      admin: {
                        placeholder: 'bijv. +200%, 3x sneller, -50%',
                      },
                    },
                  ],
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link',
                  admin: {
                    placeholder: '/cases/medisch-totaal',
                    description: 'Link naar de volledige case study',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'grid',
              options: [
                { label: 'Grid (gelijke kaarten)', value: 'grid' },
                { label: 'Uitgelicht (eerste groot)', value: 'featured' },
              ],
              admin: {
                description: 'Grid = gelijke kaarten. Uitgelicht = eerste case study groot weergegeven.',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
