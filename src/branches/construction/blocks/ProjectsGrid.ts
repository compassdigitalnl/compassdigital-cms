import type { Block } from 'payload'

export const ProjectsGrid: Block = {
  slug: 'projects-grid',
  labels: {
    singular: 'Projecten Grid',
    plural: 'Projecten Grids',
  },
  interfaceName: 'ProjectsGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'group',
      label: 'Kopje',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          admin: {
            description: 'Kleine label boven de titel (bijv. "Ons werk")',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Onze projecten',
          admin: {
            description: 'Hoofdtitel van de sectie',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          admin: {
            description: 'Optionele beschrijving onder de titel',
            rows: 2,
          },
        },
      ],
    },
    {
      name: 'projectsSource',
      type: 'radio',
      label: 'Projecten bron',
      required: true,
      defaultValue: 'auto',
      options: [
        {
          label: 'Automatisch (alle gepubliceerde projecten)',
          value: 'auto',
        },
        {
          label: 'Alleen uitgelichte projecten',
          value: 'featured',
        },
        {
          label: 'Handmatig selecteren',
          value: 'manual',
        },
        {
          label: 'Op categorie filteren',
          value: 'category',
        },
      ],
      admin: {
        description: 'Hoe moeten projecten geselecteerd worden?',
      },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'construction-projects',
      hasMany: true,
      label: 'Projecten',
      admin: {
        description: 'Selecteer specifieke projecten',
        condition: (data) => data.projectsSource === 'manual',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'construction-services',
      label: 'Categorie',
      admin: {
        description: 'Filter projecten op deze categorie',
        condition: (data) => data.projectsSource === 'category',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Aantal projecten',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximum aantal projecten om te tonen',
        condition: (data) => data.projectsSource !== 'manual',
      },
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
      admin: {
        description: 'Aantal kolommen in het grid (desktop)',
      },
    },
    {
      name: 'showFilter',
      type: 'checkbox',
      label: 'Toon filter knoppen',
      defaultValue: false,
      admin: {
        description: 'Toon categorie filter knoppen boven het grid',
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call-to-Action',
      admin: {
        description: 'Optionele knop onder het grid',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Toon CTA knop',
          defaultValue: false,
        },
        {
          name: 'text',
          type: 'text',
          label: 'Knop tekst',
          defaultValue: 'Bekijk alle projecten',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/projecten',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
      ],
    },
  ],
}

export default ProjectsGrid
