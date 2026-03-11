import type { Block } from 'payload'

/**
 * Professional Services Hero Block
 *
 * Hero section specifically for professional services / zakelijke dienstverlening websites.
 * Features:
 * - Large hero title with highlight
 * - Trust badge (e.g., "200+ tevreden bedrijven")
 * - Description text
 * - Dual CTAs (primary + secondary)
 * - Trust avatars with testimonial count
 * - Optional hero image/visual
 *
 * Based on: ConstructionHero block pattern
 */
export const ProfessionalHero: Block = {
  slug: 'professional-hero',
  labels: {
    singular: 'Dienstverlening Hero',
    plural: 'Dienstverlening Hero Secties',
  },
  interfaceName: 'ProfessionalHeroBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge tekst',
          admin: {
            description: 'Bijv. "Uw betrouwbare zakelijke partner"',
            width: '50%',
          },
        },
        {
          name: 'badgeIcon',
          type: 'text',
          label: 'Badge icon',
          admin: {
            description: 'Lucide icon naam (bijv. "briefcase")',
            width: '50%',
          },
          defaultValue: 'briefcase',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Hoofdtitel',
      defaultValue: 'Uw betrouwbare zakelijke partner',
      admin: {
        description: 'Grote hero titel. Gebruik {highlight}tekst{/highlight} voor gemarkeerde woorden',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Omschrijving',
      admin: {
        description: 'Hero beschrijving (max ~150 woorden)',
        rows: 3,
      },
    },
    {
      type: 'collapsible',
      label: 'Call-to-Actions',
      fields: [
        {
          name: 'primaryCTA',
          type: 'group',
          label: 'Primaire CTA',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Tekst',
                  defaultValue: 'Plan een adviesgesprek',
                  admin: { width: '50%' },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  defaultValue: 'calendar',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              label: 'Link',
              defaultValue: '/adviesgesprek-aanvragen',
            },
          ],
        },
        {
          name: 'secondaryCTA',
          type: 'group',
          label: 'Secundaire CTA (optioneel)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Tekst',
                  defaultValue: 'Bekijk onze cases',
                  admin: { width: '50%' },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  defaultValue: 'play-circle',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              defaultValue: '/cases',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Trust Element',
      admin: {
        description: 'Social proof met avatars en statistiek',
      },
      fields: [
        {
          name: 'trustText',
          type: 'text',
          label: 'Trust tekst',
          defaultValue: '200+ tevreden bedrijven',
          admin: {
            description: 'Bijv. "200+ tevreden bedrijven"',
          },
        },
        {
          name: 'trustSubtext',
          type: 'text',
          label: 'Subtekst',
          defaultValue: 'Gemiddeld 4.9/5 beoordeeld',
          admin: {
            description: 'Bijv. "Gemiddeld 4.9/5 beoordeeld"',
          },
        },
        {
          name: 'avatars',
          type: 'array',
          label: 'Avatars',
          maxRows: 4,
          admin: {
            description: 'Max 4 avatars (daarna wordt "+X" getoond)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'initials',
                  type: 'text',
                  required: true,
                  label: 'Initialen',
                  maxLength: 3,
                  admin: {
                    description: 'Bijv. "JD"',
                    width: '50%',
                  },
                },
                {
                  name: 'color',
                  type: 'select',
                  label: 'Kleur',
                  options: [
                    { label: 'Teal', value: 'teal' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Purple', value: 'purple' },
                    { label: 'Amber', value: 'amber' },
                  ],
                  defaultValue: 'teal',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hero Visual',
      admin: {
        description: 'Optionele afbeelding of visual aan de rechterkant',
      },
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero afbeelding',
          admin: {
            description: 'Optioneel - laat leeg voor emoji placeholder',
          },
        },
        {
          name: 'heroEmoji',
          type: 'text',
          label: 'Emoji placeholder',
          defaultValue: '\u{1F4BC}',
          admin: {
            description: 'Wordt gebruikt als er geen afbeelding is',
            condition: (data) => !data.heroImage,
          },
        },
        {
          name: 'floatingBadges',
          type: 'array',
          label: 'Floating badges',
          maxRows: 2,
          admin: {
            description: 'Max 2 floating badges (bijv. "15 jaar ervaring", "4.9/5 rating")',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titel',
                  admin: { width: '40%' },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitel',
                  admin: { width: '30%' },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: { width: '30%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'color',
                  type: 'select',
                  label: 'Kleur',
                  options: [
                    { label: 'Green', value: 'green' },
                    { label: 'Amber', value: 'amber' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Teal', value: 'teal' },
                  ],
                  defaultValue: 'blue',
                  admin: { width: '50%' },
                },
                {
                  name: 'position',
                  type: 'select',
                  label: 'Positie',
                  options: [
                    { label: 'Linksonder', value: 'bottom-left' },
                    { label: 'Rechtsboven', value: 'top-right' },
                  ],
                  defaultValue: 'bottom-left',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default ProfessionalHero
