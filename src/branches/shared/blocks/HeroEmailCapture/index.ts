import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-01d Hero Email Capture Block
 *
 * Hero variant with an integrated email signup form for lead generation.
 *
 * Variants:
 * - centered: Dark navy gradient, full centered content with email form
 * - split: Light bg, left text + form, right image
 * - compact: Teal gradient, horizontal inline layout
 */
export const HeroEmailCapture: Block = {
  slug: 'heroEmailCapture',
  interfaceName: 'HeroEmailCaptureBlock',
  labels: {
    singular: 'Hero Email Capture',
    plural: 'Hero Email Captures',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'badge',
              type: 'text',
              label: 'Badge',
              admin: {
                description: 'Optional small badge text above the title',
                placeholder: 'Nieuw platform gelanceerd',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Main Title',
              required: true,
              admin: {
                description: 'Primary heading. Keep under 60 characters for readability.',
                placeholder: 'Bouw iets bijzonders',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                description: 'Supporting text below the title',
                rows: 2,
              },
            },
            {
              name: 'formLabel',
              type: 'text',
              label: 'Email Placeholder Text',
              defaultValue: 'Vul je e-mailadres in',
              admin: {
                description: 'Placeholder text shown inside the email input',
              },
            },
            {
              name: 'submitButtonText',
              type: 'text',
              label: 'Submit Button Text',
              defaultValue: 'Aan de slag',
              admin: {
                description: 'Text on the submit button',
              },
            },
            {
              name: 'trustItems',
              type: 'array',
              label: 'Trust Items',
              maxRows: 3,
              admin: {
                description: 'Small trust indicators shown below the form (max 3)',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Shield Check', value: 'shield-check' },
                    { label: 'Users', value: 'users' },
                    { label: 'Star', value: 'star' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Heart', value: 'heart' },
                  ],
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
                  admin: {
                    placeholder: 'Geen spam, ooit',
                  },
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
              defaultValue: 'centered',
              options: [
                { label: 'Centered (Dark Navy Gradient)', value: 'centered' },
                { label: 'Split (Text Left, Image Right)', value: 'split' },
                { label: 'Compact (Teal Gradient, Inline)', value: 'compact' },
              ],
              admin: {
                description:
                  'Centered: dark navy gradient, full centered content. Split: light bg, left text + form, right image. Compact: teal gradient, horizontal inline layout.',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
