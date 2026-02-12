import type { Block } from 'payload'

export const LogoBar: Block = {
  slug: 'logoBar',
  interfaceName: 'LogoBarBlock',
  labels: {
    singular: 'Logo Bar',
    plural: 'Logo Bars',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel (optioneel)',
      admin: {
        placeholder: 'Zij gingen je voor',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'manual',
      required: true,
      options: [
        { label: 'Vanuit Partners collection', value: 'collection' },
        { label: 'Handmatig ingevoerd', value: 'manual' },
      ],
      admin: {
        description: 'Kies tussen herbruikbare partners of unieke logo\'s voor deze pagina',
      },
    },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      label: 'Selecteer Partners',
      admin: {
        description: 'Kies welke partner logo\'s je wilt tonen uit de collection',
        condition: (data, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Filter op categorie',
      options: [
        { label: 'Alle categorieën', value: 'all' },
        { label: 'Klanten', value: 'klant' },
        { label: 'Partners', value: 'partner' },
        { label: 'Leveranciers', value: 'leverancier' },
        { label: 'Certificeringen', value: 'certificering' },
        { label: 'Media / Pers', value: 'media' },
      ],
      defaultValue: 'all',
      admin: {
        description: 'Toon alleen partners uit een specifieke categorie (alleen bij collection mode)',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.partners,
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 10,
      min: 1,
      max: 20,
      admin: {
        description: 'Maximaal aantal logo\'s om te tonen',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.partners,
      },
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      label: 'Alleen uitgelichte partners',
      defaultValue: false,
      admin: {
        description: 'Toon alleen partners die zijn gemarkeerd als "Uitgelicht"',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.partners,
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Handmatige Logo\'s',
      labels: {
        singular: 'Logo',
        plural: 'Logo\'s',
      },
      minRows: 1,
      maxRows: 20,
      admin: {
        description: 'Voeg handmatig logo\'s toe (alleen voor deze pagina)',
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo afbeelding',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Bedrijfsnaam',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Website URL (optioneel)',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (automatisch)', value: 'grid' },
        { label: 'Carousel (scrollend)', value: 'carousel' },
      ],
    },
  ],
}
