import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    group: 'Website',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true, // Publiek leesbaar (frontend)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Vraag',
      admin: {
        description: 'De veelgestelde vraag',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Antwoord',
      admin: {
        description: 'Het antwoord op de vraag (ondersteunt rich text)',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      defaultValue: 'algemeen',
      options: [
        { label: 'Algemeen', value: 'algemeen' },
        { label: 'Producten', value: 'producten' },
        { label: 'Verzending & Levering', value: 'verzending' },
        { label: 'Retourneren', value: 'retourneren' },
        { label: 'Betaling', value: 'betaling' },
        { label: 'Account & Privacy', value: 'account' },
        { label: 'Technische Support', value: 'support' },
        { label: 'Overig', value: 'overig' },
      ],
      admin: {
        description: 'Categoriseer de vraag voor betere filtering',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon deze vraag op homepage of belangrijke pagina\'s',
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
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Concept', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
