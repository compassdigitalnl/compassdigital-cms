import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Both admin and editor roles can access the Payload admin panel
    admin: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: adminOnly, // Only admins can create user accounts
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    group: 'Systeem',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  auth: {
    tokenExpiration: 1209600, // 14 dagen
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'Voornaam',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Achternaam',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefoon',
      admin: {
        placeholder: '+31 6 1234 5678',
      },
    },
    {
      name: 'accountType',
      type: 'select',
      label: 'Account Type',
      defaultValue: 'individual',
      options: [
        {
          label: 'Particulier',
          value: 'individual',
        },
        {
          label: 'B2B Zakelijk',
          value: 'b2b',
        },
      ],
      admin: {
        description: 'B2B accounts hebben toegang tot zakelijke functionaliteiten',
      },
    },
    {
      name: 'company',
      type: 'group',
      label: 'Bedrijfsgegevens',
      admin: {
        condition: (data) => data.accountType === 'b2b',
        description: 'Bedrijfsinformatie voor B2B klanten',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Bedrijfsnaam',
        },
        {
          name: 'kvkNumber',
          type: 'text',
          label: 'KVK Nummer',
          admin: {
            placeholder: '12345678',
          },
        },
        {
          name: 'vatNumber',
          type: 'text',
          label: 'BTW Nummer',
          admin: {
            placeholder: 'NL123456789B01',
          },
        },
        {
          name: 'invoiceEmail',
          type: 'email',
          label: 'Factuur Email',
          admin: {
            description: 'Email voor facturen (indien anders dan hoofdemail)',
          },
        },
      ],
    },
    {
      name: 'addresses',
      type: 'array',
      label: 'Adressen',
      admin: {
        description: 'Verzend- en facturadressen',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Type',
          options: [
            { label: 'Verzendadres', value: 'shipping' },
            { label: 'Factuuradres', value: 'billing' },
            { label: 'Beide', value: 'both' },
          ],
          defaultValue: 'both',
        },
        {
          name: 'street',
          type: 'text',
          required: true,
          label: 'Straat',
        },
        {
          name: 'houseNumber',
          type: 'text',
          required: true,
          label: 'Huisnummer',
          admin: {
            width: '30%',
          },
        },
        {
          name: 'houseNumberAddition',
          type: 'text',
          label: 'Toevoeging',
          admin: {
            width: '20%',
            placeholder: 'A, B, etc.',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: 'Postcode',
          admin: {
            width: '30%',
            placeholder: '1234 AB',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'Plaats',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Nederland',
          label: 'Land',
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          label: 'Standaard adres',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['editor'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'Admin (CompassDigital)',
          value: 'admin',
        },
        {
          label: 'Editor (Klant)',
          value: 'editor',
        },
      ],
    },
    {
      name: 'clientType',
      type: 'select',
      label: 'Type website',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      options: [
        { label: 'Website (informatief)', value: 'website' },
        { label: 'Webshop (e-commerce)', value: 'webshop' },
      ],
      admin: {
        description: 'Bepaalt welke functies en collecties zichtbaar zijn voor deze klant',
        condition: (data) => Array.isArray(data.roles) && data.roles.includes('editor'),
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Gekoppelde klant',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        description: 'De client-omgeving die bij deze gebruiker hoort',
        condition: (data) => Array.isArray(data.roles) && data.roles.includes('editor'),
      },
    },
  ],
}
