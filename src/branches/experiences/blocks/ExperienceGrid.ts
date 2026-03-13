import type { Block } from 'payload'

/**
 * Experience Grid Block
 *
 * Displays a grid of experience cards with optional filter sidebar.
 * Used on archive/overview pages.
 */
export const ExperienceGrid: Block = {
  slug: 'experience-grid',
  interfaceName: 'ExperienceGridBlock',
  labels: {
    singular: 'Ervaringen Grid',
    plural: 'Ervaringen Grids',
  },
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
            description: 'Kleine label boven de titel (bijv. "Ons aanbod")',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Alle ervaringen',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          admin: { rows: 2 },
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'auto',
      options: [
        { label: 'Automatisch (alle gepubliceerde)', value: 'auto' },
        { label: 'Alleen uitgelichte', value: 'featured' },
        { label: 'Handmatig selecteren', value: 'manual' },
        { label: 'Per categorie', value: 'category' },
      ],
      admin: {
        description: 'Hoe moeten ervaringen geselecteerd worden?',
      },
    },
    {
      name: 'experiences',
      type: 'relationship',
      relationTo: 'content-activities',
      hasMany: true,
      label: 'Selecteer ervaringen',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'categoryFilter',
      type: 'text',
      label: 'Categorie filter',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'category',
        description: 'Filter op type: experience, event, of workshop',
      },
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      label: 'Toon filter sidebar',
      defaultValue: false,
      admin: {
        description: 'Toon de filter sidebar naast het grid',
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
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 12,
      min: 1,
      max: 50,
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      label: 'Toon paginering',
      defaultValue: true,
    },
  ],
}

export default ExperienceGrid
