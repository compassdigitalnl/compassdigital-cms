import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-04 CTA (Call to Action) Block
 *
 * Prominent call-to-action section with flexible layouts and background styles.
 *
 * Variants: centered (text centered), split (text left, buttons right), banner (full-width)
 * Background: gradient (navy/teal glow), solid (color), image (with overlay)
 */
export const CTA: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
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
              label: 'Title',
              required: true,
              admin: {
                description: 'Main CTA headline',
                placeholder: 'Klaar om aan de slag te gaan?',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                rows: 2,
                description: 'Supporting text below the title',
                placeholder: 'Neem vandaag nog contact op en ontdek de mogelijkheden.',
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
                    { label: 'Secondary (Outlined)', value: 'secondary' },
                    { label: 'Ghost (Text only)', value: 'ghost' },
                  ],
                },
              ],
            },
            {
              name: 'badge',
              type: 'text',
              label: 'Badge',
              admin: {
                description: 'Small label shown above the title (optional)',
                placeholder: 'bijv. Gratis consult',
              },
            },
            {
              name: 'trustElements',
              type: 'group',
              label: 'Trust Elementen',
              admin: {
                description: 'Vertrouwensindicatoren onder de buttons',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Toon trust elementen',
                  defaultValue: false,
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Items',
                  maxRows: 3,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'icon',
                      type: 'text',
                      label: 'Lucide Icon Name',
                      admin: {
                        placeholder: 'check',
                        description: 'Lucide icon naam (bijv. "Check", "ShieldCheck", "Clock")',
                      },
                    },
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Tekst',
                      required: true,
                      admin: {
                        placeholder: '24/7 bereikbaar',
                      },
                    },
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
              defaultValue: 'centered',
              options: [
                { label: 'Centered (Text centered)', value: 'centered' },
                { label: 'Split (Text left, CTA right)', value: 'split' },
                { label: 'Banner (Full-width colored)', value: 'banner' },
              ],
              admin: {
                description: 'Choose the CTA layout style',
              },
            },
            {
              name: 'backgroundStyle',
              type: 'select',
              label: 'Background Style',
              defaultValue: 'gradient',
              options: [
                { label: 'Gradient (Navy with Teal Glow)', value: 'gradient' },
                { label: 'Solid Color', value: 'solid' },
                { label: 'Image', value: 'image' },
              ],
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'image',
                description: 'Recommended: 1920x600px, WebP format, < 200KB',
              },
            },
            {
              name: 'size',
              type: 'select',
              label: 'Formaat',
              defaultValue: 'medium',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ],
              admin: {
                description: 'Formaat van de CTA sectie',
              },
            },
            {
              name: 'alignment',
              type: 'select',
              label: 'Uitlijning',
              defaultValue: 'center',
              options: [
                { label: 'Gecentreerd', value: 'center' },
                { label: 'Links', value: 'left' },
              ],
              admin: {
                description: 'Tekst uitlijning (niet beschikbaar bij split variant)',
                condition: (data, siblingData) => siblingData?.variant !== 'split',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
