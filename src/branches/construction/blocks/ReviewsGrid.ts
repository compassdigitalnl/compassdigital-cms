import type { Block } from 'payload'

export const ReviewsGrid: Block = {
  slug: 'reviews-grid',
  labels: {
    singular: 'Reviews Grid',
    plural: 'Reviews Grids',
  },
  interfaceName: 'ReviewsGridBlock',
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
            description: 'Kleine label boven de titel (bijv. "Testimonials")',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Wat onze klanten zeggen',
          admin: {
            description: 'Hoofdtitel van de sectie',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          admin: {
            description: 'Optionele beschrijving onder de titel',
            rows: 2,
          },
        },
      ],
    },
    {
      name: 'reviewsSource',
      type: 'radio',
      label: 'Reviews bron',
      required: true,
      defaultValue: 'featured',
      options: [
        {
          label: 'Alleen uitgelichte reviews',
          value: 'featured',
        },
        {
          label: 'Automatisch (alle gepubliceerde reviews)',
          value: 'auto',
        },
        {
          label: 'Handmatig selecteren',
          value: 'manual',
        },
      ],
      admin: {
        description: 'Hoe moeten reviews geselecteerd worden?',
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'construction-reviews',
      hasMany: true,
      label: 'Reviews',
      admin: {
        description: 'Selecteer specifieke reviews',
        condition: (data) => data.reviewsSource === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Aantal reviews',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximum aantal reviews om te tonen',
        condition: (data) => data.reviewsSource !== 'manual',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      defaultValue: '3',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
      ],
      admin: {
        description: 'Aantal kolommen in het grid (desktop)',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout stijl',
      defaultValue: 'cards',
      options: [
        { label: 'Kaarten', value: 'cards' },
        { label: 'Quotes', value: 'quotes' },
        { label: 'Compact', value: 'compact' },
      ],
      admin: {
        description: 'Visuele stijl van de reviews',
      },
    },
    {
      name: 'showRatings',
      type: 'checkbox',
      label: 'Toon sterren',
      defaultValue: true,
      admin: {
        description: 'Toon de sterren beoordeling',
      },
    },
    {
      name: 'showAvatars',
      type: 'checkbox',
      label: 'Toon avatars',
      defaultValue: true,
      admin: {
        description: 'Toon klant initialen als avatar',
      },
    },
    {
      name: 'averageRating',
      type: 'group',
      label: 'Gemiddelde score',
      admin: {
        description: 'Toon een prominente gemiddelde score sectie',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Toon gemiddelde score',
          defaultValue: false,
        },
        {
          name: 'position',
          type: 'select',
          label: 'Positie',
          defaultValue: 'top',
          options: [
            { label: 'Boven de reviews', value: 'top' },
            { label: 'Naast de reviews (links)', value: 'left' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
      ],
    },
  ],
}

export default ReviewsGrid
