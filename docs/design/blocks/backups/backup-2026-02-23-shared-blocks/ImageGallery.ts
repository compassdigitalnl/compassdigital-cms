import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: {
    singular: 'Afbeeldingen Gallerij',
    plural: 'Afbeeldingen Gallerijen',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Afbeeldingen',
      labels: {
        singular: 'Afbeelding',
        plural: 'Afbeeldingen',
      },
      minRows: 1,
      maxRows: 50,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Afbeelding',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Bijschrift (optioneel)',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (uniform)', value: 'grid' },
        { label: 'Masonry (Pinterest-stijl)', value: 'masonry' },
        { label: 'Carousel (scrollend)', value: 'carousel' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Aantal kolommen',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: {
        condition: (data, siblingData) => ['grid', 'masonry'].includes(siblingData?.layout),
      },
    },
  ],
}
