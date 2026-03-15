import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const ChatConversations: CollectionConfig = {
  slug: 'chat-conversations',
  labels: {
    singular: 'Chat Gesprek',
    plural: 'Chat Gesprekken',
  },
  admin: {
    useAsTitle: 'sessionId',
    group: 'Support',
    defaultColumns: ['sessionId', 'customer', 'status', 'createdAt'],
    description: 'Chatbot gesprekken opgeslagen voor analyse',
    hidden: shouldHideCollection('support'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'editor'], user)) return true
      return { customer: { equals: user.id } }
    },
    create: () => true, // Chatbot can create without auth (anonymous)
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      label: 'Sessie ID',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Klant',
      admin: {
        description: 'Optioneel — anonieme chats hebben geen klant',
      },
    },
    {
      name: 'messages',
      type: 'array',
      label: 'Berichten',
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Gebruiker', value: 'user' },
            { label: 'Assistent', value: 'assistant' },
            { label: 'Systeem', value: 'system' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'number',
          label: 'Timestamp (ms)',
        },
        {
          name: 'sources',
          type: 'json',
          label: 'Bronnen',
          admin: {
            description: 'RAG bronnen als JSON',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Beëindigd', value: 'ended' },
        { label: 'Geëscaleerd', value: 'escalated' },
      ],
    },
    {
      name: 'escalatedToTicket',
      type: 'relationship',
      relationTo: 'support-tickets',
      label: 'Geëscaleerd naar ticket',
      admin: {
        condition: (data) => data?.status === 'escalated',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Metadata',
      fields: [
        {
          name: 'model',
          type: 'text',
          label: 'AI Model',
        },
        {
          name: 'tokensUsed',
          type: 'number',
          label: 'Tokens gebruikt',
        },
        {
          name: 'startedAt',
          type: 'date',
          label: 'Gestart op',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'endedAt',
          type: 'date',
          label: 'Beëindigd op',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'pageUrl',
          type: 'text',
          label: 'Pagina URL',
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Beoordeling',
      min: 1,
      max: 5,
    },
  ],
}
