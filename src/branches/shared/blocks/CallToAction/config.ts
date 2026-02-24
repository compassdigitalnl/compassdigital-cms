import type { Block } from 'payload'

/**
 * B30 - CallToAction (Inline) Block Configuration
 *
 * Compact, inline CTA for mid-page conversions.
 *
 * FEATURES:
 * - Simple centered design (title + description + 1 button)
 * - 3 background variants (white, grey, teal)
 * - Non-invasive, soft CTAs for content breaks
 * - Single focus button (vs. B03 with 2 buttons)
 * - Responsive with hover effects
 *
 * USE CASES:
 * - After features sections (soft nudge)
 * - Between blog content (download guide, newsletter)
 * - Alternative actions (contact us if unsure)
 * - Max 1-2x per page (too many dilutes conversion)
 *
 * DIFFERENCE FROM B03 (CTA Block):
 * - B30 = Mid-page, 1 button, subtle, soft CTAs
 * - B03 = Page-ending, 2 buttons, dramatic, final push
 *
 * @see docs/refactoring/sprint-10/b30-calltoaction.html
 */

export const CallToAction: Block = {
  slug: 'calltoaction',
  interfaceName: 'CallToActionBlock',
  labels: {
    singular: 'Call to Action (Inline)',
    plural: 'Calls to Action (Inline)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description: 'CTA headline (3-8 words). Use active language (e.g., "Ready to get started?")',
        placeholder: 'Klaar om te starten?',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional supporting text (1-2 sentences, max 120 characters)',
        placeholder: 'Ontdek hoe 2000+ bedrijven hun sales verbeteren met ons platform.',
        rows: 2,
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
      required: true,
      admin: {
        description: 'Button text (2-4 words). Use first person (e.g., "Start mijn trial" > "Start trial")',
        placeholder: 'Bekijk casestudies',
      },
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Button Link',
      required: true,
      admin: {
        description: 'URL or path for the button (e.g., /contact or https://example.com)',
        placeholder: '/contact',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'grey',
      options: [
        {
          label: 'White (for colored backgrounds)',
          value: 'white',
        },
        {
          label: 'Grey (subtle, default)',
          value: 'grey',
        },
        {
          label: 'Teal (high-priority CTAs)',
          value: 'teal',
        },
      ],
      admin: {
        description: 'Grey = default (subtle), Teal = high-priority (extra attention)',
      },
    },
  ],
}
