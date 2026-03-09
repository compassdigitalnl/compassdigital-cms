import type { Tab } from 'payload'

export const mediaTab: Tab = {
  label: 'Media',
  description: 'Afbeeldingen, videos en downloads',
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Product Afbeeldingen',
      admin: { description: 'Eerste afbeelding = hoofdafbeelding' },
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Product Videos',
      maxRows: 5,
      admin: { description: 'YouTube, Vimeo of directe video links' },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Video URL',
          admin: { placeholder: 'https://www.youtube.com/watch?v=...' },
        },
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          defaultValue: 'youtube',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Direct Link', value: 'custom' },
          ],
        },
      ],
    },
    {
      name: 'downloads',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Downloads',
      admin: { description: 'PDF datasheets, handleidingen, certificaten' },
      filterOptions: { mimeType: { contains: 'pdf' } },
    },
  ],
}
