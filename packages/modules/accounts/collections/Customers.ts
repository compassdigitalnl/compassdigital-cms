import type { CollectionConfig } from 'payload'

/**
 * Customers Collection - B2B/B2C customer accounts
 * Extended from Users with customer-specific fields
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'company', 'customerGroup', 'status', 'createdAt'],
    group: 'Accounts',
    description: 'Klant accounts met B2B/B2C support',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Customers can only read themselves
      return {
        id: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Open registration (can be controlled via module config)
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
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
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                  label: 'Voornaam',
                  admin: { width: '50%' },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                  label: 'Achternaam',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'name',
              type: 'text',
              label: 'Volledige Naam',
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    if (siblingData?.firstName && siblingData?.lastName) {
                      return `${siblingData.firstName} ${siblingData.lastName}`
                    }
                    return siblingData?.name
                  },
                ],
              },
              admin: {
                readOnly: true,
                description: 'Automatisch gegenereerd uit voor- en achternaam',
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Telefoonnummer',
            },
            {
              name: 'dateOfBirth',
              type: 'date',
              label: 'Geboortedatum',
              admin: {
                date: {
                  displayFormat: 'dd-MM-yyyy',
                },
              },
            },
          ],
        },
        {
          label: 'B2B Info',
          fields: [
            {
              name: 'accountType',
              type: 'select',
              required: true,
              defaultValue: 'b2c',
              label: 'Account Type',
              options: [
                { label: 'B2C (Consument)', value: 'b2c' },
                { label: 'B2B (Zakelijk)', value: 'b2b' },
              ],
            },
            {
              name: 'company',
              type: 'text',
              label: 'Bedrijfsnaam',
              admin: {
                condition: (data) => data?.accountType === 'b2b',
              },
            },
            {
              name: 'vatNumber',
              type: 'text',
              label: 'BTW Nummer',
              admin: {
                description: 'Voor B2B: BTW nummer (bijv. NL123456789B01)',
                condition: (data) => data?.accountType === 'b2b',
              },
            },
            {
              name: 'chamberOfCommerce',
              type: 'text',
              label: 'KVK Nummer',
              admin: {
                condition: (data) => data?.accountType === 'b2b',
              },
            },
            {
              name: 'customerGroup',
              type: 'relationship',
              relationTo: 'customer-groups',
              label: 'Klantengroep',
              admin: {
                description: 'Bepaalt pricing en permissions',
              },
            },
            {
              name: 'customPricingRole',
              type: 'text',
              label: 'Custom Pricing Role',
              admin: {
                description: 'Role ID voor custom pricing (bijv. "hospital", "clinic")',
              },
            },
            {
              name: 'discount',
              type: 'number',
              label: 'Persoonlijke Korting (%)',
              min: 0,
              max: 100,
              admin: {
                description: 'Extra korting bovenop groepskorting',
              },
            },
            {
              name: 'creditLimit',
              type: 'number',
              label: 'Kredietlimiet',
              admin: {
                description: 'Maximale openstaande facturen (B2B)',
                condition: (data) => data?.accountType === 'b2b',
              },
            },
            {
              name: 'paymentTerms',
              type: 'select',
              label: 'Betalingstermijn',
              defaultValue: 'immediate',
              options: [
                { label: 'Direct', value: 'immediate' },
                { label: '14 dagen', value: '14' },
                { label: '30 dagen', value: '30' },
                { label: '60 dagen', value: '60' },
                { label: '90 dagen', value: '90' },
              ],
              admin: {
                condition: (data) => data?.accountType === 'b2b',
              },
            },
          ],
        },
        {
          label: 'Addresses',
          fields: [
            {
              name: 'addresses',
              type: 'relationship',
              relationTo: 'addresses',
              hasMany: true,
              label: 'Adressen',
            },
            {
              name: 'defaultBillingAddress',
              type: 'relationship',
              relationTo: 'addresses',
              label: 'Standaard Factuuradres',
            },
            {
              name: 'defaultShippingAddress',
              type: 'relationship',
              relationTo: 'addresses',
              label: 'Standaard Verzendadres',
            },
          ],
        },
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
              label: 'Nieuwsbrief',
            },
            {
              name: 'marketingEmails',
              type: 'checkbox',
              defaultValue: false,
              label: 'Marketing E-mails',
            },
            {
              name: 'orderNotifications',
              type: 'checkbox',
              defaultValue: true,
              label: 'Order Notificaties',
            },
          ],
        },
        {
          label: 'Account Status',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'pending',
              options: [
                { label: 'Pending (Wacht op goedkeuring)', value: 'pending' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Blocked', value: 'blocked' },
              ],
              admin: {
                description: 'B2B accounts kunnen goedkeuring vereisen',
              },
            },
            {
              name: 'approvedBy',
              type: 'relationship',
              relationTo: 'users',
              label: 'Goedgekeurd Door',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'approvedAt',
              type: 'date',
              label: 'Goedgekeurd Op',
              admin: {
                readOnly: true,
                date: {
                  displayFormat: 'dd-MM-yyyy HH:mm',
                },
              },
            },
            {
              name: 'verified',
              type: 'checkbox',
              defaultValue: false,
              label: 'E-mail Geverifieerd',
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Interne Notities',
              admin: {
                description: 'Alleen zichtbaar voor admins',
              },
            },
          ],
        },
        {
          label: 'Statistics',
          fields: [
            {
              name: 'totalOrders',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'totalSpent',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'averageOrderValue',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'lastOrderDate',
              type: 'date',
              admin: {
                readOnly: true,
                date: {
                  displayFormat: 'dd-MM-yyyy',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
