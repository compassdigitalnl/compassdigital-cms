import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * Competitor Comparison Block
 *
 * Feature comparison table showing "us vs competitors" (e.g. CompassDigital vs Shopify / WordPress / Wix).
 * Supports 1-4 competitors and 3-15 feature rows with yes/no/partial/custom values.
 * Our column is visually highlighted to draw attention.
 */
export const CompetitorComparison: Block = {
  slug: 'competitorComparison',
  interfaceName: 'CompetitorComparisonBlock',
  labels: {
    singular: 'Vergelijkingstabel',
    plural: 'Vergelijkingstabellen',
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
              label: 'Titel',
              defaultValue: 'Waarom CompassDigital?',
              admin: {
                description: 'Koptekst boven de vergelijkingstabel',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitel',
              admin: {
                description: 'Optionele beschrijving onder de titel',
              },
            },
            {
              name: 'competitors',
              type: 'array',
              label: 'Concurrenten',
              minRows: 1,
              maxRows: 4,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                  admin: {
                    placeholder: 'bijv. Shopify, WordPress, Wix',
                  },
                },
              ],
            },
            {
              name: 'features',
              type: 'array',
              label: 'Features',
              minRows: 3,
              maxRows: 15,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Feature naam',
                  admin: {
                    placeholder: 'bijv. Onbeperkte pagina\'s',
                  },
                },
                {
                  name: 'ourValue',
                  type: 'select',
                  label: 'Wij',
                  defaultValue: 'yes',
                  options: [
                    { label: 'Ja', value: 'yes' },
                    { label: 'Nee', value: 'no' },
                    { label: 'Gedeeltelijk', value: 'partial' },
                    { label: 'Eigen waarde', value: 'custom' },
                  ],
                },
                {
                  name: 'ourCustomValue',
                  type: 'text',
                  label: 'Eigen waarde',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.ourValue === 'custom',
                    placeholder: 'bijv. 50+ templates',
                  },
                },
                {
                  name: 'competitorValues',
                  type: 'array',
                  label: 'Concurrent waarden',
                  fields: [
                    {
                      name: 'value',
                      type: 'select',
                      label: 'Waarde',
                      defaultValue: 'no',
                      options: [
                        { label: 'Ja', value: 'yes' },
                        { label: 'Nee', value: 'no' },
                        { label: 'Gedeeltelijk', value: 'partial' },
                        { label: 'Eigen waarde', value: 'custom' },
                      ],
                    },
                    {
                      name: 'customValue',
                      type: 'text',
                      label: 'Eigen waarde',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.value === 'custom',
                        placeholder: 'bijv. Beperkt',
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
              name: 'highlightColumn',
              type: 'checkbox',
              label: 'Onze kolom markeren',
              defaultValue: true,
              admin: {
                description: 'De CompassDigital kolom visueel benadrukken',
              },
            },
            {
              name: 'bgColor',
              type: 'select',
              label: 'Achtergrondkleur',
              defaultValue: 'white',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Lichtgrijs', value: 'light-grey' },
              ],
              admin: {
                description: 'Achtergrondkleur van de sectie',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
