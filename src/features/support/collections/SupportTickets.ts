import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const SupportTickets: CollectionConfig = {
  slug: 'support-tickets',
  labels: {
    singular: 'Support Ticket',
    plural: 'Support Tickets',
  },
  admin: {
    useAsTitle: 'subject',
    group: 'Support',
    defaultColumns: ['ticketNumber', 'subject', 'status', 'priority', 'customer', 'assignedTo', 'createdAt'],
    description: 'Klant support tickets',
    hidden: shouldHideCollection('support'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'editor'], user)) return true
      // Customers can only see their own tickets
      return { customer: { equals: user.id } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'editor'], user)) return true
      return { customer: { equals: user.id } }
    },
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-generate ticket number on create
        if (operation === 'create' && !data.ticketNumber) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const payload = req.payload

          // Count today's tickets for sequential number
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const existing = await payload.find({
            collection: 'support-tickets',
            where: { createdAt: { greater_than: startOfDay.toISOString() } },
            limit: 0,
          })
          const seq = String(existing.totalDocs + 1).padStart(3, '0')
          data.ticketNumber = `TIC-${dateStr}-${seq}`
        }

        // Auto-set status timestamps
        if (data.status === 'resolved' && !data.resolvedAt) {
          data.resolvedAt = new Date().toISOString()
        }
        if ((data.status === 'resolved' || data.status === 'closed') && !data.closedAt) {
          data.closedAt = new Date().toISOString()
        }

        // Auto-assign via category
        if (operation === 'create' && data.category && !data.assignedTo) {
          try {
            const category = await req.payload.findByID({
              collection: 'support-categories',
              id: data.category,
              depth: 0,
            })
            if (category?.autoAssignTo) {
              data.assignedTo = category.autoAssignTo
            }
          } catch {
            // Non-critical
          }
        }

        return data
      },
    ],
  },
  fields: [
    // ─── Main content ───
    {
      name: 'ticketNumber',
      type: 'text',
      unique: true,
      label: 'Ticketnummer',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatisch gegenereerd',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Onderwerp',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In behandeling', value: 'in_progress' },
        { label: 'Wacht op klant', value: 'waiting_customer' },
        { label: 'Wacht op agent', value: 'waiting_agent' },
        { label: 'Opgelost', value: 'resolved' },
        { label: 'Gesloten', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioriteit',
      defaultValue: 'normal',
      options: [
        { label: 'Laag', value: 'low' },
        { label: 'Normaal', value: 'normal' },
        { label: 'Hoog', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'support-categories',
      label: 'Categorie',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Toegewezen aan',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Klant',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Bijlagen',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Bestand',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: 'Tag',
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'web',
      options: [
        { label: 'Website', value: 'web' },
        { label: 'Chatbot', value: 'chatbot' },
        { label: 'E-mail', value: 'email' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'chatSessionId',
      type: 'text',
      label: 'Chat Sessie ID',
      admin: {
        description: 'Koppeling met chatbot gesprek',
        condition: (data) => data?.source === 'chatbot',
      },
    },

    // ─── Rating ───
    {
      name: 'rating',
      type: 'number',
      label: 'Beoordeling',
      min: 1,
      max: 5,
      admin: {
        condition: (data) => data?.status === 'resolved' || data?.status === 'closed',
        description: '1-5 sterren',
      },
    },
    {
      name: 'ratingFeedback',
      type: 'textarea',
      label: 'Feedback',
      admin: {
        condition: (data) => data?.status === 'resolved' || data?.status === 'closed',
      },
    },

    // ─── Timestamps ───
    {
      name: 'firstResponseAt',
      type: 'date',
      label: 'Eerste reactie',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'resolvedAt',
      type: 'date',
      label: 'Opgelost op',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'closedAt',
      type: 'date',
      label: 'Gesloten op',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
