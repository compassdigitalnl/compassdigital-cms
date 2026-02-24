import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

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
              label: 'Subtitle',
              admin: {
                description: 'Small overline text above the title (e.g., "Welkom bij...")',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              admin: {
                description: 'Main hero heading (H1)',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              editor: lexicalEditor({
                features: () => [ParagraphFeature(), BoldFeature(), ItalicFeature()],
              }),
              admin: {
                description: 'Supporting text below the title',
              },
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Call to Action Buttons',
              minRows: 1,
              maxRows: 3,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Text',
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
                    { label: 'Secondary (White outline)', value: 'secondary' },
                    { label: 'Ghost (Text only)', value: 'ghost' },
                  ],
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
              defaultValue: 'default',
              required: true,
              options: [
                { label: 'Default (Full-width, centered)', value: 'default' },
                { label: 'Split (Text left, image right)', value: 'split' },
                { label: 'Centered Compact', value: 'centered' },
              ],
              admin: {
                description: 'Choose how the hero is laid out',
              },
            },
            {
              name: 'backgroundStyle',
              type: 'select',
              label: 'Background Style',
              defaultValue: 'gradient',
              required: true,
              options: [
                { label: 'Gradient (Navy to Dark)', value: 'gradient' },
                { label: 'Solid Color', value: 'solid' },
                { label: 'Image', value: 'image' },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              label: 'Background Color',
              defaultValue: 'navy',
              options: [
                { label: 'Navy (Dark blue)', value: 'navy' },
                { label: 'White', value: 'white' },
                { label: 'Light Grey', value: 'bg' },
                { label: 'Teal', value: 'teal' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'solid',
                description: 'Only shown when Background Style is "Solid Color"',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'image',
                description: 'Only shown when Background Style is "Image"',
              },
            },
          ],
        },
      ],
    },
  ],
}
