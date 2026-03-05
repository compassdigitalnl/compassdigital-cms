import type { Tab } from 'payload'

export const seoTab: Tab = {
  label: 'SEO',
  description: 'Zoekmachine optimalisatie',
  fields: [
    {
      name: 'meta',
      type: 'group',
      label: 'Meta Tags',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title', maxLength: 60, admin: { description: 'Max 60 karakters. Laat leeg = productnaam wordt gebruikt.' } },
        { name: 'description', type: 'textarea', label: 'Meta Beschrijving', maxLength: 160, admin: { description: 'Max 160 karakters. Laat leeg = korte beschrijving wordt gebruikt.' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Social Share Image', admin: { description: 'Laat leeg = eerste productafbeelding wordt gebruikt.' } },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'Canonical URL',
          admin: {
            description: 'Optioneel. Verwijs zoekmachines naar een andere URL als de primaire bron. Voor child-producten van een grouped product wordt dit automatisch ingesteld op het parent product als dit veld leeg is.',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Zoekwoorden',
          admin: { description: 'SEO keywords voor dit product' },
          fields: [
            { name: 'keyword', type: 'text', required: true, label: 'Keyword' },
          ],
        },
      ],
    },
    {
      name: 'hideFromCatalog',
      type: 'checkbox',
      defaultValue: false,
      label: 'Verbergen uit catalogus',
      admin: {
        description: 'Verbergt dit product uit de shop-overzichten en zoekresultaten. De productpagina blijft bereikbaar via directe link.',
      },
    },
  ],
}
