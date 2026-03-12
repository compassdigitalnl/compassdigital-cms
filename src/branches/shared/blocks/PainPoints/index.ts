import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * Pain Points Block
 *
 * Displays 3-4 recognizable pain points to trigger emotional recognition
 * in the target audience. Each pain point has an icon, title, and description.
 *
 * Icons: alert-triangle, clock, frown, trending-down, phone-missed, users, ban, help-circle, thumbs-down, repeat
 * Background: light-grey (default), white, red-tint
 */
export const PainPoints: Block = {
  slug: 'painPoints',
  interfaceName: 'PainPointsBlock',
  labels: {
    singular: 'Pijnpunten',
    plural: 'Pijnpunten',
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
              defaultValue: 'Herkenbaar?',
              admin: {
                description: 'Heading above the pain points',
                placeholder: 'Herkenbaar?',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitel',
              admin: {
                description: 'Optional description below the title',
                placeholder: 'Dit zijn veelvoorkomende frustraties die wij oplossen',
              },
            },
            {
              name: 'painPoints',
              type: 'array',
              label: 'Pijnpunten',
              minRows: 2,
              maxRows: 6,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icoon',
                  defaultValue: 'alert-triangle',
                  options: [
                    { label: 'Alert Triangle', value: 'alert-triangle' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Frown', value: 'frown' },
                    { label: 'Trending Down', value: 'trending-down' },
                    { label: 'Phone Missed', value: 'phone-missed' },
                    { label: 'Users', value: 'users' },
                    { label: 'Ban', value: 'ban' },
                    { label: 'Help Circle', value: 'help-circle' },
                    { label: 'Thumbs Down', value: 'thumbs-down' },
                    { label: 'Repeat', value: 'repeat' },
                  ],
                  admin: {
                    description: 'Icon displayed on the pain point card',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titel',
                  required: true,
                  admin: {
                    placeholder: 'Te veel tijd kwijt aan administratie',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  required: true,
                  admin: {
                    rows: 2,
                    placeholder: 'Handmatig werk kost je uren per week die je beter kunt besteden.',
                  },
                },
              ],
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
              defaultValue: 'light-grey',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Lichtgrijs', value: 'light-grey' },
                { label: 'Rood tint', value: 'red-tint' },
              ],
              admin: {
                description: 'Section background color',
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
                { label: '4 kolommen', value: '4' },
              ],
              admin: {
                description: 'Number of columns on desktop',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
