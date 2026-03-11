import type { Block } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  ParagraphFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'
import { animationFields } from '../_shared/animationFields'

/**
 * B-08 Accordion Block
 *
 * Generic accordion with rich text content per item.
 * More flexible than the FAQ block (rich text content vs. plain question/answer).
 *
 * Variants:
 * - simple: divider lines between items
 * - bordered: border around each item
 * - separated: gap between items with card styling
 */
export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  labels: {
    singular: 'Accordion Block',
    plural: 'Accordion Blocks',
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
                description: 'Optionele koptekst boven de accordion',
                placeholder: 'Meer informatie',
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
                  required: true,
                  label: 'Titel',
                  admin: {
                    description: 'De klikbare koptekst van dit accordion item',
                    placeholder: 'Klik hier om meer te lezen',
                  },
                },
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                  label: 'Inhoud',
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
                    description: 'De inhoud die zichtbaar wordt wanneer het item geopend is',
                  },
                },
                {
                  name: 'defaultOpen',
                  type: 'checkbox',
                  label: 'Standaard geopend',
                  defaultValue: false,
                  admin: {
                    description: 'Dit item is standaard geopend wanneer de pagina laadt',
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
                { label: 'Simpel (scheidingslijnen)', value: 'simple' },
                { label: 'Omlijnd (rand per item)', value: 'bordered' },
                { label: 'Gescheiden (kaarten met tussenruimte)', value: 'separated' },
              ],
              admin: {
                description: 'Visuele stijl van de accordion items',
              },
            },
            {
              name: 'allowMultiple',
              type: 'checkbox',
              label: 'Meerdere open tegelijk',
              defaultValue: false,
              admin: {
                description:
                  'Indien uitgeschakeld, wordt een item automatisch gesloten wanneer een ander wordt geopend',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
