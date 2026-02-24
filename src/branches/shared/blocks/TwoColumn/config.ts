import type { Block } from 'payload'
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const TwoColumn: Block = {
  slug: 'twoColumn',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Two Column Block',
    plural: 'Two Column Blocks',
  },
  fields: [
    {
      name: 'split',
      type: 'select',
      label: 'Column Split Ratio',
      defaultValue: '50-50',
      options: [
        {
          label: '50/50 — Equal columns',
          value: '50-50',
        },
        {
          label: '60/40 — Left wider',
          value: '60-40',
        },
        {
          label: '40/60 — Right wider',
          value: '40-60',
        },
      ],
      admin: {
        description:
          'Controls the width ratio between the two columns. 50/50 for equal width, 60/40 for left emphasis, 40/60 for right emphasis.',
      },
    },
    {
      name: 'columnOne',
      type: 'richText',
      label: 'Column One (Left)',
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
          StrikethroughFeature(),
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
          BlockquoteFeature(),
        ],
      }),
      admin: {
        description: 'Content for the left column. Supports headings, lists, links, and text formatting.',
      },
    },
    {
      name: 'columnTwo',
      type: 'richText',
      label: 'Column Two (Right)',
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
          StrikethroughFeature(),
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
          BlockquoteFeature(),
        ],
      }),
      admin: {
        description: 'Content for the right column. Supports headings, lists, links, and text formatting.',
      },
    },
  ],
}
