import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/tenant/isClientDeployment'
import { autoGenerateAltText } from '@/utilities/slugify'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    group: 'Website',
    hidden: !isClientDeployment(),
  },
  slug: 'media',
  access: {
    read: () => true, // Media is always publicly accessible
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      label: 'Alt Tekst',
      admin: {
        description: 'Auto-gegenereerd van bestandsnaam (kan handmatig overschreven worden)',
      },
      hooks: {
        beforeValidate: [autoGenerateAltText],
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../../../public/media'),
  },
}

export default Media
