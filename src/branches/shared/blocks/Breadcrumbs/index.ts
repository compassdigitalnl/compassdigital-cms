import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-35 Breadcrumbs Block
 *
 * Breadcrumb navigation with configurable items and separator style.
 * Supports Home link and Schema.org BreadcrumbList markup.
 */
export const Breadcrumbs: Block = {
  slug: 'breadcrumbs',
  interfaceName: 'BreadcrumbsBlock',
  labels: {
    singular: 'Breadcrumbs',
    plural: 'Breadcrumbs',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Breadcrumb items',
              minRows: 1,
              admin: {
                description: 'Navigatie-items. Het laatste item wordt als huidige pagina weergegeven (niet klikbaar).',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                  admin: {
                    placeholder: 'Categorie',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link',
                  admin: {
                    placeholder: '/categorie',
                    description: 'URL (laat leeg voor huidige pagina)',
                  },
                },
              ],
            },
            {
              name: 'showHome',
              type: 'checkbox',
              label: 'Toon Home-link',
              defaultValue: true,
              admin: {
                description: 'Voeg automatisch een "Home" link toe aan het begin',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'separator',
              type: 'select',
              label: 'Scheidingsteken',
              defaultValue: 'chevron',
              options: [
                { label: 'Slash (/)', value: 'slash' },
                { label: 'Chevron (>)', value: 'chevron' },
                { label: 'Punt (\u00b7)', value: 'dot' },
              ],
              admin: {
                description: 'Teken tussen de breadcrumb items',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
