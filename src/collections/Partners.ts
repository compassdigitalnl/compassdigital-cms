import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    group: 'Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true, // Publiek leesbaar (frontend)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Bedrijfsnaam',
      admin: {
        description: 'Naam van het partner bedrijf of klant',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description: 'Upload het logo van de partner/klant (bij voorkeur SVG of PNG met transparante achtergrond)',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
      admin: {
        placeholder: 'https://example.com',
        description: 'Website van de partner (optioneel)',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      defaultValue: 'klant',
      options: [
        { label: 'Klant', value: 'klant' },
        { label: 'Partner', value: 'partner' },
        { label: 'Leverancier', value: 'leverancier' },
        { label: 'Certificering', value: 'certificering' },
        { label: 'Media / Pers', value: 'media' },
      ],
      admin: {
        description: 'Type relatie',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving (optioneel)',
      admin: {
        rows: 2,
        description: 'Korte beschrijving van de samenwerking',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon dit logo op homepage of belangrijke pagina\'s',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        description: 'Sorteer volgorde (lager = eerder getoond)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Actief', value: 'published' },
        { label: 'Archief', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
