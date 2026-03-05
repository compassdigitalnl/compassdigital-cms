import type { Tab } from 'payload'

export const shippingTab: Tab = {
  label: 'Verzending',
  description: 'Gewicht, afmetingen en verzendopties',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'weight', type: 'number', min: 0, label: 'Gewicht', admin: { step: 0.01, width: '50%' } },
        {
          name: 'weightUnit',
          type: 'select',
          label: 'Eenheid',
          defaultValue: 'kg',
          options: [
            { label: 'Kilogram (kg)', value: 'kg' },
            { label: 'Gram (g)', value: 'g' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'dimensionsLength', type: 'number', min: 0, label: 'Lengte (cm)', admin: { step: 0.1, width: '33%' } },
        { name: 'dimensionsWidth', type: 'number', min: 0, label: 'Breedte (cm)', admin: { step: 0.1, width: '33%' } },
        { name: 'dimensionsHeight', type: 'number', min: 0, label: 'Hoogte (cm)', admin: { step: 0.1, width: '34%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'shippingClass', type: 'text', label: 'Verzendklasse', admin: { width: '50%', description: 'Bijv: standard, fragile, hazmat' } },
        { name: 'freeShipping', type: 'checkbox', defaultValue: false, label: 'Gratis Verzending', admin: { width: '50%' } },
      ],
    },
  ],
}
