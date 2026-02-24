import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
  InlineCodeFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * B05 - Content Block Configuration
 *
 * Rich text content area powered by Payload Lexical editor.
 *
 * FEATURES:
 * - Full Lexical editor support
 * - Headings (H2-H4)
 * - Text formatting (bold, italic, underline, strikethrough)
 * - Lists (ordered, unordered)
 * - Links, blockquotes, code blocks
 * - 3 width variants (narrow, wide, full)
 *
 * @see docs/refactoring/sprint-9/shared/b05-content.html
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
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                  LinkFeature({
                    fields: [
                      {
                        name: 'rel',
                        type: 'select',
                        label: 'Link Relation',
                        hasMany: true,
                        options: [
                          {
                            label: 'No Opener (Security)',
                            value: 'noopener',
                          },
                          {
                            label: 'No Referrer (Privacy)',
                            value: 'noreferrer',
                          },
                          {
                            label: 'No Follow (SEO)',
                            value: 'nofollow',
                          },
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
                  InlineCodeFeature(),
                  // CodeBlockFeature not available in @payloadcms/richtext-lexical
                ],
              }),
              admin: {
                description: 'Full rich text editor with all Lexical features',
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
              options: [
                { label: 'Narrow (640px - Best for Reading)', value: 'narrow' },
                { label: 'Wide (900px)', value: 'wide' },
                { label: 'Full (100%)', value: 'full' },
              ],
              admin: {
                description: 'Narrow = optimal reading width (45-75 characters per line)',
              },
            },
          ],
        },
      ],
    },
  ],
}
