import type { Tab } from 'payload'
import { featureTab } from '@/lib/featureFields'

export const variableProductTabs: Tab[] = featureTab('variableProducts', {
  label: 'Variable Product',
  description: 'Configureerbare producten met meerdere varianten',
  fields: [
    {
      name: 'variantOptions',
      type: 'array',
      label: 'Variant Opties',
      admin: {
        condition: (data: any) => data.productType === 'variable',
        description: 'Definieer de configuratie-opties (kleur, maat, materiaal, etc.)',
      },
      fields: [
        {
          name: 'optionName',
          type: 'text',
          required: true,
          label: 'Optie Naam',
          admin: { description: 'bijv. "Kleur", "Maat", "Zooltype", "Materiaal"' },
        },
        {
          name: 'displayType',
          type: 'select',
          required: true,
          label: 'Weergave Type',
          defaultValue: 'sizeRadio',
          options: [
            { label: 'Color Swatches (visueel)', value: 'colorSwatch' },
            { label: 'Size Buttons (radio)', value: 'sizeRadio' },
            { label: 'Dropdown (select)', value: 'dropdown' },
            { label: 'Image Selection', value: 'imageRadio' },
            { label: 'Checkbox Add-ons', value: 'checkbox' },
            { label: 'Text/Number Input', value: 'textInput' },
          ],
          admin: { description: 'Hoe de optie wordt weergegeven in de product configurator' },
        },
        {
          name: 'values',
          type: 'array',
          label: 'Waarden',
          required: true,
          admin: { description: 'De beschikbare keuzes voor deze optie' },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Label', admin: { description: 'Weergavenaam (bijv. "Midnight Black", "Maat 42")' } },
            { name: 'value', type: 'text', required: true, label: 'Waarde', admin: { description: 'Interne waarde (bijv. "black", "42")' } },
            { name: 'priceModifier', type: 'number', label: 'Prijs Aanpassing', admin: { description: 'Extra kosten voor deze optie (bijv. +10 voor premium materiaal)' } },
            { name: 'stockLevel', type: 'number', label: 'Voorraad', admin: { description: 'Beschikbare voorraad voor deze variant' } },
            { name: 'colorCode', type: 'text', label: 'Kleur Code', admin: { description: 'Hex kleurcode voor color swatches (bijv. #FF0000)' } },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Afbeelding', admin: { description: 'Voor image selection of thumbnail preview' } },
          ],
        },
      ],
    },
    {
      type: 'ui',
      name: 'variableProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'variable',
        components: { Field: '@/branches/shared/components/admin/fields/NullField#NullField' },
      },
    },
  ],
})
