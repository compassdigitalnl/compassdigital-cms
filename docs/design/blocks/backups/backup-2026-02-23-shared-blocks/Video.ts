import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: {
    singular: 'Video',
    plural: 'Video\'s',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel (optioneel)',
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      label: 'Video URL',
      admin: {
        description: 'YouTube, Vimeo of directe video link',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Poster afbeelding',
      admin: {
        description: 'Thumbnail die getoond wordt voordat de video wordt afgespeeld',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect ratio',
      defaultValue: '16-9',
      options: [
        { label: '16:9 (standaard)', value: '16-9' },
        { label: '4:3', value: '4-3' },
        { label: '1:1 (vierkant)', value: '1-1' },
        { label: '21:9 (ultrawide)', value: '21-9' },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: false,
      admin: {
        description: 'Let op: veel browsers blokkeren autoplay met geluid',
      },
    },
  ],
}
