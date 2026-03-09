import type { Tab } from 'payload'
import { featureTab } from '@/lib/tenant/featureFields'

export const subscriptionProductTabs: Tab[] = featureTab('subscriptions', {
  label: 'Subscription Product',
  description: 'Abonnement / terugkerende levering',
  fields: [
    {
      name: 'subscriptionConfig',
      type: 'group',
      label: 'Abonnement Configuratie',
      admin: { condition: (data: any) => data.productType === 'subscription' },
      fields: [
        {
          name: 'subscriptionPlans',
          type: 'array',
          label: 'Abonnement Plannen',
          required: true,
          admin: { description: 'De beschikbare abonnementsvormen' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Plan Naam', admin: { width: '33%', placeholder: 'bijv. "Maandelijks", "Jaarabonnement"' } },
                {
                  name: 'interval',
                  type: 'select',
                  required: true,
                  label: 'Interval',
                  options: [
                    { label: 'Dagelijks', value: 'day' },
                    { label: 'Wekelijks', value: 'week' },
                    { label: 'Maandelijks', value: 'month' },
                    { label: 'Per kwartaal', value: 'quarter' },
                    { label: 'Jaarlijks', value: 'year' },
                  ],
                  admin: { width: '33%' },
                },
                { name: 'price', type: 'number', required: true, min: 0, label: 'Prijs per periode', admin: { step: 0.01, width: '34%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'discountPercentage', type: 'number', min: 0, max: 100, label: 'Korting %', admin: { width: '25%', description: 'T.o.v. losse aankoop' } },
                { name: 'editionCount', type: 'number', min: 1, label: 'Aantal Edities', admin: { width: '25%', description: 'Voor publicaties: aantal nummers' } },
                { name: 'autoRenew', type: 'checkbox', defaultValue: true, label: 'Auto-verlenging', admin: { width: '25%' } },
                { name: 'popular', type: 'checkbox', defaultValue: false, label: 'Populair / Aanbevolen', admin: { width: '25%' } },
              ],
            },
            {
              name: 'features',
              type: 'array',
              label: 'Voordelen',
              admin: { description: 'Opsomming voordelen bij dit plan' },
              fields: [
                { name: 'feature', type: 'text', required: true, label: 'Voordeel' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'trialDays', type: 'number', min: 0, defaultValue: 0, label: 'Proefperiode (dagen)', admin: { width: '33%', description: '0 = geen proefperiode' } },
            { name: 'minSubscriptionLength', type: 'number', min: 1, label: 'Min. Looptijd (periodes)', admin: { width: '33%', description: 'Minimale duur voor opzegging' } },
            { name: 'maxSubscriptionLength', type: 'number', min: 1, label: 'Max. Looptijd (periodes)', admin: { width: '34%', description: 'Leeg = onbeperkt' } },
          ],
        },
        {
          name: 'cancellationPolicy',
          type: 'textarea',
          label: 'Opzegbeleid',
          admin: { description: 'Voorwaarden voor opzegging van het abonnement' },
        },
        {
          name: 'subscriptionType',
          type: 'select',
          label: 'Abonnement Type',
          defaultValue: 'recurring',
          options: [
            { label: 'Terugkerend (bijv. maandbox)', value: 'recurring' },
            { label: 'Persoonlijk abonnement', value: 'personal' },
            { label: 'Cadeau abonnement', value: 'gift' },
            { label: 'Proefabonnement', value: 'trial' },
          ],
          admin: { description: 'Bepaalt de checkout-flow en e-mail templates' },
        },
      ],
    },
    {
      type: 'ui',
      name: 'subscriptionProductInfo',
      admin: {
        condition: (data: any) => data.productType !== 'subscription',
        components: { Field: '@/branches/shared/components/admin/fields/NullField#NullField' },
      },
    },
  ],
})
