import type { Field, Tab } from 'payload'
import { features } from '@/lib/tenant/features'

/**
 * Single "Type Configuratie" tab that conditionally shows the right fields
 * based on the selected productType. This avoids empty tabs showing up
 * (Payload CMS doesn't support conditions on tab visibility).
 */

// ─── Grouped Product Fields ──────────────────────────────────────────────────
const groupedFields: Field[] = [
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
]

// ─── Variable Product Fields ─────────────────────────────────────────────────
const variableFields: Field[] = !features.variableProducts ? [] : [
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
          { name: 'label', type: 'text', required: true, label: 'Label' },
          { name: 'value', type: 'text', required: true, label: 'Waarde' },
          { name: 'priceModifier', type: 'number', label: 'Prijs Aanpassing' },
          { name: 'stockLevel', type: 'number', label: 'Voorraad' },
          { name: 'colorCode', type: 'text', label: 'Kleur Code' },
          { name: 'image', type: 'upload', relationTo: 'media', label: 'Afbeelding' },
        ],
      },
    ],
  },
]

// ─── Bundle Product Fields ───────────────────────────────────────────────────
const bundleFields: Field[] = !features.bundleProducts ? [] : [
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
              { name: 'required', type: 'checkbox', defaultValue: true, label: 'Verplicht', admin: { width: '25%' } },
              { name: 'discount', type: 'number', min: 0, max: 100, label: 'Item Korting %', admin: { width: '25%' } },
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
]

// ─── Mix & Match Fields ──────────────────────────────────────────────────────
const mixAndMatchFields: Field[] = !features.mixAndMatch ? [] : [
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
          { name: 'name', type: 'text', required: true, label: 'Naam' },
          { name: 'itemCount', type: 'number', required: true, label: 'Aantal Items' },
          { name: 'price', type: 'number', required: true, label: 'Box Prijs' },
          { name: 'description', type: 'text', label: 'Beschrijving' },
        ],
      },
      {
        name: 'availableProducts',
        type: 'relationship',
        relationTo: 'products',
        hasMany: true,
        required: true,
        label: 'Beschikbare Producten',
      },
      { name: 'discountPercentage', type: 'number', label: 'Box Korting (%)', defaultValue: 20 },
      { name: 'showProgressBar', type: 'checkbox', label: 'Toon Progress Bar', defaultValue: true },
      { name: 'showCategoryFilters', type: 'checkbox', label: 'Toon Categorie Filters', defaultValue: true },
    ],
  },
]

// ─── Bookable Product Fields ─────────────────────────────────────────────────
const bookableFields: Field[] = !features.bookableProducts ? [] : [
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
              { name: 'label', type: 'text', required: true, label: 'Categorie', admin: { width: '25%' } },
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
          { name: 'totalCapacity', type: 'number', min: 1, label: 'Totale Capaciteit', admin: { width: '33%' } },
          { name: 'bufferTime', type: 'number', min: 0, defaultValue: 0, label: 'Buffer Tijd (min.)', admin: { width: '33%' } },
          { name: 'showPricesOnCalendar', type: 'checkbox', defaultValue: false, label: 'Prijzen op Kalender', admin: { width: '34%' } },
        ],
      },
    ],
  },
]

// ─── Configurator Product Fields ─────────────────────────────────────────────
const configuratorFields: Field[] = !features.configuratorProducts ? [] : [
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
        dbName: 'prod_cfg_steps',
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
            dbName: 'prod_cfg_step_opts',
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
]

// ─── Personalized Product Fields ─────────────────────────────────────────────
const personalizedFields: Field[] = !features.personalizedProducts ? [] : [
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
              { name: 'priceModifier', type: 'number', min: 0, label: 'Meerprijs', admin: { step: 0.01, width: '25%' } },
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
                  condition: (_data: any, siblingData: any) => siblingData?.fieldType === 'text',
                },
              },
              { name: 'productionTimeAdded', type: 'number', min: 0, label: 'Extra Productiedagen', admin: { width: '33%' } },
              { name: 'placeholder', type: 'text', label: 'Placeholder', admin: { width: '34%' } },
            ],
          },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'baseProductionDays', type: 'number', min: 0, defaultValue: 5, label: 'Basis Productiedagen', admin: { width: '33%' } },
          { name: 'rushAvailable', type: 'checkbox', defaultValue: false, label: 'Spoedlevering Mogelijk', admin: { width: '33%' } },
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
]

// ─── Subscription Product Fields ─────────────────────────────────────────────
const subscriptionFields: Field[] = !features.subscriptions ? [] : [
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
              { name: 'discountPercentage', type: 'number', min: 0, max: 100, label: 'Korting %', admin: { width: '25%' } },
              { name: 'editionCount', type: 'number', min: 1, label: 'Aantal Edities', admin: { width: '25%' } },
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
          { name: 'trialDays', type: 'number', min: 0, defaultValue: 0, label: 'Proefperiode (dagen)', admin: { width: '33%' } },
          { name: 'minSubscriptionLength', type: 'number', min: 1, label: 'Min. Looptijd (periodes)', admin: { width: '33%' } },
          { name: 'maxSubscriptionLength', type: 'number', min: 1, label: 'Max. Looptijd (periodes)', admin: { width: '34%' } },
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
      },
    ],
  },
]

// ─── Combined Tab ────────────────────────────────────────────────────────────

// Collect all type-specific fields — only non-simple types need this tab
const allTypeFields: Field[] = [
  ...groupedFields,
  ...variableFields,
  ...bundleFields,
  ...mixAndMatchFields,
  ...bookableFields,
  ...configuratorFields,
  ...personalizedFields,
  ...subscriptionFields,
]

// Only show the tab if the product type is NOT simple
export const typeConfigTab: Tab = {
  label: 'Type Configuratie',
  description: 'Instellingen specifiek voor het gekozen product type',
  fields: [
    // Info message when product type is simple
    {
      type: 'ui',
      name: 'simpleProductInfo',
      admin: {
        condition: (data: any) => !data.productType || data.productType === 'simple',
        components: { Field: '@/branches/shared/components/admin/fields/NullField#NullField' },
      },
    },
    ...allTypeFields,
  ],
}
