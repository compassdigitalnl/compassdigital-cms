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
 * B-01 Hero Block
 *
 * Full-width hero section with rich text, CTA buttons, and flexible layouts.
 *
 * Variants: default (centered full-width), split (text+image grid), centered (compact)
 * Background: gradient (navy/teal glow), image (with dark overlay), solid color
 */
export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle (Overline)',
              admin: {
                description: 'Optional small text above the main title (e.g., "Welkom bij Compass")',
                placeholder: 'Welkom bij...',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Main Title',
              required: true,
              admin: {
                description: 'Primary heading (H1). Keep under 60 characters for readability.',
                placeholder: 'Jouw hoofdtitel hier...',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              editor: lexicalEditor({
                features: () => [
                  ParagraphFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  LinkFeature(),
                ],
              }),
              admin: {
                description: 'Supporting text with rich formatting (paragraphs, bold, italic, links)',
              },
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Call-to-Action Buttons',
              maxRows: 3,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Label',
                  required: true,
                  admin: {
                    placeholder: 'Neem contact op',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Button Link',
                  required: true,
                  admin: {
                    description: 'URL or path (e.g., /contact or https://example.com)',
                    placeholder: '/contact',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Button Style',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Teal)', value: 'primary' },
                    { label: 'Secondary (Outlined)', value: 'secondary' },
                    { label: 'Ghost (Text Link)', value: 'ghost' },
                  ],
                },
              ],
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Image',
              admin: {
                description: 'Image shown in the split variant (right column). Recommended: 800x600px.',
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
              defaultValue: 'default',
              options: [
                { label: 'Default (Centered, Full-Width)', value: 'default' },
                { label: 'Split (Text Left, Image Right)', value: 'split' },
                { label: 'Centered Compact', value: 'centered' },
              ],
              admin: {
                description: 'Choose hero layout style',
              },
            },
            {
              name: 'backgroundStyle',
              type: 'select',
              label: 'Background Style',
              defaultValue: 'gradient',
              options: [
                { label: 'Gradient (Navy with Teal Glow)', value: 'gradient' },
                { label: 'Image', value: 'image' },
                { label: 'Solid Color', value: 'solid' },
              ],
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'image',
                description: 'Recommended: 1920x1080px, WebP format, < 200KB',
              },
            },
            {
              name: 'backgroundColor',
              type: 'select',
              label: 'Background Color',
              defaultValue: 'navy',
              options: [
                { label: 'Navy', value: 'navy' },
                { label: 'White', value: 'white' },
                { label: 'Light Gray', value: 'bg' },
                { label: 'Teal', value: 'teal' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'solid',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
