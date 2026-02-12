import type { CollectionConfig } from 'payload'

/**
 * Users Collection - Extended with B2B/B2C support
 * Supports admin, customer, and custom roles
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    group: 'Core',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Users can only update themselves
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Volledige Naam',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      label: 'Rol',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'Voornaam',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Achternaam',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'company',
      type: 'text',
      label: 'Bedrijf',
      admin: {
        description: 'Bedrijfsnaam (B2B)',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefoonnummer',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Preferences',
          fields: [
            {
              name: 'language',
              type: 'select',
              defaultValue: 'nl',
              options: [
                { label: 'Nederlands', value: 'nl' },
                { label: 'English', value: 'en' },
                { label: 'Deutsch', value: 'de' },
                { label: 'Français', value: 'fr' },
              ],
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'EUR',
              options: [
                { label: 'Euro (EUR)', value: 'EUR' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'British Pound (GBP)', value: 'GBP' },
              ],
            },
            {
              name: 'newsletter',
              type: 'checkbox',
              defaultValue: false,
              label: 'Nieuwsbrief ontvangen',
            },
            {
              name: 'marketingEmails',
              type: 'checkbox',
              defaultValue: false,
              label: 'Marketing e-mails ontvangen',
            },
          ],
        },
        {
          label: 'Metadata',
          fields: [
            {
              name: 'lastLogin',
              type: 'date',
              admin: {
                readOnly: true,
                date: {
                  displayFormat: 'dd-MM-yyyy HH:mm',
                },
              },
            },
            {
              name: 'loginCount',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'verified',
              type: 'checkbox',
              defaultValue: false,
              label: 'E-mail geverifieerd',
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'active',
              options: [
                { label: 'Actief', value: 'active' },
                { label: 'Inactief', value: 'inactive' },
                { label: 'Geblokkeerd', value: 'blocked' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        // Update last login time
        return {
          ...user,
          lastLogin: new Date(),
          loginCount: (user.loginCount || 0) + 1,
        }
      },
    ],
  },
  timestamps: true,
}
