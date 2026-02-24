import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              admin: {
                description: 'Optional heading (e.g., "Frequently Asked Questions")',
                placeholder: 'Veelgestelde vragen',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                rows: 2,
                description: 'Optional introduction text',
              },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Questions & Answers',
              minRows: 1,
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Question',
                  required: true,
                  admin: {
                    placeholder: 'Wat zijn de leveringskosten?',
                  },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  label: 'Answer',
                  required: true,
                  editor: lexicalEditor({
                    features: () => [
                      ParagraphFeature(),
                      BoldFeature(),
                      ItalicFeature(),
                      LinkFeature(),
                      UnorderedListFeature(),
                      OrderedListFeature(),
                    ],
                  }),
                  admin: {
                    description: 'Rich text answer with formatting options',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout',
              defaultValue: 'single-column',
              required: true,
              options: [
                { label: 'Single Column (Stacked)', value: 'single-column' },
                { label: 'Two Columns (Side by side)', value: 'two-column' },
              ],
              admin: {
                description: 'Choose how FAQs are displayed',
              },
            },
          ],
        },
      ],
    },
  ],
}
