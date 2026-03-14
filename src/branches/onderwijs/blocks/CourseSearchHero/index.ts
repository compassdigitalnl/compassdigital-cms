import type { Block } from 'payload'

export const CourseSearchHero: Block = {
  slug: 'course-search-hero',
  labels: {
    singular: 'Cursus Zoek-Hero',
    plural: 'Cursus Zoek-Heroes',
  },
  interfaceName: 'CourseSearchHeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Leer nieuwe vaardigheden, bereik je doelen',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subtitel',
      admin: {
        placeholder: 'Ontdek duizenden cursussen van topexperts.',
      },
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Toon zoekbalk',
      defaultValue: true,
    },
    {
      name: 'showStats',
      type: 'checkbox',
      label: 'Toon statistieken',
      defaultValue: true,
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      label: 'Achtergrond',
      defaultValue: 'dark',
      options: [
        { label: 'Donker', value: 'dark' },
        { label: 'Licht', value: 'light' },
      ],
    },
  ],
}

export default CourseSearchHero
