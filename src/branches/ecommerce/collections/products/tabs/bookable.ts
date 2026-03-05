import type { Tab } from 'payload'
import { featureTab } from '@/lib/featureFields'

export const bookableProductTabs: Tab[] = featureTab('bookableProducts', {
  label: 'Bookable Product',
  description: 'Reserveringen, boekingen en afspraken',
  fields: [
    {
      name: 'bookableConfig',
      type: 'group',
      label: 'Booking Configuratie',
      admin: { condition: (data: any) => data.productType === 'bookable' },
      fields: [
        {
          name: 'durationOptions',
          type: 'array',
          label: 'Duur Opties',
          admin: { description: 'Beschikbare duur voor deze boeking' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'duration', type: 'number', required: true, min: 1, label: 'Duur (minuten)', admin: { width: '25%' } },
                { name: 'label', type: 'text', required: true, label: 'Label', admin: { width: '25%', placeholder: 'bijv. 30 minuten' } },
                { name: 'price', type: 'number', required: true, min: 0, label: 'Prijs', admin: { step: 0.01, width: '25%' } },
                { name: 'popular', type: 'checkbox', defaultValue: false, label: 'Populair', admin: { width: '25%' } },
              ],
            },
            { name: 'description', type: 'text', label: 'Beschrijving' },
          ],
        },
        {
          name: 'timeSlots',
          type: 'array',
          label: 'Tijdsloten',
          admin: { description: 'Beschikbare tijden voor boeking' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'time', type: 'text', required: true, label: 'Tijd', admin: { width: '25%', placeholder: '09:00' } },
                { name: 'available', type: 'checkbox', defaultValue: true, label: 'Beschikbaar', admin: { width: '25%' } },
                { name: 'spotsLeft', type: 'number', min: 0, label: 'Plekken', admin: { width: '25%' } },
                { name: 'priceOverride', type: 'number', min: 0, label: 'Prijs Override', admin: { step: 0.01, width: '25%' } },
              ],
            },
          ],
        },
        {
          name: 'participantCategories',
          type: 'array',
          label: 'Deelnemer Categorieen',
          admin: { description: 'Bijv. Volwassene, Kind, Senior' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Categorie', admin: { width: '25%', placeholder: 'bijv. Volwassene' } },
                { name: 'price', type: 'number', required: true, min: 0, label: 'Prijs p.p.', admin: { step: 0.01, width: '25%' } },
                { name: 'minCount', type: 'number', min: 0, label: 'Min.', admin: { width: '25%' } },
                { name: 'maxCount', type: 'number', min: 0, label: 'Max.', admin: { width: '25%' } },
              ],
            },
            { name: 'description', type: 'text', label: 'Beschrijving' },
          ],
        },
        {
          name: 'addOns',
          type: 'array',
          label: 'Extra Opties / Add-ons',
          admin: { description: 'Aanvullende opties bij de boeking (bijv. lunch, materialen)' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Optie', admin: { width: '33%' } },
                { name: 'price', type: 'number', required: true, min: 0, label: 'Prijs', admin: { step: 0.01, width: '33%' } },
                { name: 'required', type: 'checkbox', defaultValue: false, label: 'Verplicht', admin: { width: '34%' } },
              ],
            },
            { name: 'description', type: 'text', label: 'Beschrijving' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'totalCapacity', type: 'number', min: 1, label: 'Totale Capaciteit', admin: { width: '33%', description: 'Max. deelnemers per sessie' } },
            { name: 'bufferTime', type: 'number', min: 0, defaultValue: 0, label: 'Buffer Tijd (min.)', admin: { width: '33%', description: 'Pauze tussen boekingen' } },
            { name: 'showPricesOnCalendar', type: 'checkbox', defaultValue: false, label: 'Prijzen op Kalender', admin: { width: '34%' } },
          ],
        },
      ],
    },
    {
      type: 'ui',
      name: 'bookableProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'bookable',
        components: { Field: '@/branches/shared/components/admin/NullField#NullField' },
      },
    },
  ],
})
