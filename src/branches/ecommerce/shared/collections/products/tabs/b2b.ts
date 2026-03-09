import type { Tab } from 'payload'
import { featureTab } from '@/lib/tenant/featureFields'

export const b2bTabs: Tab[] = featureTab('b2b', {
  label: 'B2B',
  description: 'B2B instellingen (MOQ, levertijd, offertes)',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'minOrderQuantity', type: 'number', min: 1, label: 'Minimum Bestelhoeveelheid (MOQ)', admin: { width: '33%', description: 'Minimale afname per order' } },
        { name: 'maxOrderQuantity', type: 'number', min: 1, label: 'Maximum Bestelhoeveelheid', admin: { width: '33%', description: 'Maximale afname per order' } },
        { name: 'orderMultiple', type: 'number', min: 1, label: 'Bestel Veelvoud', admin: { width: '34%', description: 'Alleen bestelbaar in veelvouden van X' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'leadTime', type: 'number', min: 0, label: 'Levertijd (dagen)', admin: { width: '25%', description: 'Standaard levertijd' } },
        { name: 'customizable', type: 'checkbox', defaultValue: false, label: 'Maatwerk Mogelijk', admin: { width: '25%' } },
        { name: 'quotationRequired', type: 'checkbox', defaultValue: false, label: 'Offerte Verplicht', admin: { width: '25%', description: 'Geen directe aankoop' } },
        { name: 'contractPricing', type: 'checkbox', defaultValue: false, label: 'Contract Pricing', admin: { width: '25%', description: 'Prijs o.b.v. contract' } },
      ],
    },
  ],
})
