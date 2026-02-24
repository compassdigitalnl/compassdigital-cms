import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

/**
 * B04 - FAQ Block Configuration
 *
 * Accordion-style FAQ section with expandable answers.
 *
 * FEATURES:
 * - Plus icon rotates to X when open
 * - Rich text answers with Lexical editor
 * - Single or two-column layout
 * - Only one FAQ open at a time
 *
 * @see docs/refactoring/sprint-9/shared/b04-faq.html
 */

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
                description: 'Optional heading above FAQ items (DM Serif Display)',
                placeholder: 'Veelgestelde Vragen',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                description: 'Optional subheading text',
                rows: 2,
              },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'FAQ Items',
              minRows: 1,
              admin: {
                description: 'Add question/answer pairs. Click + icon expands to show answer.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                  admin: {
                    placeholder: 'Hoe werkt de multi-tenant architectuur?',
                  },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  label: 'Answer',
                  editor: lexicalEditor({
                    features: () => [
                      ParagraphFeature(),
                      BoldFeature(),
                      ItalicFeature(),
                      LinkFeature(),
                    ],
                  }),
                  admin: {
                    description: 'Full rich text support (bold, lists, links, etc.)',
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
              label: 'Layout Variant',
              defaultValue: 'single-column',
              options: [
                { label: 'Single Column', value: 'single-column' },
                { label: 'Two Column', value: 'two-column' },
              ],
              admin: {
                description: 'Single = vertical stack (max 720px). Two = side-by-side on desktop.',
              },
            },
          ],
        },
      ],
    },
  ],
}
