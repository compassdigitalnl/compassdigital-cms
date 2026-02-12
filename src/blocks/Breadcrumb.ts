import type { Block } from 'payload'

export const Breadcrumb: Block = {
  slug: 'breadcrumb',
  interfaceName: 'BreadcrumbBlock',
  labels: {
    singular: 'Breadcrumb',
    plural: 'Breadcrumbs',
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      label: 'Mode',
      defaultValue: 'auto',
      options: [
        { label: 'Automatisch (op basis van URL)', value: 'auto' },
        { label: 'Handmatig (custom items)', value: 'manual' },
      ],
      admin: {
        description: 'Automatisch genereert breadcrumbs op basis van de huidige URL',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Breadcrumb Items',
      admin: {
        description: 'Handmatig geconfigureerde breadcrumbs',
        condition: (data, siblingData) => siblingData?.mode === 'manual',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            placeholder: 'Diagnostiek',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link (optioneel)',
          admin: {
            placeholder: '/diagnostiek',
            description: 'Laat leeg voor huidige/actieve item',
          },
        },
      ],
    },
    {
      name: 'showHome',
      type: 'checkbox',
      label: 'Toon Home Link',
      defaultValue: true,
      admin: {
        description: 'Toon "Home" als eerste item in breadcrumbs',
      },
    },
    {
      name: 'homeLabel',
      type: 'text',
      label: 'Home Label',
      defaultValue: 'Home',
      admin: {
        condition: (data, siblingData) => siblingData?.showHome === true,
        placeholder: 'Home of Startpagina',
      },
    },
    {
      name: 'separator',
      type: 'select',
      label: 'Scheidingsteken',
      defaultValue: 'arrow',
      options: [
        { label: 'Pijl (>)', value: 'arrow' },
        { label: 'Slash (/)', value: 'slash' },
        { label: 'Chevron (›)', value: 'chevron' },
        { label: 'Dubbele chevron (»)', value: 'double-chevron' },
      ],
    },
    {
      name: 'showOnMobile',
      type: 'checkbox',
      label: 'Toon op Mobiel',
      defaultValue: true,
      admin: {
        description: 'Toon breadcrumbs ook op mobiele apparaten',
      },
    },
  ],
}
