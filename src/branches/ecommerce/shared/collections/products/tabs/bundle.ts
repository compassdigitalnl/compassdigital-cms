import type { Tab } from 'payload'
import { featureTab } from '@/lib/featureFields'

export const bundleProductTabs: Tab[] = featureTab('bundleProducts', {
  label: 'Bundle Product',
  description: 'Vast pakket met meerdere producten',
  fields: [
    {
      name: 'bundleConfig',
      type: 'group',
      label: 'Bundle Configuratie',
      admin: { condition: (data: any) => data.productType === 'bundle' },
      fields: [
        {
          name: 'bundleItems',
          type: 'array',
          label: 'Bundle Items',
          required: true,
          admin: { description: 'Producten in dit bundelpakket' },
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              required: true,
              label: 'Product',
              filterOptions: { productType: { equals: 'simple' } },
            },
            {
              type: 'row',
              fields: [
                { name: 'quantity', type: 'number', required: true, min: 1, defaultValue: 1, label: 'Aantal', admin: { width: '25%' } },
                { name: 'required', type: 'checkbox', defaultValue: true, label: 'Verplicht', admin: { width: '25%', description: 'Kan niet worden verwijderd uit bundel' } },
                { name: 'discount', type: 'number', min: 0, max: 100, label: 'Item Korting %', admin: { width: '25%', description: 'Extra korting op dit item' } },
                { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Volgorde', admin: { width: '25%' } },
              ],
            },
          ],
        },
        {
          name: 'bundleDiscountTiers',
          type: 'array',
          label: 'Bundle Korting Staffels',
          admin: { description: 'Optioneel: korting bij meerdere bundels', initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'minQuantity', type: 'number', required: true, min: 1, label: 'Vanaf aantal', admin: { width: '33%' } },
                { name: 'discountPercentage', type: 'number', required: true, min: 0, max: 100, label: 'Korting %', admin: { width: '33%' } },
                { name: 'label', type: 'text', label: 'Label', admin: { width: '34%', placeholder: 'bijv. "Koop 5+"' } },
              ],
            },
          ],
        },
        {
          name: 'showBundleSavings',
          type: 'checkbox',
          defaultValue: true,
          label: 'Toon Besparing',
          admin: { description: 'Toon hoeveel klant bespaart t.o.v. losse aankoop' },
        },
      ],
    },
    {
      type: 'ui',
      name: 'bundleProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'bundle',
        components: { Field: '@/branches/shared/components/admin/fields/NullField#NullField' },
      },
    },
  ],
})
