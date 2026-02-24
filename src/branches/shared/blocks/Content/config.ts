import type { Block } from 'payload'
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Rich Text Content',
    plural: 'Rich Text Content',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'Content',
              required: true,
              editor: lexicalEditor({
                features: () => [
                  ParagraphFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                  LinkFeature(),
                  UnorderedListFeature(),
                  OrderedListFeature(),
                  BlockquoteFeature(),
                  InlineCodeFeature(),
                ],
              }),
              admin: {
                description: 'Full rich text editor with all formatting options',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'maxWidth',
              type: 'select',
              label: 'Content Width',
              defaultValue: 'narrow',
              required: true,
              options: [
                { label: 'Narrow (640px - optimal for reading)', value: 'narrow' },
                { label: 'Wide (900px)', value: 'wide' },
                { label: 'Full Width (100%)', value: 'full' },
              ],
              admin: {
                description: 'Maximum width of the content container',
              },
            },
          ],
        },
      ],
    },
  ],
}
