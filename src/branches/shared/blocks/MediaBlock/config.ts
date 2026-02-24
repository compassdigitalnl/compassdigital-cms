import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const MediaBlock: Block = {
  slug: 'media',
  interfaceName: 'MediaBlock',
  labels: {
    singular: 'Media Block',
    plural: 'Media Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          label: 'Media Type',
          defaultValue: 'image',
          options: [
            {
              label: 'Image',
              value: 'image',
            },
            {
              label: 'Video',
              value: 'video',
            },
          ],
          admin: {
            width: '50%',
            description: 'Choose whether to display an image or video',
          },
        },
        {
          name: 'mediaPosition',
          type: 'select',
          label: 'Media Position',
          defaultValue: 'left',
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
          admin: {
            width: '50%',
            description: 'Position of media relative to text content',
          },
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      label: 'Media',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Upload an image or video file. For videos, use MP4 format for best compatibility.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL (optional)',
      admin: {
        description:
          'YouTube or Vimeo embed URL. If provided, this will be used instead of uploaded video file.',
        condition: (data, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'split',
      type: 'select',
      label: 'Column Split',
      defaultValue: '50-50',
      options: [
        {
          label: '50/50 (Equal)',
          value: '50-50',
        },
        {
          label: '60/40 (Text wider)',
          value: '60-40',
        },
        {
          label: '40/60 (Media wider)',
          value: '40-60',
        },
      ],
      admin: {
        description: 'Controls the width ratio between media and text columns',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle (optional)',
      admin: {
        description: 'Small text above title (e.g., "Video Tour", "Product Showcase")',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description: 'Main heading for this section',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature(),
          UnorderedListFeature(),
        ],
      }),
      admin: {
        description:
          'Text content displayed next to media. Supports paragraphs, bold, italic, links, and lists.',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      maxRows: 2,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary (theme.colors.teal)', value: 'primary' },
                { label: 'Secondary (theme.colors.navy)', value: 'secondary' },
                { label: 'Outline (theme.colors.grey)', value: 'outline' },
                { label: 'Success (theme.colors.green)', value: 'success' },
                { label: 'Danger (theme.colors.coral)', value: 'danger' },
              ],
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Link URL (e.g., "/contact", "https://example.com")',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'white',
      options: [
        { label: 'White (theme.colors.white)', value: 'white' },
        { label: 'Light Background (theme.colors.bg)', value: 'bg' },
        { label: 'Light Grey (theme.colors.grey)', value: 'grey' },
        { label: 'Teal Light (theme.colors.tealLight)', value: 'tealLight' },
        { label: 'Teal Glow (subtle teal bg)', value: 'tealGlow' },
        { label: 'Navy (theme.colors.navy)', value: 'navy' },
        { label: 'Navy Light (theme.colors.navyLight)', value: 'navyLight' },
      ],
      admin: {
        description:
          'Background color from Theme global. Maps to CSS variables: --color-white, --color-bg, etc.',
      },
    },
  ],
}
