import type { Block } from 'payload'
import {
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Content Block',
    plural: 'Content Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ParagraphFeature(),
          HeadingFeature({
            enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'],
          }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            fields: [
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                options: [
                  { label: 'noopener', value: 'noopener' },
                  { label: 'noreferrer', value: 'noreferrer' },
                  { label: 'nofollow', value: 'nofollow' },
                ],
                hasMany: true,
              },
            ],
          }),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
      admin: {
        description:
          'Rich text editor with support for headings, lists, links, and text formatting.',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Max Width',
      defaultValue: 'narrow',
      options: [
        {
          label: 'Narrow (640px)',
          value: 'narrow',
        },
        {
          label: 'Wide (900px)',
          value: 'wide',
        },
        {
          label: 'Full (100%)',
          value: 'full',
        },
      ],
      admin: {
        description:
          'Controls the maximum width of the content container. Narrow for blog posts, wide for documentation, full for tables/galleries.',
      },
    },
  ],
}
