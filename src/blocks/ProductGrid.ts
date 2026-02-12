import type { Block } from 'payload'

export const ProductGrid: Block = {
  slug: 'productGrid',
  interfaceName: 'ProductGridBlock',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Onze producten',
      admin: {
        placeholder: 'Populaire producten',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro tekst',
      admin: {
        rows: 2,
        placeholder: 'Ontdek onze meest populaire producten',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'manual',
      options: [
        { label: 'Handmatig (Selecteer producten)', value: 'manual' },
        { label: 'Featured Producten', value: 'featured' },
        { label: 'Nieuwste Producten', value: 'latest' },
        { label: 'Categorie', value: 'category' },
        { label: 'Merk', value: 'brand' },
      ],
      admin: {
        description: 'Hoe worden de producten gekozen?',
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Selecteer producten',
      admin: {
        description: 'Handmatig geselecteerde producten',
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Categorie',
      admin: {
        description: 'Toon producten uit deze categorie',
        condition: (data, siblingData) => siblingData?.source === 'category',
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      label: 'Merk',
      admin: {
        description: 'Toon producten van dit merk',
        condition: (data, siblingData) => siblingData?.source === 'brand',
      },
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (statisch)', value: 'grid' },
        { label: 'Carousel (slider)', value: 'carousel' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-4',
      options: [
        { label: '2 kolommen', value: 'grid-2' },
        { label: '3 kolommen', value: 'grid-3' },
        { label: '4 kolommen', value: 'grid-4' },
        { label: '5 kolommen', value: 'grid-5' },
      ],
      admin: {
        description: 'Aantal kolommen in de grid',
        condition: (data, siblingData) => siblingData?.displayMode === 'grid',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 8,
      min: 1,
      max: 20,
      admin: {
        description: 'Maximaal aantal producten om te tonen',
      },
    },
    {
      name: 'showAddToCart',
      type: 'checkbox',
      label: 'Toon "Toevoegen aan winkelwagen"',
      defaultValue: true,
      admin: {
        description: 'Quick add to cart button op product cards',
      },
    },
    {
      name: 'showStockStatus',
      type: 'checkbox',
      label: 'Toon Voorraadstatus',
      defaultValue: true,
      admin: {
        description: 'Toon "Op voorraad" / "Uitverkocht" badges',
      },
    },
    {
      name: 'showBrand',
      type: 'checkbox',
      label: 'Toon Merk',
      defaultValue: true,
      admin: {
        description: 'Toon merknaam op product cards',
      },
    },
    {
      name: 'showComparePrice',
      type: 'checkbox',
      label: 'Toon Doorgestreepte Prijs',
      defaultValue: true,
      admin: {
        description: 'Toon oude prijs doorgestreept bij aanbiedingen',
      },
    },
    {
      name: 'showViewAllButton',
      type: 'checkbox',
      label: 'Toon "Bekijk alle" knop',
      defaultValue: true,
      admin: {
        description: 'Link naar volledige productpagina of categorie',
      },
    },
    {
      name: 'viewAllButtonText',
      type: 'text',
      label: '"Bekijk alle" tekst',
      defaultValue: 'Bekijk alle producten',
      admin: {
        condition: (data, siblingData) => siblingData?.showViewAllButton === true,
      },
    },
    {
      name: 'viewAllButtonLink',
      type: 'text',
      label: '"Bekijk alle" link',
      defaultValue: '/producten',
      admin: {
        placeholder: '/producten of /categorie/diagnostiek',
        condition: (data, siblingData) => siblingData?.showViewAllButton === true,
      },
    },
  ],
}
