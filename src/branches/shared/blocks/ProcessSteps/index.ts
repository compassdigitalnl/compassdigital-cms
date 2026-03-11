import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-44 Process Steps Block
 *
 * "How It Works" process flow with 2-4 numbered steps.
 * The center step is visually highlighted with a gradient background and scale effect.
 *
 * Icons: search, settings, check-circle, zap, rocket, target, bar-chart, lightbulb, palette, smartphone
 * Background: light-grey (default), white
 */
export const ProcessSteps: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  labels: {
    singular: 'Process Steps',
    plural: 'Process Steps',
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
              label: 'Section Title',
              required: true,
              admin: {
                description: 'Heading above the process steps (e.g., "Hoe het werkt")',
                placeholder: 'Hoe het werkt',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitle',
              admin: {
                description: 'Optional description below the title',
                placeholder: 'In een paar eenvoudige stappen aan de slag',
              },
            },
            {
              name: 'steps',
              type: 'array',
              label: 'Steps',
              minRows: 2,
              maxRows: 4,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  defaultValue: 'search',
                  options: [
                    { label: 'Search', value: 'search' },
                    { label: 'Settings', value: 'settings' },
                    { label: 'Check Circle', value: 'check-circle' },
                    { label: 'Zap', value: 'zap' },
                    { label: 'Rocket', value: 'rocket' },
                    { label: 'Target', value: 'target' },
                    { label: 'Bar Chart', value: 'bar-chart' },
                    { label: 'Lightbulb', value: 'lightbulb' },
                    { label: 'Palette', value: 'palette' },
                    { label: 'Smartphone', value: 'smartphone' },
                  ],
                  admin: {
                    description: 'Icon displayed in the step card',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Step Title',
                  required: true,
                  admin: {
                    placeholder: 'Kies een pakket',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Step Description',
                  required: true,
                  admin: {
                    rows: 2,
                    placeholder: 'Selecteer het pakket dat het beste bij je past.',
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
              name: 'backgroundColor',
              type: 'select',
              label: 'Background Color',
              defaultValue: 'light-grey',
              options: [
                { label: 'Light Grey', value: 'light-grey' },
                { label: 'White', value: 'white' },
              ],
              admin: {
                description: 'Section background color',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
