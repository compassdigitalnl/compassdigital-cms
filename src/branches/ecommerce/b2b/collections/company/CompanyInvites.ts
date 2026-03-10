import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const CompanyInvites: CollectionConfig = {
  slug: 'company-invites',
  labels: {
    singular: 'Bedrijfsuitnodiging',
    plural: 'Bedrijfsuitnodigingen',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'company', 'status', 'createdAt'],
    group: 'B2B',
    hidden: true, // Workflow data — managed via B2B team flow, not directly
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'companyOwner',
      type: 'relationship',
      relationTo: 'users',
      label: 'Bedrijfseigenaar',
      required: true,
      admin: {
        description: 'De eigenaar van het B2B bedrijfsaccount',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mailadres',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Inkoper', value: 'buyer' },
        { label: 'Financieel', value: 'finance' },
        { label: 'Alleen-lezen', value: 'viewer' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: 'Verstuurd', value: 'pending' },
        { label: 'Geaccepteerd', value: 'accepted' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Ingetrokken', value: 'revoked' },
      ],
    },
    {
      name: 'token',
      type: 'text',
      label: 'Uitnodigingstoken',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Verloopt op',
      required: true,
    },
    {
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Uitgenodigd door',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Persoonlijk bericht',
    },
  ],
}
