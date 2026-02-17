import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Ontwerp',
    hidden: ({ user }) => checkRole(['admin'], user),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Footer kolommen',
      maxRows: 4,
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Kolom titel',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Tekst',
            },
            {
              name: 'type',
              type: 'select',
              defaultValue: 'page',
              options: [
                { label: 'Pagina', value: 'page' },
                { label: 'Externe URL', value: 'external' },
              ],
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              label: 'Externe URL',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'external',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'bottomText',
      type: 'richText',
      label: 'Ondertekst (copyright etc.)',
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      label: 'Toon social media links',
      defaultValue: true,
      admin: {
        description: 'Social media links komen uit Site Settings',
      },
    },
  ],
}
