import type { Block } from 'payload'

export const TourSearchHero: Block = {
  slug: 'tour-search-hero',
  labels: {
    singular: 'Reis Zoek Hero',
    plural: 'Reis Zoek Heroes',
  },
  interfaceName: 'TourSearchHeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Ontdek uw droomreis',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Ondertitel',
      admin: {
        placeholder: 'Zoek uit meer dan 100 unieke reizen wereldwijd',
      },
    },
    {
      name: 'showSearchWidget',
      type: 'checkbox',
      label: 'Toon zoekwidget',
      defaultValue: true,
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      label: 'Achtergrondstijl',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradient', value: 'gradient' },
        { label: 'Afbeelding', value: 'image' },
        { label: 'Effen kleur', value: 'solid' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Achtergrondafbeelding',
      admin: {
        condition: (_, siblingData) => siblingData?.backgroundStyle === 'image',
      },
    },
  ],
}

export default TourSearchHero
