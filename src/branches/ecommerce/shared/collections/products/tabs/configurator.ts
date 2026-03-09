import type { Tab } from 'payload'
import { featureTab } from '@/lib/tenant/featureFields'

export const configuratorProductTabs: Tab[] = featureTab('configuratorProducts', {
  label: 'Configurator Product',
  description: 'Stap-voor-stap product samenstellen',
  fields: [
    {
      name: 'configuratorConfig',
      type: 'group',
      label: 'Configurator Instellingen',
      admin: { condition: (data: any) => data.productType === 'configurator' },
      fields: [
        {
          name: 'configuratorSteps',
          type: 'array',
          label: 'Configuratie Stappen',
          required: true,
          admin: { description: 'Definieer de stappen die de klant doorloopt' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Stap Titel', admin: { width: '50%', placeholder: 'bijv. "Kies Kleur"' } },
                { name: 'required', type: 'checkbox', defaultValue: true, label: 'Verplicht', admin: { width: '50%' } },
              ],
            },
            { name: 'description', type: 'text', label: 'Stap Beschrijving' },
            {
              name: 'options',
              type: 'array',
              label: 'Opties',
              required: true,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, label: 'Optie Naam', admin: { width: '33%' } },
                    { name: 'price', type: 'number', required: true, min: 0, label: 'Prijs', admin: { step: 0.01, width: '33%' } },
                    { name: 'recommended', type: 'checkbox', defaultValue: false, label: 'Aanbevolen', admin: { width: '34%' } },
                  ],
                },
                { name: 'description', type: 'text', label: 'Beschrijving' },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Afbeelding' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'ui',
      name: 'configuratorProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'configurator',
        components: { Field: '@/branches/shared/components/admin/fields/NullField#NullField' },
      },
    },
  ],
})
