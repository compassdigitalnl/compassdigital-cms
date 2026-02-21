import type { Block } from 'payload'

export const CTABanner: Block = {
  slug: 'cta-banner',
  labels: {
    singular: 'CTA Banner',
    plural: 'CTA Banners',
  },
  interfaceName: 'CTABannerBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      label: 'Stijl',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradient (kleurverloop)', value: 'gradient' },
        { label: 'Solid (enkele kleur)', value: 'solid' },
        { label: 'Outlined (rand)', value: 'outlined' },
        { label: 'Image (achtergrond afbeelding)', value: 'image' },
      ],
      admin: {
        description: 'Visuele stijl van de banner',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Achtergrond afbeelding',
      admin: {
        description: 'Achtergrond afbeelding (alleen bij Image stijl)',
        condition: (data) => data.style === 'image',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge',
      admin: {
        description: 'Kleine label boven de titel (optioneel)',
        placeholder: 'Gratis adviesgesprek',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Hoofdtitel van de CTA',
        placeholder: 'Klaar om uw project te starten?',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Beschrijving onder de titel',
        placeholder: 'Vraag een gratis offerte aan en ontvang binnen 24 uur een reactie van ons team.',
        rows: 2,
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Knoppen',
      minRows: 1,
      maxRows: 2,
      required: true,
      admin: {
        description: 'Voeg 1-2 actie knoppen toe',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Knop tekst',
          admin: {
            placeholder: 'Gratis offerte aanvragen',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Link',
          admin: {
            placeholder: '/offerte-aanvragen',
          },
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'primary',
          options: [
            { label: 'Primair (gevuld)', value: 'primary' },
            { label: 'Secundair (outline)', value: 'secondary' },
            { label: 'Wit', value: 'white' },
          ],
        },
      ],
    },
    {
      name: 'trustElements',
      type: 'group',
      label: 'Vertrouwenselementen',
      admin: {
        description: 'Optionele vertrouwenselementen onder de knoppen',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Toon vertrouwenselementen',
          defaultValue: false,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Items',
          maxRows: 3,
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icoon',
              options: [
                { label: '✓ Vinkje', value: 'check' },
                { label: '⭐ Ster', value: 'star' },
                { label: '🏆 Trofee', value: 'trophy' },
                { label: '🔒 Slot', value: 'lock' },
                { label: '⚡ Bliksem', value: 'lightning' },
              ],
              defaultValue: 'check',
            },
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Tekst',
              admin: {
                placeholder: 'Gratis & vrijblijvend',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Uitlijning',
      defaultValue: 'center',
      options: [
        { label: 'Links', value: 'left' },
        { label: 'Midden', value: 'center' },
      ],
      admin: {
        description: 'Uitlijning van de inhoud',
      },
    },
    {
      name: 'size',
      type: 'select',
      label: 'Grootte',
      defaultValue: 'medium',
      options: [
        { label: 'Klein (compact)', value: 'small' },
        { label: 'Gemiddeld', value: 'medium' },
        { label: 'Groot (full bleed)', value: 'large' },
      ],
      admin: {
        description: 'Hoogte/ruimte van de banner',
      },
    },
  ],
}

export default CTABanner
