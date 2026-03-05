import type { Tab } from 'payload'

export const groupedTab: Tab = {
  label: 'Gegroepeerde Producten',
  description: 'Koppel sub-producten voor multi-select bestelling',
  fields: [
    {
      name: 'childProducts',
      type: 'array',
      label: 'Sub-producten',
      admin: {
        description: 'Elk sub-product is een zelfstandig Simple product met eigen SKU, EAN, prijs en voorraad.',
        condition: (data: any) => data.productType === 'grouped',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
          filterOptions: { productType: { equals: 'simple' } },
          admin: { description: 'Alleen Simple producten' },
        },
        {
          type: 'row',
          fields: [
            { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Volgorde', admin: { width: '50%' } },
            { name: 'isDefault', type: 'checkbox', defaultValue: false, label: 'Standaard geselecteerd', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'ui',
      name: 'groupedProductsInfo',
      admin: {
        condition: (data: any) => data.productType !== 'grouped',
        components: { Field: '@/branches/shared/components/admin/NullField#NullField' },
      },
    },
  ],
}
