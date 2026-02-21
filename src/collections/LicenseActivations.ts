import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'

export const LicenseActivations: CollectionConfig = {
  slug: 'license-activations',
  labels: {
    singular: 'License Activation',
    plural: 'License Activations',
  },
  admin: {
    useAsTitle: 'deviceName',
    group: 'Licenses',
    defaultColumns: ['license', 'deviceName', 'os', 'status', 'activatedAt'],
    description: 'Device activations for licenses',
  },
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      // TODO: Filter by user's licenses
      return true
    },
    create: () => true, // Users can activate their licenses
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: () => true, // Users can deactivate devices
  },
  fields: [
    {
      name: 'license',
      type: 'relationship',
      relationTo: 'licenses',
      required: true,
      label: 'License',
      hasMany: false,
    },
    {
      name: 'deviceName',
      type: 'text',
      required: true,
      label: 'Device Name',
      admin: {
        description: 'e.g., MacBook Pro 16"',
      },
    },
    {
      name: 'deviceId',
      type: 'text',
      required: true,
      label: 'Device ID',
      admin: {
        description: 'Unique hardware identifier',
      },
    },
    {
      name: 'os',
      type: 'text',
      label: 'Operating System',
      admin: {
        description: 'e.g., macOS Ventura, Windows 11 Pro',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Deactivated', value: 'deactivated' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'activatedAt',
      type: 'date',
      required: true,
      label: 'Activated At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'deactivatedAt',
      type: 'date',
      label: 'Deactivated At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lastSeenAt',
      type: 'date',
      label: 'Last Seen',
      admin: {
        description: 'Last time this device checked for updates',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
