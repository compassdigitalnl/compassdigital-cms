import type { CollectionConfig } from 'payload'

/**
 * Navigation Collection - Menu structures
 * Supports hierarchical menus (header, footer, sidebar)
 */
export const Navigation: CollectionConfig = {
  slug: 'navigation',
  labels: {
    singular: 'Navigatie',
    plural: 'Navigatie',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'updatedAt'],
    group: 'Core',
    description: 'Beheer menu\'s en navigatiestructuren',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Interne naam voor dit menu (bijv. "Hoofdmenu", "Footer Menu")',
      },
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      label: 'Locatie',
      options: [
        { label: 'Header (Hoofdmenu)', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Mobile Menu', value: 'mobile' },
        { label: 'Top Bar', value: 'topbar' },
      ],
      admin: {
        description: 'Waar dit menu getoond wordt',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Menu Items',
      minRows: 1,
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'link',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Dropdown', value: 'dropdown' },
            { label: 'Mega Menu', value: 'megamenu' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            description: 'Absolute of relatieve URL (bijv. /about, https://example.com)',
            condition: (data, siblingData) => siblingData?.type === 'link',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Koppel aan Pagina',
          admin: {
            description: 'Alternatief: koppel aan een bestaande pagina',
            condition: (data, siblingData) => siblingData?.type === 'link',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          admin: {
            description: 'Icon naam (bijv. "home", "shopping-cart")',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          label: 'Open in nieuw tabblad',
        },
        {
          name: 'children',
          type: 'array',
          label: 'Submenu Items',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'dropdown' || siblingData?.type === 'megamenu',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Voor mega menu: korte beschrijving',
              },
            },
            {
              name: 'icon',
              type: 'text',
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: 'Uitgelicht',
            },
          ],
        },
        {
          name: 'megaMenuColumns',
          type: 'array',
          label: 'Mega Menu Kolommen',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'megamenu',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Kolom Titel',
            },
            {
              name: 'links',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                },
              ],
            },
          ],
        },
        {
          name: 'badge',
          type: 'group',
          label: 'Badge',
          admin: {
            description: 'Optionele badge (bijv. "Nieuw", "Sale")',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'color',
              type: 'select',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Success', value: 'success' },
                { label: 'Warning', value: 'warning' },
                { label: 'Danger', value: 'danger' },
              ],
            },
          ],
        },
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: true,
          label: 'Zichtbaar',
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Volgorde',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Advanced Settings',
      fields: [
        {
          name: 'cssClass',
          type: 'text',
          label: 'CSS Class',
          admin: {
            description: 'Custom CSS class voor styling',
          },
        },
        {
          name: 'maxDepth',
          type: 'number',
          defaultValue: 2,
          label: 'Maximum Diepte',
          admin: {
            description: 'Hoeveel niveaus diep het menu mag zijn',
          },
        },
        {
          name: 'showIcons',
          type: 'checkbox',
          defaultValue: true,
          label: 'Toon Icons',
        },
        {
          name: 'mobileBreakpoint',
          type: 'select',
          defaultValue: 'md',
          label: 'Mobile Breakpoint',
          options: [
            { label: 'Small (640px)', value: 'sm' },
            { label: 'Medium (768px)', value: 'md' },
            { label: 'Large (1024px)', value: 'lg' },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
