import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const UptimeIncidents: CollectionConfig = {
  slug: 'uptime-incidents',
  labels: {
    singular: 'Uptime Incident',
    plural: 'Uptime Incidents',
  },
  admin: {
    useAsTitle: 'clientName',
    group: 'Platform',
    defaultColumns: ['clientName', 'status', 'severity', 'startedAt', 'resolvedAt', 'durationMinutes'],
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: () => false,
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'clientId',
      type: 'text',
      required: true,
      label: 'Client ID',
      admin: { readOnly: true },
    },
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Site',
      admin: { readOnly: true },
    },
    {
      name: 'deploymentUrl',
      type: 'text',
      label: 'URL',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'ongoing',
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Resolved', value: 'resolved' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'warning',
      options: [
        { label: 'Warning', value: 'warning' },
        { label: 'Critical', value: 'critical' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'startedAt',
      type: 'date',
      label: 'Gestart',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'resolvedAt',
      type: 'date',
      label: 'Opgelost',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'durationMinutes',
      type: 'number',
      label: 'Duur (minuten)',
      admin: { readOnly: true },
    },
    {
      name: 'failureCount',
      type: 'number',
      label: 'Aantal failures',
      admin: { readOnly: true },
    },
    {
      name: 'lastError',
      type: 'text',
      label: 'Laatste fout',
      admin: { readOnly: true },
    },
    {
      name: 'lastStatusCode',
      type: 'number',
      label: 'Laatste HTTP status',
      admin: { readOnly: true },
    },
    {
      name: 'alertSent',
      type: 'checkbox',
      label: 'Alert verzonden',
      admin: { readOnly: true },
    },
  ],
}

export default UptimeIncidents
