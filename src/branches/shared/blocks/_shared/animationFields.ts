import type { Field } from 'payload'

/**
 * Shared animation fields for all blocks
 * Added to each block's Design tab as a collapsible section
 */
export function animationFields(): Field[] {
  return [
    {
      type: 'collapsible',
      label: 'Animatie',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'enableAnimation',
          type: 'checkbox',
          label: 'Scroll-animatie inschakelen',
          defaultValue: false,
        },
        {
          name: 'animationType',
          type: 'select',
          label: 'Animatie type',
          defaultValue: 'fade-up',
          options: [
            { label: 'Fade Up', value: 'fade-up' },
            { label: 'Fade In', value: 'fade-in' },
            { label: 'Fade Left', value: 'fade-left' },
            { label: 'Fade Right', value: 'fade-right' },
            { label: 'Scale In', value: 'scale-in' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.enableAnimation === true,
          },
        },
        {
          name: 'animationDuration',
          type: 'select',
          label: 'Snelheid',
          defaultValue: 'normal',
          options: [
            { label: 'Snel (0.4s)', value: 'fast' },
            { label: 'Normaal (0.6s)', value: 'normal' },
            { label: 'Langzaam (0.8s)', value: 'slow' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.enableAnimation === true,
          },
        },
        {
          name: 'animationDelay',
          type: 'number',
          label: 'Vertraging (stappen)',
          defaultValue: 0,
          min: 0,
          max: 5,
          admin: {
            description: '0 = geen vertraging, 1-5 = stagger delay (0.1s per stap)',
            condition: (data, siblingData) => siblingData?.enableAnimation === true,
          },
        },
      ],
    },
  ]
}
