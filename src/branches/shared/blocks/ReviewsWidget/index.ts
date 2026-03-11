import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-39 ReviewsWidget Block
 *
 * Detailed product/service reviews with rating distribution bars,
 * average score, and individual review cards.
 * Supports manual reviews, collection-based reviews, or auto-fetch.
 */
export const ReviewsWidget: Block = {
  slug: 'reviewsWidget',
  interfaceName: 'ReviewsWidgetBlock',
  labels: {
    singular: 'Reviews Widget',
    plural: 'Reviews Widgets',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            // === Heading Group ===
            {
              name: 'heading',
              type: 'group',
              label: 'Koptekst',
              admin: {
                description: 'Optionele koptekst boven de reviews',
              },
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge',
                  admin: {
                    placeholder: 'Klantbeoordelingen',
                    description: 'Kleine pill-badge boven de titel',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titel',
                  admin: {
                    placeholder: 'Wat onze klanten zeggen',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  admin: {
                    rows: 2,
                    placeholder: 'Lees de ervaringen van onze klanten',
                  },
                },
              ],
            },

            // === Source ===
            {
              name: 'source',
              type: 'select',
              label: 'Bron',
              defaultValue: 'manual',
              options: [
                { label: 'Handmatig invoeren', value: 'manual' },
                { label: 'Uit collectie (selectie)', value: 'collection' },
                { label: 'Automatisch ophalen', value: 'auto' },
              ],
              admin: {
                description:
                  'Handmatig invoeren, specifieke reviews selecteren, of automatisch alle gepubliceerde reviews ophalen',
              },
            },

            // === Collection Source (for collection + auto) ===
            {
              name: 'collectionSource',
              type: 'select',
              label: 'Collectie',
              defaultValue: 'product-reviews',
              options: [
                { label: 'Product Reviews', value: 'product-reviews' },
                { label: 'Bouw Reviews', value: 'construction-reviews' },
                { label: 'Ervaring Reviews', value: 'experience-reviews' },
              ],
              admin: {
                description: 'Uit welke review-collectie ophalen',
                condition: (_data, siblingData) =>
                  siblingData?.source === 'collection' || siblingData?.source === 'auto',
              },
            },

            // === Limit (for auto) ===
            {
              name: 'limit',
              type: 'number',
              label: 'Maximum aantal',
              defaultValue: 6,
              min: 1,
              max: 20,
              admin: {
                description: 'Maximaal aantal reviews om op te halen',
                step: 1,
                condition: (_data, siblingData) => siblingData?.source === 'auto',
              },
            },

            // === Manual Reviews ===
            {
              name: 'reviews',
              type: 'array',
              label: 'Reviews',
              minRows: 1,
              admin: {
                description: 'Handmatig ingevoerde reviews',
                condition: (_data, siblingData) => siblingData?.source === 'manual',
              },
              fields: [
                {
                  name: 'reviewer',
                  type: 'text',
                  label: 'Naam reviewer',
                  admin: {
                    placeholder: 'Jan de Vries',
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Beoordeling (1-5)',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                  admin: {
                    step: 1,
                  },
                },
                {
                  name: 'text',
                  type: 'textarea',
                  label: 'Review tekst',
                  admin: {
                    rows: 3,
                    placeholder: 'Uitstekende service en snelle levering...',
                  },
                },
                {
                  name: 'date',
                  type: 'text',
                  label: 'Datum',
                  admin: {
                    placeholder: '15 maart 2026',
                    description: 'Datum van de review (vrij formaat)',
                  },
                },
              ],
            },

            // === Collection relationship (for collection source) ===
            {
              name: 'collection',
              type: 'relationship',
              relationTo: 'product-reviews',
              label: 'Review collectie',
              hasMany: true,
              admin: {
                description: 'Selecteer reviews uit de product-reviews collectie',
                condition: (_data, siblingData) => siblingData?.source === 'collection',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'cards',
              options: [
                { label: 'Kaarten', value: 'cards' },
                { label: 'Quotes (minimaal)', value: 'quotes' },
                { label: 'Compact', value: 'compact' },
              ],
              admin: {
                description: 'Weergavestijl van de individuele reviews',
              },
            },
            {
              name: 'columns',
              type: 'select',
              label: 'Kolommen',
              defaultValue: '2',
              options: [
                { label: '2 kolommen', value: '2' },
                { label: '3 kolommen', value: '3' },
              ],
              admin: {
                description: 'Aantal kolommen in het grid',
              },
            },
            {
              name: 'showRatingBars',
              type: 'checkbox',
              label: 'Toon beoordelingsbalken',
              defaultValue: true,
              admin: {
                description: 'Distributie van 5 sterren tot 1 ster',
              },
            },
            {
              name: 'showAverage',
              type: 'checkbox',
              label: 'Toon gemiddelde score',
              defaultValue: true,
              admin: {
                description: 'Gemiddelde beoordeling met groot cijfer',
              },
            },
            {
              name: 'averagePosition',
              type: 'select',
              label: 'Positie gemiddelde',
              defaultValue: 'top',
              options: [
                { label: 'Boven reviews', value: 'top' },
                { label: 'Links naast reviews', value: 'left' },
              ],
              admin: {
                description: 'Waar de gemiddelde score en balken worden getoond',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
