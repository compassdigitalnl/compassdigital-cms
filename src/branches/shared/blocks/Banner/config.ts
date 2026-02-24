import { Block } from 'payload'

/**
 * B19 - Banner Block
 *
 * Top announcement/promo banners with gradient backgrounds and dismissible functionality.
 *
 * FEATURES:
 * - 3 gradient variants: announcement (navy), promo (teal), warning (amber)
 * - Full-width horizontal layout
 * - Message text (max 150 chars) with optional CTA button/link
 * - Dismissible with unique localStorage keys
 * - Optional sticky positioning (z-index: 100)
 * - Date range filtering (showFrom, showUntil)
 * - 2 tabs: Content, Behavior
 *
 * CLIENT COMPONENT:
 * - Requires 'use client' directive for dismissible functionality
 * - Uses localStorage API for persistent dismissal tracking
 * - Date range logic for conditional display
 * - useState/useEffect hooks for interactivity
 *
 * DATABASE:
 * - pages_blocks_banner (single table with date fields)
 *
 * THEME COLORS:
 * - Uses theme gradients: navy, teal, amber
 *
 * @see docs/refactoring/sprint-6/b19-banner.html
 */
export const Banner: Block = {
  slug: 'banner',
  labels: {
    singular: 'Banner Block',
    plural: 'Banner Blocks',
  },
  interfaceName: 'BannerBlock',
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
              defaultValue: 'announcement',
              options: [
                {
                  label: 'Announcement (Navy) — General updates, news',
                  value: 'announcement',
                },
                {
                  label: 'Promo (Teal) — Promotions, special offers, discounts',
                  value: 'promo',
                },
                {
                  label: 'Warning (Amber) — Important notices, alerts',
                  value: 'warning',
                },
              ],
              admin: {
                description: 'Gradient background color and semantic meaning',
              },
            },
            {
              name: 'message',
              type: 'text',
              label: 'Message',
              required: true,
              maxLength: 150,
              admin: {
                description: 'Short announcement message (max 150 characters)',
                placeholder: 'e.g., 🎉 Free shipping on all orders over €50 this week only!',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaText',
                  type: 'text',
                  label: 'CTA Button Text',
                  admin: {
                    width: '50%',
                    description: 'Optional call-to-action button text',
                    placeholder: 'e.g., Shop Now',
                  },
                },
                {
                  name: 'ctaLink',
                  type: 'text',
                  label: 'CTA Button Link',
                  admin: {
                    width: '50%',
                    description: 'URL for CTA button (internal or external)',
                    placeholder: 'e.g., /shop or https://example.com',
                  },
                },
              ],
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
              defaultValue: true,
              admin: {
                description: 'Allow users to close this banner with an X button',
              },
            },
            {
              name: 'dismissalKey',
              type: 'text',
              label: 'Dismissal Key',
              required: true,
              admin: {
                description:
                  'Unique identifier for localStorage (e.g., "promo-2026-feb"). Users who dismiss this banner will not see it again.',
                placeholder: 'e.g., promo-2026-feb',
              },
            },
            {
              name: 'sticky',
              type: 'checkbox',
              label: 'Sticky Position',
              defaultValue: false,
              admin: {
                description:
                  'Keep banner fixed at top of screen when scrolling (z-index: 100)',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'showFrom',
                  type: 'date',
                  label: 'Show From Date',
                  admin: {
                    width: '50%',
                    description: 'Banner appears starting from this date (optional)',
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'showUntil',
                  type: 'date',
                  label: 'Show Until Date',
                  admin: {
                    width: '50%',
                    description: 'Banner disappears after this date (optional)',
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
