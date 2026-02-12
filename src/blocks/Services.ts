import type { Block } from 'payload'

export const Services: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features / USPs',
    plural: 'Features / USPs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Onze diensten',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro tekst',
      admin: {
        rows: 2,
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'manual',
      required: true,
      options: [
        { label: 'Vanuit Services collection', value: 'collection' },
        { label: 'Handmatig ingevoerd', value: 'manual' },
      ],
      admin: {
        description: 'Kies tussen herbruikbare services of unieke features voor deze pagina',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Selecteer Services',
      admin: {
        description: 'Kies welke diensten/features je wilt tonen uit de collection',
        condition: (data, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Filter op categorie',
      options: [
        { label: 'Alle categorieën', value: 'all' },
        { label: 'Algemeen', value: 'algemeen' },
        { label: 'Technische Diensten', value: 'technisch' },
        { label: 'Marketing & SEO', value: 'marketing' },
        { label: 'Support & Service', value: 'support' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Training & Educatie', value: 'training' },
        { label: 'USPs (Unique Selling Points)', value: 'usps' },
      ],
      defaultValue: 'all',
      admin: {
        description: 'Toon alleen services uit een specifieke categorie (alleen bij collection mode)',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.services,
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximaal aantal services om te tonen',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.services,
      },
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      label: 'Alleen uitgelichte services',
      defaultValue: false,
      admin: {
        description: 'Toon alleen services die zijn gemarkeerd als "Uitgelicht"',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.services,
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Handmatige Features / USPs',
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Voeg handmatig features/USPs toe (alleen voor deze pagina)',
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'iconType',
          type: 'select',
          label: 'Icon Type',
          defaultValue: 'lucide',
          options: [
            { label: 'Lucide Icon (recommended)', value: 'lucide' },
            { label: 'Upload Custom Icon', value: 'upload' },
          ],
        },
        {
          name: 'iconName',
          type: 'text',
          label: 'Icon',
          admin: {
            description: 'Kies een professional icon (bijv: Shield, Truck, Award)',
            placeholder: 'Shield',
            condition: (data, siblingData) => siblingData.iconType === 'lucide',
            components: {
              Field: '@/components/IconPickerField#IconPickerField',
            },
          },
        },
        {
          name: 'iconUpload',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload Icon',
          admin: {
            description: 'Upload een custom SVG/PNG icon',
            condition: (data, siblingData) => siblingData.iconType === 'upload',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Titel',
          admin: {
            placeholder: '30+ jaar expertise',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Beschrijving',
          admin: {
            rows: 3,
            placeholder: 'Sinds 1994 actief als betrouwbare partner',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link (optioneel)',
          admin: {
            placeholder: '/over-ons',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-3',
      options: [
        { label: 'Horizontale Trust Bar', value: 'horizontal' },
        { label: '2 kolommen', value: 'grid-2' },
        { label: '3 kolommen', value: 'grid-3' },
        { label: '4 kolommen', value: 'grid-4' },
        { label: '5 kolommen', value: 'grid-5' },
        { label: '6 kolommen', value: 'grid-6' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      label: 'Stijl',
      defaultValue: 'cards',
      options: [
        { label: 'Cards (met achtergrond)', value: 'cards' },
        { label: 'Clean (zonder achtergrond)', value: 'clean' },
        { label: 'Trust Bar (compact)', value: 'trust-bar' },
      ],
      admin: {
        description: 'Visual stijl van de features',
      },
    },
    {
      name: 'showHoverEffect',
      type: 'checkbox',
      label: 'Hover Effect',
      defaultValue: true,
      admin: {
        description: 'Animatie bij hover over items',
      },
    },
  ],
}
