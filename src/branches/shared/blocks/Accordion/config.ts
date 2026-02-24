import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  labels: {
    singular: 'Accordion Block',
    plural: 'Accordion Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title (optional)',
      admin: {
        description: 'Optional heading above the accordion items',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Accordion Items',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Item Title',
          required: true,
          admin: {
            description: 'The clickable heading for this accordion item',
          },
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Item Content',
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ParagraphFeature(),
              BoldFeature(),
              ItalicFeature(),
              LinkFeature(),
              UnorderedListFeature(),
              OrderedListFeature(),
            ],
          }),
          admin: {
            description: 'The content revealed when this item is expanded. Supports rich text formatting.',
          },
        },
      ],
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      label: 'Allow Multiple Open',
      defaultValue: false,
      admin: {
        description: 'If disabled, opening one item will automatically close others (single-open mode)',
      },
    },
  ],
}
