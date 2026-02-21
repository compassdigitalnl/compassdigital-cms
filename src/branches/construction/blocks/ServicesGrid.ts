import type { Block } from 'payload'

/**
 * Services Grid Block
 *
 * Grid of construction services pulled from ConstructionServices collection.
 * Features:
 * - Auto-fetch from collection OR manual selection
 * - Grid layout (3 columns)
 * - Hover effects
 * - CTA links to service detail pages
 *
 * Based on: VanderBouw services section
 */
export const ServicesGrid: Block = {
  slug: 'services-grid',
  labels: {
    singular: 'Diensten Grid',
    plural: 'Diensten Grids',
  },
  interfaceName: 'ServicesGridBlock',
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
          defaultValue: 'Onze diensten',
          admin: {
            description: 'Kleine badge boven de titel',
          },
        },
        {
          name: 'badgeIcon',
          type: 'text',
          label: 'Badge icon',
          defaultValue: 'wrench',
          admin: {
            description: 'Lucide icon naam',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titel',
          defaultValue: 'Alles onder één dak',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          defaultValue: 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
          admin: {
            rows: 2,
          },
        },
      ],
    },
    {
      name: 'servicesSource',
      type: 'radio',
      label: 'Diensten bron',
      options: [
        {
          label: 'Automatisch (alle gepubliceerde diensten)',
          value: 'auto',
        },
        {
          label: 'Handmatig selecteren',
          value: 'manual',
        },
      ],
      defaultValue: 'auto',
      admin: {
        description: 'Kies hoe diensten getoond worden',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'construction-services',
      hasMany: true,
      label: 'Diensten',
      admin: {
        description: 'Selecteer welke diensten getoond worden',
        condition: (data) => data.servicesSource === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Hoeveel diensten maximaal tonen',
        condition: (data) => data.servicesSource === 'auto',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          label: 'Kolommen',
          options: [
            { label: '2 kolommen', value: '2' },
            { label: '3 kolommen', value: '3' },
            { label: '4 kolommen', value: '4' },
          ],
          defaultValue: '3',
          admin: {
            description: 'Grid layout',
            width: '50%',
          },
        },
        {
          name: 'linkText',
          type: 'text',
          label: 'Link tekst',
          defaultValue: 'Meer info',
          admin: {
            description: 'Tekst voor "lees meer" link',
            width: '50%',
          },
        },
      ],
    },
  ],
}

export default ServicesGrid
