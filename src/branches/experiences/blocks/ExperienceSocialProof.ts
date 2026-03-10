import type { Block } from 'payload'

/**
 * Experience Social Proof Block
 *
 * Displays social proof elements: activity ticker, testimonials,
 * trust badges, and statistics.
 */
export const ExperienceSocialProof: Block = {
  slug: 'experience-social-proof',
  interfaceName: 'ExperienceSocialProofBlock',
  labels: {
    singular: 'Ervaringen Social Proof',
    plural: 'Ervaringen Social Proof',
  },
  fields: [
    {
      name: 'heading',
      type: 'group',
      label: 'Kopje',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          admin: {
            placeholder: 'Social Proof',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Wat anderen zeggen',
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistieken',
      maxRows: 4,
      admin: {
        description: 'Grote getallen met labels (bijv. "500+" → "Ervaringen")',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Waarde',
          admin: { placeholder: '500+' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: { placeholder: 'Ervaringen georganiseerd' },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Emoji/Icon',
          admin: { placeholder: '🎉' },
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      maxRows: 6,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Quote',
          admin: { rows: 2 },
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Auteur',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Rol / Bedrijf',
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Beoordeling',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar',
        },
      ],
    },
    {
      name: 'showActivityTicker',
      type: 'checkbox',
      label: 'Toon activiteiten ticker',
      defaultValue: false,
      admin: {
        description: 'Toon een live-achtige ticker met recente boekingen',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'cards',
      options: [
        { label: 'Kaarten', value: 'cards' },
        { label: 'Carrousel', value: 'carousel' },
        { label: 'Compact', value: 'compact' },
      ],
    },
  ],
}

export default ExperienceSocialProof
