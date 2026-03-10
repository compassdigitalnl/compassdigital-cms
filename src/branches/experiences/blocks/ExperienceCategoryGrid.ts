import type { Block } from 'payload'

/**
 * Experience Category Grid Block
 *
 * Displays experience categories as visual cards with icons.
 * Used on homepage and overview pages.
 */
export const ExperienceCategoryGrid: Block = {
  slug: 'experience-category-grid',
  interfaceName: 'ExperienceCategoryGridBlock',
  labels: {
    singular: 'Ervaringen Categorie Grid',
    plural: 'Ervaringen Categorie Grids',
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
            placeholder: 'Categorieën',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Wat wil je doen?',
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
        { label: 'Automatisch (alle categorieën)', value: 'auto' },
        { label: 'Handmatig selecteren', value: 'manual' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'experience-categories',
      hasMany: true,
      label: 'Selecteer categorieën',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      defaultValue: '4',
      options: [
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
        { label: '6 kolommen', value: '6' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 8,
      min: 1,
      max: 16,
    },
    {
      name: 'showCount',
      type: 'checkbox',
      label: 'Toon aantal ervaringen',
      defaultValue: true,
      admin: {
        description: 'Toon het aantal ervaringen per categorie',
      },
    },
  ],
}

export default ExperienceCategoryGrid
