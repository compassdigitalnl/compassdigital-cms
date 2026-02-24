import { Block } from 'payload'

/**
 * B26 - Spacer Block
 *
 * Vertical spacing utility block for adding whitespace between sections.
 *
 * FEATURES:
 * - 4 size options: sm (24px), md (48px), lg (80px), xl (120px)
 * - Optional horizontal divider line
 * - Mobile responsive (lg/xl reduce on smaller screens)
 * - Simplest block in Sprint 6 (only 2 fields)
 *
 * SERVER COMPONENT:
 * - No interactivity, can be a server component
 * - Pure layout/spacing utility
 *
 * DATABASE:
 * - pages_blocks_spacer (single table, minimal fields)
 *
 * SIZES:
 * - sm: 24px desktop, 16px mobile
 * - md: 48px desktop, 32px mobile
 * - lg: 80px desktop, 48px mobile
 * - xl: 120px desktop, 64px mobile
 *
 * @see docs/refactoring/sprint-6/b26-spacer.html
 */
export const Spacer: Block = {
  slug: 'spacer',
  labels: {
    singular: 'Spacer Block',
    plural: 'Spacer Blocks',
  },
  interfaceName: 'SpacerBlock',
  fields: [
    {
      name: 'size',
      type: 'select',
      label: 'Spacing Size',
      defaultValue: 'md',
      required: true,
      options: [
        {
          label: 'Small (24px) — Subtle separation',
          value: 'sm',
        },
        {
          label: 'Medium (48px) — Standard spacing',
          value: 'md',
        },
        {
          label: 'Large (80px) — Section breaks',
          value: 'lg',
        },
        {
          label: 'Extra Large (120px) — Major separations',
          value: 'xl',
        },
      ],
      admin: {
        description:
          'Vertical spacing amount. Automatically reduces on mobile for better UX.',
      },
    },
    {
      name: 'showDivider',
      type: 'checkbox',
      label: 'Show Horizontal Divider',
      defaultValue: false,
      admin: {
        description: 'Add a subtle horizontal line in the middle of the spacing',
      },
    },
  ],
}
