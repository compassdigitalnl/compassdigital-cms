import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'gallery',
  interfaceName: 'ImageGalleryBlock',
  labels: {
    singular: 'Image Gallery Block',
    plural: 'Image Gallery Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Gallery Title (optional)',
      admin: {
        description: 'Optional heading above the gallery',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
      maxRows: 50,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
          admin: {
            description: 'Upload an image file (JPG, PNG, WebP recommended)',
          },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (optional)',
          admin: {
            description: 'Text displayed when hovering over or viewing the image in lightbox',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          label: 'Columns',
          defaultValue: '3',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          admin: {
            width: '50%',
            description: 'Number of columns in the gallery grid',
          },
        },
        {
          name: 'aspectRatio',
          type: 'select',
          label: 'Aspect Ratio',
          defaultValue: '4-3',
          options: [
            { label: '16:9 (Landscape)', value: '16-9' },
            { label: '4:3 (Standard)', value: '4-3' },
            { label: '1:1 (Square)', value: '1-1' },
            { label: 'Auto (Original)', value: 'auto' },
          ],
          admin: {
            width: '50%',
            description: 'Aspect ratio for image containers. "Auto" preserves original dimensions.',
          },
        },
      ],
    },
    {
      name: 'enableLightbox',
      type: 'checkbox',
      label: 'Enable Lightbox',
      defaultValue: true,
      admin: {
        description: 'Allow users to click images to view them in a full-screen lightbox',
      },
    },
  ],
}
