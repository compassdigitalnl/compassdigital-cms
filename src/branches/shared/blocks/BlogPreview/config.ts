import { Block } from 'payload'

/**
 * B12 - Blog Preview Block
 *
 * Displays a grid of recent blog posts with thumbnails, categories, excerpts, and metadata.
 *
 * FEATURES:
 * - Optional section title and description
 * - 2 or 3 column grid layouts (responsive: auto-collapse on mobile)
 * - Select 2-6 blog posts via relationship
 * - Display options: excerpt, read time, category badge
 * - Card hover effects with lift animation
 * - Responsive: 3 cols → 2 cols @900px → 1 col @640px
 *
 * DEPENDENCIES:
 * - Requires 'posts' collection with fields:
 *   - title (text)
 *   - slug (text)
 *   - excerpt (textarea)
 *   - thumbnail (upload)
 *   - category (relationship)
 *   - publishedAt (date)
 *   - content (richText - for read time calculation)
 *
 * DATABASE:
 * - pages_blocks_blogpreview (main table)
 * - pages_blocks_blogpreview_posts_rels (relationship junction table)
 *
 * @see docs/refactoring/sprint-6/b12-blog-preview.html
 */
export const BlogPreview: Block = {
  slug: 'blogpreview',
  labels: {
    singular: 'Blog Preview Block',
    plural: 'Blog Preview Blocks',
  },
  fields: [
    // ─── ROW: TITLE + COLUMNS ────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          admin: {
            width: '60%',
            description: 'Main section heading (optional, e.g., "Laatste Blog Posts")',
            placeholder: 'Laatste Blog Posts',
          },
        },
        {
          name: 'columns',
          type: 'select',
          label: 'Grid Columns',
          defaultValue: '3',
          required: true,
          options: [
            {
              label: '2 Columns',
              value: '2',
            },
            {
              label: '3 Columns (Recommended)',
              value: '3',
            },
          ],
          admin: {
            width: '40%',
            description: 'Number of cards per row on desktop',
          },
        },
      ],
    },

    // ─── SECTION DESCRIPTION ─────────────────────────────────────
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Brief description below title (optional, max 2 sentences)',
        placeholder: 'Blijf op de hoogte van de laatste trends en ontwikkelingen',
      },
    },

    // ─── POSTS RELATIONSHIP ──────────────────────────────────────
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'blog-posts',
      label: 'Blog Posts',
      hasMany: true,
      maxRows: 6,
      minRows: 2,
      required: true,
      admin: {
        description: 'Select 2-6 blog posts to display. Order matters: first = left.',
      },
    },

    // ─── DISPLAY OPTIONS ─────────────────────────────────────────
    {
      name: 'showExcerpt',
      type: 'checkbox',
      label: 'Show Excerpt',
      defaultValue: true,
      admin: {
        description: 'Display post excerpt below title (recommended for better preview)',
      },
    },
    {
      name: 'showReadTime',
      type: 'checkbox',
      label: 'Show Read Time',
      defaultValue: false,
      admin: {
        description: 'Display estimated reading time (e.g., "5 min read")',
      },
    },
    {
      name: 'showCategory',
      type: 'checkbox',
      label: 'Show Category Badge',
      defaultValue: true,
      admin: {
        description: 'Show category badge overlay on thumbnail (recommended)',
      },
    },
  ],
}
