import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const CompanyAccounts: CollectionConfig = {
  slug: 'company-accounts',
  labels: {
    singular: 'Bedrijfsaccount',
    plural: 'Bedrijfsaccounts',
  },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'kvkNumber', 'owner', 'status'],
    group: 'B2B',
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Bedrijfsnaam',
      required: true,
    },
    {
      name: 'kvkNumber',
      type: 'text',
      label: 'KvK-nummer',
      admin: { description: '8 cijfers' },
    },
    {
      name: 'vatNumber',
      type: 'text',
      label: 'BTW-nummer',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      label: 'Eigenaar (Admin)',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Inactief', value: 'inactive' },
        { label: 'Opgeschort', value: 'suspended' },
      ],
    },
    // ─── Budget (Fase 5.3) ───
    {
      name: 'monthlyBudget',
      type: 'number',
      label: 'Maandbudget (€)',
      admin: { description: 'Laat leeg voor onbeperkt', step: 1 },
    },
    {
      name: 'quarterlyBudget',
      type: 'number',
      label: 'Kwartaalbudget (€)',
      admin: { description: 'Laat leeg voor onbeperkt', step: 1 },
    },
    // ─── Goedkeuring (Fase 5.2) ───
    {
      name: 'approvalThreshold',
      type: 'number',
      label: 'Goedkeuringsdrempel (€)',
      admin: { description: 'Bestellingen boven dit bedrag vereisen goedkeuring. Laat leeg om uit te schakelen.' },
    },
    {
      name: 'approvalRoles',
      type: 'select',
      hasMany: true,
      label: 'Rollen die goedkeuring vereisen',
      options: [
        { label: 'Inkoper', value: 'buyer' },
        { label: 'Alleen-lezen', value: 'viewer' },
      ],
      admin: { description: 'Bestellingen van gebruikers met deze rollen vereisen goedkeuring' },
    },
    // ─── Krediet (Fase 5.4) ───
    {
      name: 'creditLimit',
      type: 'number',
      label: 'Kredietlimiet (€)',
      admin: { description: 'Maximaal openstaand bedrag op rekening' },
    },
    {
      name: 'creditUsed',
      type: 'number',
      label: 'Krediet gebruikt (€)',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'paymentTerms',
      type: 'select',
      label: 'Betaaltermijn',
      defaultValue: '30',
      options: [
        { label: '14 dagen', value: '14' },
        { label: '30 dagen', value: '30' },
        { label: '60 dagen', value: '60' },
      ],
    },
  ],
}
