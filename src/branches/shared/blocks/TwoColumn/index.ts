import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { animationFields } from '../_shared/animationFields'

/**
 * B-02 Two Column Block
 *
 * Flexible two-column layout with rich text and optional image.
 *
 * Variants: text-text (both rich text), text-image, image-text
 * Gap sizes: sm (16px), md (32px), lg (48px)
 */
export const TwoColumn: Block = {
  slug: 'twoColumn',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Two Column Block',
    plural: 'Two Column Blocks',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'leftColumn',
              type: 'richText',
              label: 'Left Column',
              required: true,
              editor: lexicalEditor({
                features: () => [
                  ParagraphFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  LinkFeature(),
                ],
              }),
              admin: {
                description: 'Content for the left column (or the text column in text-image variants)',
              },
            },
            {
              name: 'rightColumn',
              type: 'richText',
              label: 'Right Column',
              editor: lexicalEditor({
                features: () => [
                  ParagraphFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  LinkFeature(),
                ],
              }),
              admin: {
                description: 'Content for the right column (used in text-text variant)',
                condition: (data, siblingData) => {
                  const variant = siblingData?.variant
                  return !variant || variant === 'text-text'
                },
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Column Image',
              admin: {
                description: 'Image for text-image or image-text variants. Recommended: 800x600px.',
                condition: (data, siblingData) => {
                  const variant = siblingData?.variant
                  return variant === 'text-image' || variant === 'image-text'
                },
              },
            },
            {
              name: 'imagePosition',
              type: 'select',
              label: 'Image Position',
              defaultValue: 'right',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                description: 'Which side of the grid the image appears on',
                condition: (data, siblingData) => {
                  const variant = siblingData?.variant
                  return variant === 'text-image' || variant === 'image-text'
                },
              },
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
              defaultValue: 'text-text',
              options: [
                { label: 'Text + Text', value: 'text-text' },
                { label: 'Text + Image', value: 'text-image' },
                { label: 'Image + Text', value: 'image-text' },
              ],
              admin: {
                description: 'Choose the column content type combination',
              },
            },
            {
              name: 'gap',
              type: 'select',
              label: 'Column Gap',
              defaultValue: 'md',
              options: [
                { label: 'Small (16px)', value: 'sm' },
                { label: 'Medium (32px)', value: 'md' },
                { label: 'Large (48px)', value: 'lg' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
