import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const PushSubscriptions: CollectionConfig = {
  slug: 'push-subscriptions',
  labels: {
    singular: 'Push Abonnement',
    plural: 'Push Abonnementen',
  },
  admin: {
    group: 'Instellingen',
    useAsTitle: 'endpoint',
    defaultColumns: ['user', 'endpoint', 'active', 'lastUsed', 'createdAt'],
    description: 'Push notificatie abonnementen van gebruikers (Web Push API)',
  },
  access: {
    // Only admins can read/list subscriptions
    read: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin'], user)
    },
    // Anyone can create a subscription (subscribe from frontend)
    create: () => true,
    // Only admins can update subscriptions
    update: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin'], user)
    },
    // Only admins can delete subscriptions
    delete: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin'], user)
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Gebruiker',
      admin: {
        description: 'Optioneel: gekoppelde ingelogde gebruiker',
        position: 'sidebar',
      },
    },
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      unique: true,
      label: 'Endpoint URL',
      admin: {
        description: 'De Push API endpoint URL van de browser',
      },
    },
    {
      name: 'p256dh',
      type: 'text',
      required: true,
      label: 'P256DH sleutel',
      admin: {
        description: 'De publieke encryptiesleutel van het abonnement',
      },
    },
    {
      name: 'auth',
      type: 'text',
      required: true,
      label: 'Auth geheim',
      admin: {
        description: 'Het authenticatiegeheim van het abonnement',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
      admin: {
        description: 'Browserinformatie van de abonnee',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Actief',
      admin: {
        description: 'Wordt automatisch uitgeschakeld bij verlopen abonnementen',
        position: 'sidebar',
      },
    },
    {
      name: 'lastUsed',
      type: 'date',
      label: 'Laatst gebruikt',
      admin: {
        description: 'Datum/tijd van de laatste verzonden push notificatie',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default PushSubscriptions
