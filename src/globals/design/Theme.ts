import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

// ═══════════════════════════════════════════════════════════
// DESIGN TOKEN TABS (Compass Design System)
// ═══════════════════════════════════════════════════════════
import { Colors } from './colors'
import { Typography } from './typography'
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
      'Compass Design System — design tokens (Kleuren, Typografie, Knoppen, Gradienten, Visueel)',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        Colors,
        Typography,
        Buttons,
        Gradients,
        Visual,
      ],
    },
  ],
}
