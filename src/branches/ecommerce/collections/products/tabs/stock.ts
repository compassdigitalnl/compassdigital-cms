import type { Tab } from 'payload'

export const stockTab: Tab = {
  label: 'Voorraad',
  description: 'Voorraadbeheer en beschikbaarheid',
  fields: [
    {
      name: 'trackStock',
      type: 'checkbox',
      defaultValue: true,
      label: 'Voorraad Bijhouden',
      admin: { description: 'Schakel uit voor virtuele/digitale producten' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          min: 0,
          defaultValue: 0,
          label: 'Voorraad Aantal',
          admin: { width: '33%', condition: (data: any) => data.trackStock === true },
        },
        {
          name: 'stockStatus',
          type: 'select',
          label: 'Voorraad Status',
          defaultValue: 'in-stock',
          options: [
            { label: 'Op Voorraad', value: 'in-stock' },
            { label: 'Uitverkocht', value: 'out-of-stock' },
            { label: 'Backorder', value: 'on-backorder' },
            { label: 'Uitgefaseerd', value: 'discontinued' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          min: 0,
          defaultValue: 5,
          label: 'Lage Voorraad Drempel',
          admin: {
            width: '34%',
            description: 'Waarschuwing bij minder dan X stuks',
            condition: (data: any) => data.trackStock === true,
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backordersAllowed',
          type: 'checkbox',
          defaultValue: false,
          label: 'Backorders Toestaan',
          admin: { width: '50%', description: 'Verkopen bij uitverkocht' },
        },
        {
          name: 'availabilityDate',
          type: 'date',
          label: 'Verwachte Leverdatum',
          admin: {
            width: '50%',
            description: 'Bij backorder/pre-order',
            condition: (data: any) => data.stockStatus === 'on-backorder',
            date: { pickerAppearance: 'dayOnly' },
          },
        },
      ],
    },
  ],
}
