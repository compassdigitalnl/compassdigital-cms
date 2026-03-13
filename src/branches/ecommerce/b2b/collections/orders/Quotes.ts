import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { quoteStatusHook } from '@/branches/ecommerce/b2b/hooks/quoteStatusHook'

const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: { useAsTitle: 'quoteNumber', group: 'Webshop' },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'editor'], user)) return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
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
      label: 'Producten',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Productnaam' },
        { name: 'sku', type: 'text', label: 'Artikelnummer' },
        { name: 'quantity', type: 'number', required: true, label: 'Aantal' },
        {
          name: 'quotedUnitPrice',
          type: 'number',
          label: 'Stuksprijs offerte (€)',
          admin: {
            step: 0.01,
            description: 'Prijs per stuk in de offerte (excl. BTW). Vul in bij het uitbrengen van de offerte.',
          },
        },
      ],
    },
    // Contact info
    { name: 'companyName', type: 'text', label: 'Bedrijfsnaam' },
    { name: 'kvkNumber', type: 'text', label: 'KvK-nummer' },
    { name: 'contactPerson', type: 'text', label: 'Contactpersoon' },
    { name: 'email', type: 'email', label: 'E-mail' },
    { name: 'phone', type: 'text', label: 'Telefoon' },
    { name: 'sector', type: 'text', label: 'Sector' },
    // Delivery
    { name: 'desiredDeliveryDate', type: 'date', label: 'Gewenste leverdatum' },
    {
      name: 'deliveryFrequency',
      type: 'select',
      label: 'Leverfrequentie',
      options: ['Eenmalig', 'Wekelijks', 'Maandelijks', 'Kwartaal'],
    },
    { name: 'notes', type: 'textarea', label: 'Opmerkingen' },
    { name: 'wantsConsultation', type: 'checkbox', defaultValue: false, label: 'Adviesgesprek gewenst' },
    // Response (admin fills in)
    {
      name: 'quotedPrice',
      type: 'number',
      label: 'Totaalprijs offerte (€)',
      admin: {
        step: 0.01,
        description: 'Totale offerteprijs excl. BTW. Wordt berekend uit stuksprijzen als die zijn ingevuld.',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Geldig tot',
      admin: { description: 'Verloopdatum van de offerte' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Interne notities',
      admin: {
        description: 'Alleen zichtbaar voor admin (niet voor klant)',
      },
    },
    {
      name: 'convertedToOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Omgezet naar bestelling',
      admin: {
        readOnly: true,
        description: 'Automatisch ingevuld wanneer klant de offerte accepteert',
      },
    },
    {
      name: 'acceptedAt',
      type: 'date',
      label: 'Geaccepteerd op',
      admin: { readOnly: true },
    },
    {
      name: 'rejectedAt',
      type: 'date',
      label: 'Afgewezen op',
      admin: { readOnly: true },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      label: 'Reden afwijzing',
      admin: { readOnly: true },
    },
    { name: 'submittedAt', type: 'date', admin: { readOnly: true }, label: 'Aangevraagd op' },
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
    afterChange: [quoteStatusHook],
  },
}

export default Quotes
