import type { CollectionConfig } from 'payload'

const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: { useAsTitle: 'quoteNumber', group: 'E-commerce' },
  access: {
    read: ({ req: { user } }) => (user ? { user: { equals: user.id } } : false),
    create: ({ req: { user } }) => !!user,
    update: () => false, // only admin
    delete: () => false,
  },
  fields: [
    { name: 'quoteNumber', type: 'text', admin: { readOnly: true } },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nieuw', value: 'new' },
        { label: 'In behandeling', value: 'processing' },
        { label: 'Offerte verstuurd', value: 'quoted' },
        { label: 'Geaccepteerd', value: 'accepted' },
        { label: 'Afgewezen', value: 'rejected' },
        { label: 'Verlopen', value: 'expired' },
      ],
    },
    {
      name: 'products',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'sku', type: 'text' },
        { name: 'quantity', type: 'number', required: true },
      ],
    },
    // Contact info
    { name: 'companyName', type: 'text' },
    { name: 'kvkNumber', type: 'text' },
    { name: 'contactPerson', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'sector', type: 'text' },
    // Delivery
    { name: 'desiredDeliveryDate', type: 'date' },
    {
      name: 'deliveryFrequency',
      type: 'select',
      options: ['Eenmalig', 'Wekelijks', 'Maandelijks', 'Kwartaal'],
    },
    { name: 'notes', type: 'textarea' },
    { name: 'wantsConsultation', type: 'checkbox', defaultValue: false },
    // Response
    { name: 'quotedPrice', type: 'number' },
    { name: 'validUntil', type: 'date' },
    { name: 'internalNotes', type: 'textarea', admin: { condition: () => true } },
    { name: 'submittedAt', type: 'date', admin: { readOnly: true } },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.submittedAt = new Date().toISOString()
          data.quoteNumber = `Q-${Date.now().toString(36).toUpperCase()}`
        }
        return data
      },
    ],
  },
}

export default Quotes
