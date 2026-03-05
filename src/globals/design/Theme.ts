import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

// ═══════════════════════════════════════════════════════════
// DESIGN TOKEN TABS (Compass Design System)
// ═══════════════════════════════════════════════════════════
import { Colors } from './colors'
import { Typography } from './typography'
import { Spacing } from './spacing'
import { Gradients } from './gradients'
import { Visual } from './visual'
import { Buttons } from './buttons'

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme & Design System',
  admin: {
    group: 'Ontwerp',
    hidden: !isClientDeployment(),
    description:
      'Compass Design System — design tokens across 6 categories (Colors, Typography, Buttons, Spacing, Gradients, Visual)',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        Colors, // 16 color tokens
        Typography, // 11 typography tokens
        Buttons, // Button sizing, shape, and variant colors
        Spacing, // 9 spacing tokens (read-only)
        Gradients, // 4 gradient tokens
        Visual, // 14 visual tokens (radius, shadows, z-index)
      ],
    },
  ],
}
