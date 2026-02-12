import type { Block } from 'payload'

export const SearchBar: Block = {
  slug: 'searchBar',
  labels: {
    singular: 'Zoekbalk',
    plural: 'Zoekbalken',
  },
  interfaceName: 'SearchBarBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'standard',
      label: 'Stijl',
      options: [
        { label: 'Standaard', value: 'standard' },
        { label: 'Hero (groot)', value: 'hero' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'placeholder',
      type: 'text',
      defaultValue: 'Zoek producten, merken of artikelnummers...',
      label: 'Placeholder Tekst',
    },
    {
      name: 'showCategoryFilter',
      type: 'checkbox',
      defaultValue: true,
      label: 'Toon Categorie Dropdown',
      admin: {
        description: 'Dropdown om te filteren op categorie',
      },
    },
    {
      name: 'showAutocomplete',
      type: 'checkbox',
      defaultValue: true,
      label: 'Autocomplete Suggesties',
      admin: {
        description: 'Toon suggesties tijdens het typen',
      },
    },
    {
      name: 'autocompleteLimit',
      type: 'number',
      defaultValue: 5,
      label: 'Aantal Suggesties',
      admin: {
        condition: (data) => data.showAutocomplete,
        description: 'Max aantal suggesties te tonen',
      },
    },
    {
      name: 'showPopularSearches',
      type: 'checkbox',
      defaultValue: false,
      label: 'Toon Populaire Zoekopdrachten',
      admin: {
        description: 'Toon veelgebruikte zoektermen',
      },
    },
    {
      name: 'popularSearches',
      type: 'array',
      label: 'Populaire Zoekopdrachten',
      admin: {
        condition: (data) => data.showPopularSearches,
      },
      fields: [
        {
          name: 'term',
          type: 'text',
          required: true,
          label: 'Zoekterm',
        },
      ],
    },
    {
      name: 'searchIn',
      type: 'group',
      label: 'Zoeken In',
      fields: [
        {
          name: 'products',
          type: 'checkbox',
          defaultValue: true,
          label: 'Producten',
        },
        {
          name: 'categories',
          type: 'checkbox',
          defaultValue: true,
          label: 'Categorieën',
        },
        {
          name: 'brands',
          type: 'checkbox',
          defaultValue: true,
          label: 'Merken',
        },
        {
          name: 'blog',
          type: 'checkbox',
          defaultValue: false,
          label: 'Blog artikelen',
        },
        {
          name: 'pages',
          type: 'checkbox',
          defaultValue: false,
          label: 'Pagina\'s',
        },
      ],
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Zoeken',
      label: 'Knop Tekst',
    },
  ],
}
