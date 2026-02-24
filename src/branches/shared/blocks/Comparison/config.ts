import { Block } from 'payload'

/**
 * B15 - Comparison Table Block
 *
 * Feature comparison tables for pricing plans, products, or services.
 *
 * FEATURES:
 * - Optional section title and description
 * - 2-4 comparison columns (plans/products)
 * - Unlimited feature rows with customizable values
 * - Featured column highlighting (teal accent)
 * - Value types: check mark (✓), x mark (✗), or custom text/numbers
 * - Responsive: desktop table → mobile stacked cards
 *
 * STRUCTURE:
 * - Columns array (2-4): name, price, featured flag
 * - Rows array (≥1): feature name, values array
 * - Values array (nested): type (check/x/text), text (conditional)
 *
 * DATABASE:
 * - pages_blocks_comparison (main table)
 * - pages_blocks_comparison_columns (array table)
 * - pages_blocks_comparison_rows (array table)
 * - pages_blocks_comparison_rows_values (nested array table - 3 levels deep!)
 *
 * VALIDATION:
 * - Each row's values array must have same count as columns array
 * - Admin should validate this during save (implement in frontend Phase 2)
 *
 * @see docs/refactoring/sprint-6/b15-comparison.html
 */
export const Comparison: Block = {
  slug: 'comparison',
  labels: {
    singular: 'Comparison Table Block',
    plural: 'Comparison Table Blocks',
  },
  fields: [
    // ─── ROW: TITLE + DESCRIPTION ────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          required: true,
          admin: {
            width: '60%',
            placeholder: 'Kies het juiste abonnement',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            width: '40%',
            placeholder: 'Vergelijk de features en kies wat bij jou past',
          },
        },
      ],
    },

    // ─── COMPARISON COLUMNS (PLANS/PRODUCTS) ─────────────────────
    {
      name: 'columns',
      type: 'array',
      label: 'Comparison Columns',
      minRows: 2,
      maxRows: 4,
      required: true,
      admin: {
        description: 'Add 2-4 plans or products to compare',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Plan/Product Name',
          required: true,
          admin: {
            placeholder: 'Basic, Pro, Enterprise...',
          },
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price',
          required: true,
          admin: {
            placeholder: '€29/maand, Op maat...',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured Plan',
          defaultValue: false,
          admin: {
            description: 'Highlight this column with teal accent',
          },
        },
      ],
    },

    // ─── FEATURE ROWS ────────────────────────────────────────────
    {
      name: 'rows',
      type: 'array',
      label: 'Feature Rows',
      minRows: 1,
      required: true,
      admin: {
        description: 'Add features to compare across plans',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Feature Name',
          required: true,
          admin: {
            placeholder: 'Producten, Gebruikers, Email support...',
          },
        },
        {
          name: 'values',
          type: 'array',
          label: 'Values per Column',
          required: true,
          admin: {
            description:
              'Add values for each comparison column (must match number of columns)',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Value Type',
              required: true,
              defaultValue: 'text',
              options: [
                { label: 'Check Mark (✓)', value: 'check' },
                { label: 'X Mark (✗)', value: 'x' },
                { label: 'Text/Number', value: 'text' },
              ],
            },
            {
              name: 'text',
              type: 'text',
              label: 'Text Value',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'text',
                placeholder: '100, Onbeperkt, 2-5 dagen...',
              },
            },
          ],
        },
      ],
    },
  ],
}
