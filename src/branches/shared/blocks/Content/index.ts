import type { Block } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  ParagraphFeature,
  LinkFeature,
  HeadingFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
} from '@payloadcms/richtext-lexical'
import { animationFields } from '../_shared/animationFields'

/**
 * B-07 Content Block
 *
 * Rich text content area with full Lexical editor support.
 *
 * Width options:
 * - narrow: max-w-2xl (optimal reading width, 45-75 chars per line)
 * - wide: max-w-5xl
 * - full: max-w-full
 */
export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Content Block',
    plural: 'Content Blocks',
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
              required: true,
              label: 'Rich Text Content',
              editor: lexicalEditor({
                features: () => [
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                  ParagraphFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  LinkFeature({
                    fields: [
                      {
                        name: 'rel',
                        type: 'select',
                        label: 'Link Relation',
                        hasMany: true,
                        options: [
                          { label: 'No Opener (Security)', value: 'noopener' },
                          { label: 'No Referrer (Privacy)', value: 'noreferrer' },
                          { label: 'No Follow (SEO)', value: 'nofollow' },
                        ],
                        admin: {
                          description: 'SEO and security attributes for external links',
                        },
                      },
                    ],
                  }),
                  UnorderedListFeature(),
                  OrderedListFeature(),
                  BlockquoteFeature(),
                ],
              }),
              admin: {
                description:
                  'Volledige rich text editor met koppen, lijsten, links, citaten en meer',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'width',
              type: 'select',
              label: 'Content breedte',
              defaultValue: 'narrow',
              options: [
                { label: 'Smal (640px - optimaal leesbaar)', value: 'narrow' },
                { label: 'Breed (1024px)', value: 'wide' },
                { label: 'Volledig (100%)', value: 'full' },
              ],
              admin: {
                description: 'Smal = optimale leesbreedte (45-75 tekens per regel)',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
