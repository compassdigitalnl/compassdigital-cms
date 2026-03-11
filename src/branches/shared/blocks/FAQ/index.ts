import type { Block } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  ParagraphFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { animationFields } from '../_shared/animationFields'

/**
 * B-05 FAQ Block
 *
 * Accordion-style FAQ section with expandable question/answer pairs.
 *
 * Variants:
 * - simple: minimal borders between items
 * - bordered: card-style border around each item
 * - colored: alternating background colors
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
              label: 'Titel',
              admin: {
                description: 'Optionele koptekst boven de FAQ items',
                placeholder: 'Veelgestelde Vragen',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                description: 'Optionele subtekst onder de titel',
                placeholder: 'Hier vindt u antwoord op de meest gestelde vragen',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'FAQ Items',
              minRows: 1,
              admin: {
                description: 'Vraag/antwoord paren. Klik op + om een nieuwe vraag toe te voegen.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Vraag',
                  admin: {
                    placeholder: 'Hoe werkt de bestelprocedure?',
                  },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  label: 'Antwoord',
                  editor: lexicalEditor({
                    features: () => [
                      ParagraphFeature(),
                      BoldFeature(),
                      ItalicFeature(),
                      LinkFeature(),
                    ],
                  }),
                  admin: {
                    description: 'Rich text antwoord (vet, cursief, links)',
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
              label: 'Stijl variant',
              defaultValue: 'simple',
              options: [
                { label: 'Simpel (minimale lijnen)', value: 'simple' },
                { label: 'Omlijnd (kaart per item)', value: 'bordered' },
                { label: 'Gekleurd (wisselende achtergrond)', value: 'colored' },
              ],
              admin: {
                description: 'Visuele stijl van de FAQ items',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
