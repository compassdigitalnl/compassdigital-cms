import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  InlineCodeFeature,
} from '@payloadcms/richtext-lexical'

/**
 * B18 - InfoBox Block
 *
 * Status notification callout boxes with 4 color-coded variants.
 *
 * FEATURES:
 * - 4 variants: info (blue), success (green), warning (amber), error (coral)
 * - Optional Lucide icon (auto-icon if not provided)
 * - Title + rich text description (supports bold, italic, links, inline code)
 * - Dismissible with optional localStorage persistence
 * - Configurable width and spacing
 * - 3 tabs: Content, Behavior, Design
 *
 * CLIENT COMPONENT:
 * - Requires 'use client' directive for dismissible functionality
 * - Uses localStorage API for persistent dismissal tracking
 * - useState/useEffect hooks for interactivity
 *
 * DATABASE:
 * - pages_blocks_infobox (single table, richText field for description)
 *
 * THEME COLORS:
 * - Requires Tailwind config with blue-50/500/900, green-50/500/900, amber-50/500/900, coral-50/500/900
 *
 * @see docs/refactoring/sprint-6/b18-infobox.html
 */
export const InfoBox: Block = {
  slug: 'infobox',
  labels: {
    singular: 'InfoBox Block',
    plural: 'InfoBox Blocks',
  },
  interfaceName: 'InfoBoxBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── TAB 1: CONTENT ──────────────────────────────────────
        {
          label: 'Content',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Variant',
              required: true,
              defaultValue: 'info',
              options: [
                {
                  label: 'Info (Blue) — General information, tips, notes',
                  value: 'info',
                },
                {
                  label: 'Success (Green) — Confirmations, completed actions',
                  value: 'success',
                },
                {
                  label: 'Warning (Amber) — Cautions, important notices',
                  value: 'warning',
                },
                {
                  label: 'Error (Coral) — Errors, failures, critical issues',
                  value: 'error',
                },
              ],
              admin: {
                description: 'Color scheme and semantic meaning of the notification',
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (Lucide)',
              admin: {
                description:
                  'Lucide icon name (e.g., "info", "check-circle", "alert-triangle", "x-circle"). Leave empty for auto-icon based on variant.',
                placeholder: 'e.g., info',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              admin: {
                description: 'Bold heading for the notification (keep under 50 chars)',
                placeholder: 'e.g., Database Setup Required',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BoldFeature(),
                  ItalicFeature(),
                  LinkFeature(),
                  InlineCodeFeature(),
                ],
              }),
              admin: {
                description: 'Detailed explanation (supports bold, italic, links, inline code)',
              },
            },
          ],
        },

        // ─── TAB 2: BEHAVIOR ─────────────────────────────────────
        {
          label: 'Behavior',
          fields: [
            {
              name: 'dismissible',
              type: 'checkbox',
              label: 'Dismissible',
              defaultValue: false,
              admin: {
                description: 'Allow users to close this notification with an X button',
              },
            },
            {
              name: 'persistent',
              type: 'checkbox',
              label: 'Persistent',
              defaultValue: false,
              admin: {
                description:
                  'If dismissible, remember dismissal across page loads (uses localStorage)',
                condition: (data) => data.dismissible === true,
              },
            },
            {
              name: 'storageKey',
              type: 'text',
              label: 'Storage Key',
              admin: {
                description:
                  'Unique key for localStorage (e.g., "dismissed-db-warning"). Required if persistent.',
                placeholder: 'e.g., dismissed-db-warning',
                condition: (data) => data.dismissible === true && data.persistent === true,
              },
            },
          ],
        },

        // ─── TAB 3: DESIGN ───────────────────────────────────────
        {
          label: 'Design',
          fields: [
            {
              name: 'maxWidth',
              type: 'select',
              label: 'Max Width',
              defaultValue: 'wide',
              options: [
                { label: 'Narrow (640px)', value: 'narrow' },
                { label: 'Wide (900px)', value: 'wide' },
                { label: 'Full (100%)', value: 'full' },
              ],
              admin: {
                description: 'Content container width',
              },
            },
            {
              name: 'marginTop',
              type: 'select',
              label: 'Margin Top',
              defaultValue: 'md',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small (12px)', value: 'sm' },
                { label: 'Medium (24px)', value: 'md' },
                { label: 'Large (48px)', value: 'lg' },
              ],
            },
            {
              name: 'marginBottom',
              type: 'select',
              label: 'Margin Bottom',
              defaultValue: 'md',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small (12px)', value: 'sm' },
                { label: 'Medium (24px)', value: 'md' },
                { label: 'Large (48px)', value: 'lg' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
