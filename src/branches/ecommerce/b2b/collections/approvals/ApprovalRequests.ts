import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { approvalStatusHook } from '@/branches/ecommerce/b2b/hooks/approvalStatusHook'

export const ApprovalRequests: CollectionConfig = {
  slug: 'approval-requests',
  labels: {
    singular: 'Goedkeuringsverzoek',
    plural: 'Goedkeuringsverzoeken',
  },
  admin: {
    useAsTitle: 'orderReference',
    defaultColumns: ['orderReference', 'requestedBy', 'status', 'totalAmount', 'createdAt'],
    group: 'Zakelijk',
    hidden: true, // Workflow data — managed via notificaties/dashboard, not directly
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
      name: 'requestedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Aangevraagd door',
      required: true,
    },
    {
      name: 'approver',
      type: 'relationship',
      relationTo: 'users',
      label: 'Goedgekeurd/afgewezen door',
    },
    {
      name: 'orderReference',
      type: 'text',
      label: 'Orderreferentie',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: 'In afwachting', value: 'pending' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgewezen', value: 'rejected' },
        { label: 'Verlopen', value: 'expired' },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Totaalbedrag (€)',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'reason',
      type: 'select',
      label: 'Reden goedkeuring',
      options: [
        { label: 'Boven goedkeuringsdrempel', value: 'threshold' },
        { label: 'Boven budgetlimiet', value: 'budget' },
        { label: 'Handmatig aangevraagd', value: 'manual' },
      ],
    },
    {
      name: 'items',
      type: 'json',
      label: 'Bestelregels',
      admin: { readOnly: true },
    },
    {
      name: 'shippingAddress',
      type: 'json',
      label: 'Verzendadres',
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Opmerking aanvrager',
    },
    {
      name: 'reviewNote',
      type: 'textarea',
      label: 'Opmerking beoordelaar',
    },
    {
      name: 'reviewedAt',
      type: 'date',
      label: 'Beoordeeld op',
      admin: { readOnly: true },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Verloopt op',
    },
  ],
  hooks: {
    afterChange: [approvalStatusHook],
  },
}
