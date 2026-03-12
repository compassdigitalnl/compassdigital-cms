import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-XX Calculator Block
 *
 * Interactive "Calculate your savings" calculator that shows potential
 * cost savings of switching to CompassDigital. Visitors adjust sliders
 * for their current expenses and see a live comparison.
 *
 * Background: gradient (default), white, light-grey
 */
export const Calculator: Block = {
  slug: 'calculator',
  interfaceName: 'CalculatorBlock',
  labels: {
    singular: 'Besparingscalculator',
    plural: 'Besparingscalculators',
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
              defaultValue: 'Bereken je besparing',
              admin: {
                description: 'Koptekst boven de calculator',
                placeholder: 'Bereken je besparing',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitel',
              defaultValue: 'Ontdek hoeveel je kunt besparen met CompassDigital',
              admin: {
                description: 'Korte beschrijving onder de titel',
                placeholder: 'Ontdek hoeveel je kunt besparen met CompassDigital',
              },
            },
            {
              name: 'ourMonthlyPrice',
              type: 'number',
              label: 'Onze maandprijs (€)',
              required: true,
              defaultValue: 99,
              admin: {
                description: 'Het maandelijkse bedrag dat CompassDigital kost',
              },
            },
            {
              name: 'sliders',
              type: 'array',
              label: 'Kostenposten',
              minRows: 1,
              maxRows: 6,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                  admin: {
                    placeholder: 'Website hosting',
                  },
                },
                {
                  name: 'minValue',
                  type: 'number',
                  label: 'Minimumwaarde',
                  defaultValue: 0,
                },
                {
                  name: 'maxValue',
                  type: 'number',
                  label: 'Maximumwaarde',
                  required: true,
                  defaultValue: 100,
                },
                {
                  name: 'defaultValue',
                  type: 'number',
                  label: 'Standaardwaarde',
                  defaultValue: 50,
                },
                {
                  name: 'step',
                  type: 'number',
                  label: 'Stapgrootte',
                  defaultValue: 5,
                },
                {
                  name: 'unit',
                  type: 'select',
                  label: 'Eenheid',
                  defaultValue: 'euro',
                  options: [
                    { label: 'Euro (€)', value: 'euro' },
                    { label: 'Uren', value: 'hours' },
                    { label: 'Percentage (%)', value: 'percentage' },
                  ],
                },
                {
                  name: 'hourlyRate',
                  type: 'number',
                  label: 'Uurtarief (€)',
                  defaultValue: 75,
                  admin: {
                    description: 'Kosten per uur — wordt vermenigvuldigd met de sliderwaarde',
                    condition: (_data, siblingData) => siblingData?.unit === 'hours',
                  },
                },
              ],
            },
            {
              name: 'ctaLabel',
              type: 'text',
              label: 'CTA-tekst',
              defaultValue: 'Start nu en bespaar',
              admin: {
                placeholder: 'Start nu en bespaar',
              },
            },
            {
              name: 'ctaLink',
              type: 'text',
              label: 'CTA-link',
              defaultValue: '#contact',
              admin: {
                placeholder: '#contact',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'bgColor',
              type: 'select',
              label: 'Achtergrondkleur',
              defaultValue: 'gradient',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Lichtgrijs', value: 'light-grey' },
                { label: 'Gradient', value: 'gradient' },
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
