import type { Block } from 'payload'

export const FeaturedCourses: Block = {
  slug: 'featured-courses',
  labels: {
    singular: 'Uitgelichte Cursussen',
    plural: 'Uitgelichte Cursussen',
  },
  interfaceName: 'FeaturedCoursesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Uitgelichte cursussen',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      defaultValue: '3',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
    },
    {
      name: 'categoryFilter',
      type: 'relationship',
      relationTo: 'course-categories',
      label: 'Filter op categorie',
      admin: {
        description: 'Optioneel: toon alleen cursussen uit deze categorie',
      },
    },
    {
      name: 'showPrice',
      type: 'checkbox',
      label: 'Toon prijs',
      defaultValue: true,
    },
    {
      name: 'showRating',
      type: 'checkbox',
      label: 'Toon beoordeling',
      defaultValue: true,
    },
  ],
}

export default FeaturedCourses
