import type { Tab } from 'payload'
import { featureTab } from '@/lib/tenant/featureFields'

export const personalizedProductTabs: Tab[] = featureTab('personalizedProducts', {
  label: 'Personalized Product',
  description: 'Op maat gemaakt product met personalisatie-opties',
  fields: [
    {
      name: 'personalizationConfig',
      type: 'group',
      label: 'Personalisatie Instellingen',
      admin: { condition: (data: any) => data.productType === 'personalized' },
      fields: [
        {
          name: 'personalizationOptions',
          type: 'array',
          label: 'Personalisatie Velden',
          required: true,
          dbName: 'prod_pers_opts',
          admin: { description: 'Definieer welke personalisaties de klant kan doen' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'fieldName', type: 'text', required: true, label: 'Veld Naam', admin: { width: '25%', placeholder: 'bijv. "Tekst", "Kleur"' } },
                {
                  name: 'fieldType',
                  type: 'select',
                  required: true,
                  label: 'Type',
                  dbName: 'prod_pers_opt_field_type',
                  enumName: 'prod_pers_opt_field_type',
                  options: [
                    { label: 'Tekst', value: 'text' },
                    { label: 'Lettertype', value: 'font' },
                    { label: 'Kleur', value: 'color' },
                    { label: 'Afbeelding Upload', value: 'image' },
                  ],
                  admin: { width: '25%' },
                },
                { name: 'required', type: 'checkbox', defaultValue: false, label: 'Verplicht', admin: { width: '25%' } },
                { name: 'priceModifier', type: 'number', min: 0, label: 'Meerprijs', admin: { step: 0.01, width: '25%', description: 'Extra kosten voor deze personalisatie' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxLength',
                  type: 'number',
                  min: 1,
                  label: 'Max. Tekens',
                  admin: {
                    width: '33%',
                    description: 'Alleen voor tekst-velden',
                    condition: (_data: any, siblingData: any) => siblingData?.fieldType === 'text',
                  },
                },
                { name: 'productionTimeAdded', type: 'number', min: 0, label: 'Extra Productiedagen', admin: { width: '33%', description: 'Extra werkdagen door deze personalisatie' } },
                { name: 'placeholder', type: 'text', label: 'Placeholder', admin: { width: '34%', description: 'Voorbeeld tekst in het invulveld' } },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'baseProductionDays', type: 'number', min: 0, defaultValue: 5, label: 'Basis Productiedagen', admin: { width: '33%', description: 'Standaard productietijd in werkdagen' } },
            { name: 'rushAvailable', type: 'checkbox', defaultValue: false, label: 'Spoedlevering Mogelijk', admin: { width: '33%', description: '50% snellere productie tegen meerprijs' } },
            {
              name: 'rushFee',
              type: 'number',
              min: 0,
              label: 'Spoedtoeslag',
              admin: {
                step: 0.01,
                width: '34%',
                condition: (_data: any, siblingData: any) => siblingData?.rushAvailable === true,
              },
            },
          ],
        },
        {
          name: 'availableFonts',
          type: 'array',
          label: 'Beschikbare Lettertypes',
          admin: { description: 'Laat leeg voor standaard lettertypes', initCollapsed: true },
          fields: [
            { name: 'fontName', type: 'text', required: true, label: 'Lettertype', admin: { placeholder: 'bijv. Arial, Times New Roman' } },
          ],
        },
        {
          name: 'presetColors',
          type: 'array',
          label: 'Beschikbare Kleuren',
          admin: { description: 'Laat leeg voor standaard kleurenpalet', initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'colorName', type: 'text', required: true, label: 'Naam', admin: { width: '50%' } },
                { name: 'colorCode', type: 'text', required: true, label: 'Hex Code', admin: { width: '50%', placeholder: '#FF0000' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'ui',
      name: 'personalizedProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'personalized',
        components: { Field: '@/branches/shared/components/admin/fields/NullField#NullField' },
      },
    },
  ],
})
