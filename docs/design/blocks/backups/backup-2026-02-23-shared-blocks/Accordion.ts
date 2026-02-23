import type { Block } from 'payload'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  labels: {
    singular: 'Accordion',
    plural: 'Accordions',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titel',
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          label: 'Content',
        },
      ],
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      label: 'Meerdere open toestaan',
      defaultValue: false,
      admin: {
        description: 'Als uit, sluit het openen van één item de andere automatisch',
      },
    },
  ],
}
