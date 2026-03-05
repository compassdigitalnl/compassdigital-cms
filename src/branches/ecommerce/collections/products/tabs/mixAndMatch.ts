import type { Tab } from 'payload'
import { featureTab } from '@/lib/featureFields'

export const mixAndMatchTabs: Tab[] = featureTab('mixAndMatch', {
  label: 'Mix & Match',
  description: 'Bundle builder - klanten stellen hun eigen box samen',
  fields: [
    {
      name: 'mixMatchConfig',
      type: 'group',
      label: 'Mix & Match Configuratie',
      admin: { condition: (data: any) => data.productType === 'mixAndMatch' },
      fields: [
        {
          name: 'boxSizes',
          type: 'array',
          label: 'Box Formaten',
          required: true,
          admin: { description: 'Verschillende box groottes die klanten kunnen kiezen' },
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Naam', admin: { description: 'bijv. "Small", "Medium", "Large", "Family"' } },
            { name: 'itemCount', type: 'number', required: true, label: 'Aantal Items', admin: { description: 'Hoeveel items in deze box (bijv. 4, 6, 10)' } },
            { name: 'price', type: 'number', required: true, label: 'Box Prijs', admin: { description: 'Vaste prijs voor volle box' } },
            { name: 'description', type: 'text', label: 'Beschrijving', admin: { description: 'bijv. "Perfect voor 1 persoon"' } },
          ],
        },
        {
          name: 'availableProducts',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          required: true,
          label: 'Beschikbare Producten',
          admin: { description: 'Producten die gekozen kunnen worden voor de box' },
        },
        { name: 'discountPercentage', type: 'number', label: 'Box Korting (%)', defaultValue: 20, admin: { description: 'Korting die wordt toegepast wanneer box vol is' } },
        { name: 'showProgressBar', type: 'checkbox', label: 'Toon Progress Bar', defaultValue: true, admin: { description: 'Toon hoeveel items nog geselecteerd moeten worden' } },
        { name: 'showCategoryFilters', type: 'checkbox', label: 'Toon Categorie Filters', defaultValue: true, admin: { description: 'Laat klanten filteren op productcategorieen' } },
      ],
    },
    {
      type: 'ui',
      name: 'mixMatchProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'mixAndMatch',
        components: { Field: '@/branches/shared/components/admin/NullField#NullField' },
      },
    },
  ],
})
