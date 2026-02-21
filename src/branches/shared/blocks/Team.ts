import type { Block } from 'payload'

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Team',
    plural: 'Team',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Ons team',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro tekst',
      admin: {
        rows: 2,
      },
    },
    {
      name: 'members',
      type: 'array',
      label: 'Team leden',
      labels: {
        singular: 'Teamlid',
        plural: 'Teamleden',
      },
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Foto',
        },
        {
          name: 'photoUrl',
          type: 'text',
          label: 'Foto URL (placeholder)',
          admin: {
            description: 'Directe URL naar foto (gebruikt voor AI-gegenereerde teams)',
            readOnly: true,
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Naam',
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          label: 'Functie',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Bio',
          admin: {
            rows: 3,
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-3',
      options: [
        { label: '2 kolommen', value: 'grid-2' },
        { label: '3 kolommen', value: 'grid-3' },
        { label: '4 kolommen', value: 'grid-4' },
      ],
    },
  ],
}
