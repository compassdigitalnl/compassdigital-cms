import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const DigitalEditionPages: CollectionConfig = {
  slug: 'digital-edition-pages',
  labels: {
    singular: 'Digitale Editie Pagina',
    plural: 'Digitale Editie Pagina\'s',
  },
  admin: {
    group: 'Publicaties',
    hidden: shouldHideCollection('magazines'),
    description: 'Gerenderde pagina-afbeeldingen van digitale magazine-edities (intern beheerd)',
    defaultColumns: ['magazine', 'editionIndex', 'pageNumber', 'width', 'height'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Authenticated users can read (subscriber check happens in the provider layer)
      if (!user) return false
      return true
    },
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  // Note: compound index on [magazine, editionIndex, pageNumber] is created
  // in the migration file (20260313_200000_digital_library.ts)
  fields: [
    {
      name: 'magazine',
      type: 'relationship',
      relationTo: 'magazines',
      required: true,
      label: 'Magazine',
      admin: {
        description: 'Het magazine waartoe deze pagina behoort',
      },
    },
    {
      name: 'editionIndex',
      type: 'number',
      required: true,
      label: 'Editie Index',
      admin: {
        description: 'Index in de editions array van het magazine (0-based)',
      },
    },
    {
      name: 'pageNumber',
      type: 'number',
      required: true,
      label: 'Paginanummer',
      admin: {
        description: 'Paginanummer binnen de editie (1-based)',
      },
    },
    {
      name: 'pageImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Pagina Afbeelding',
      admin: {
        description: 'De gerenderde pagina als WebP afbeelding',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail',
      admin: {
        description: 'Kleinere versie van de pagina voor voorvertoningen',
      },
    },
    {
      name: 'width',
      type: 'number',
      label: 'Breedte',
      admin: {
        description: 'Breedte in pixels',
      },
    },
    {
      name: 'height',
      type: 'number',
      label: 'Hoogte',
      admin: {
        description: 'Hoogte in pixels',
      },
    },
  ],
}

export default DigitalEditionPages
