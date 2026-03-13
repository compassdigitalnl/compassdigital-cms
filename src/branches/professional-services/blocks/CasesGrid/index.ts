import type { Block } from 'payload'

/**
 * Cases Grid Block
 *
 * Grid of professional service cases with multiple sourcing options.
 * Features:
 * - Auto-fetch all published cases
 * - Featured cases only
 * - Manual selection
 * - Category filtering (by service)
 * - Configurable columns
 * - Optional CTA button
 *
 * Based on: Construction ProjectsGrid block pattern
 */
export const CasesGrid: Block = {
  slug: 'cases-grid',
  labels: {
    singular: 'Cases Grid',
    plural: 'Cases Grids',
  },
  interfaceName: 'CasesGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'group',
      label: 'Kopje',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          admin: {
            description: 'Kleine label boven de titel (bijv. "Ons werk")',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Case Studies',
          admin: {
            description: 'Hoofdtitel van de sectie',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          admin: {
            description: 'Optionele beschrijving onder de titel',
            rows: 2,
          },
        },
      ],
    },
    {
      name: 'casesSource',
      type: 'radio',
      label: 'Cases bron',
      required: true,
      defaultValue: 'auto',
      options: [
        {
          label: 'Automatisch (alle gepubliceerde cases)',
          value: 'auto',
        },
        {
          label: 'Alleen uitgelichte cases',
          value: 'featured',
        },
        {
          label: 'Handmatig selecteren',
          value: 'manual',
        },
        {
          label: 'Op dienst filteren',
          value: 'service',
        },
      ],
      admin: {
        description: 'Hoe moeten cases geselecteerd worden?',
      },
    },
    {
      name: 'cases',
      type: 'relationship',
      relationTo: 'content-cases',
      hasMany: true,
      label: 'Cases',
      admin: {
        description: 'Selecteer specifieke cases',
        condition: (data) => data.casesSource === 'manual',
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'content-services',
      label: 'Dienst',
      admin: {
        description: 'Filter cases op deze dienst',
        condition: (data) => data.casesSource === 'service',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Aantal cases',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximum aantal cases om te tonen',
        condition: (data) => data.casesSource !== 'manual',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      defaultValue: '3',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
      admin: {
        description: 'Aantal kolommen in het grid (desktop)',
      },
    },
    {
      name: 'showFilter',
      type: 'checkbox',
      label: 'Toon filter knoppen',
      defaultValue: false,
      admin: {
        description: 'Toon dienst filter knoppen boven het grid',
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call-to-Action',
      admin: {
        description: 'Optionele knop onder het grid',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Toon CTA knop',
          defaultValue: false,
        },
        {
          name: 'text',
          type: 'text',
          label: 'Knop tekst',
          defaultValue: 'Bekijk alle cases',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/cases',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
      ],
    },
  ],
}

export default CasesGrid
