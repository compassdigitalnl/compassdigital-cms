import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'
import { featureTab } from '@/lib/featureFields'

export const EcommerceSettings: GlobalConfig = {
  slug: 'e-commerce-settings',
  label: 'E-commerce Instellingen',
  admin: {
    group: 'E-commerce',
    description: 'Alle e-commerce instellingen: verzending, betaling, B2B en features',
    hidden: !isClientDeployment(),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── TAB 1: ALGEMEEN (uit Settings.ts E-commerce + Functies tabs) ────
        ...featureTab('shop', {
          label: 'Algemeen',
          description: 'Webshop filters, verzending, retour en feature toggles',
          fields: [
            {
              name: 'shopFilterOrder',
              type: 'array',
              label: 'Webshop Filter Volgorde',
              admin: {
                description: 'Configureer de volgorde en zichtbaarheid van filters op de shop pagina. Sleep items om de volgorde te wijzigen.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'filterId',
                  type: 'select',
                  label: 'Filter',
                  required: true,
                  options: [
                    { label: 'Merk (fabrikant)', value: 'manufacturers' },
                    { label: 'Productlijn', value: 'productLines' },
                    { label: 'Beschikbaarheid', value: 'stock' },
                    { label: 'Prijs', value: 'price' },
                    { label: 'Afmeting', value: 'spec_afmeting' },
                    { label: 'Afwerking borststuk', value: 'spec_afwerking_borststuk' },
                    { label: 'Aantal laags', value: 'spec_aantal_laags' },
                    { label: 'Aantal stuks', value: 'spec_aantal_stuks' },
                    { label: 'Diameter', value: 'spec_diameter' },
                    { label: 'Filter', value: 'spec_filter' },
                    { label: 'Gauge', value: 'spec_gauge' },
                    { label: 'Inhoud', value: 'spec_inhoud' },
                    { label: 'Kenmerken', value: 'spec_kenmerken' },
                    { label: 'Kleur', value: 'spec_kleur' },
                    { label: 'Kleur band', value: 'spec_kleur_band' },
                    { label: 'Kleur borststuk', value: 'spec_kleur_borststuk' },
                    { label: 'Kleur handschoen', value: 'spec_kleur_handschoen' },
                    { label: 'Kleur handvat', value: 'spec_kleur_handvat' },
                    { label: 'Kleur kraan', value: 'spec_kleur_kraan' },
                    { label: 'Kleur lijm', value: 'spec_kleur_lijm' },
                    { label: 'Kleur muts', value: 'spec_kleur_muts' },
                    { label: 'Kleur slang', value: 'spec_kleur_slang' },
                    { label: 'Kleur tape', value: 'spec_kleur_tape' },
                    { label: 'Kleur vaatteugel', value: 'spec_kleur_vaatteugel' },
                    { label: 'Kleur verband', value: 'spec_kleur_verband' },
                    { label: 'Kleur zitvlak', value: 'spec_kleur_zitvlak' },
                    { label: 'Lengte', value: 'spec_lengte' },
                    { label: 'Maat', value: 'spec_maat' },
                    { label: 'Materiaal', value: 'spec_materiaal' },
                    { label: 'Naaldlengte', value: 'spec_naaldlengte' },
                    { label: 'Schaalverdeling', value: 'spec_schaalverdeling' },
                    { label: 'Steriel', value: 'spec_steriel' },
                    { label: 'Substantie', value: 'spec_substantie' },
                    { label: 'Uitvoering', value: 'spec_uitvoering' },
                    { label: 'Verpakkingseenheid', value: 'spec_verpakkingseenheid' },
                    { label: 'Volume', value: 'spec_volume' },
                  ],
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Zichtbaar op shop pagina',
                  defaultValue: true,
                },
                {
                  name: 'displayName',
                  type: 'text',
                  label: 'Weergavenaam (optioneel)',
                  admin: {
                    description: 'Laat leeg om de standaard naam te gebruiken',
                    placeholder: 'Bijv: "Productmerken" of "Op voorraad"',
                  },
                },
              ],
              defaultValue: [
                { filterId: 'manufacturers', enabled: true },
                { filterId: 'productLines', enabled: true },
                { filterId: 'stock', enabled: true },
                { filterId: 'price', enabled: true },
              ],
            },
            {
              name: 'freeShippingThreshold',
              type: 'number',
              required: true,
              defaultValue: 150,
              label: 'Gratis verzending vanaf (€)',
              admin: {
                step: 0.01,
                description: 'Bestellingen boven dit bedrag krijgen gratis verzending',
              },
            },
            {
              name: 'shippingCost',
              type: 'number',
              required: true,
              defaultValue: 6.95,
              label: 'Verzendkosten (€)',
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'deliveryTime',
              type: 'text',
              required: true,
              defaultValue: 'Besteld voor 16:00, morgen in huis',
              label: 'Levertijd Tekst',
              admin: {
                description: "Wordt getoond op productpagina's",
              },
            },
            {
              name: 'deliveryDays',
              type: 'group',
              label: 'Bezorgdagen',
              fields: [
                { name: 'monday', type: 'checkbox', label: 'Maandag', defaultValue: true },
                { name: 'tuesday', type: 'checkbox', label: 'Dinsdag', defaultValue: true },
                { name: 'wednesday', type: 'checkbox', label: 'Woensdag', defaultValue: true },
                { name: 'thursday', type: 'checkbox', label: 'Donderdag', defaultValue: true },
                { name: 'friday', type: 'checkbox', label: 'Vrijdag', defaultValue: true },
                { name: 'saturday', type: 'checkbox', label: 'Zaterdag', defaultValue: false },
                { name: 'sunday', type: 'checkbox', label: 'Zondag', defaultValue: false },
              ],
            },
            {
              name: 'returnDays',
              type: 'number',
              required: true,
              defaultValue: 30,
              label: 'Retour termijn (dagen)',
              admin: {
                description: 'Hoeveel dagen heeft klant om product te retourneren',
              },
            },
            {
              name: 'returnPolicy',
              type: 'richText',
              label: 'Retourbeleid',
              admin: {
                description: 'Volledige retourbeleid tekst',
              },
            },
            // Feature toggles (uit Settings.ts Functies tab)
            {
              name: 'features',
              type: 'group',
              label: 'Feature Toggles',
              fields: [
                {
                  name: 'enableQuickOrder',
                  type: 'checkbox',
                  label: 'Quick Order Functie',
                  defaultValue: true,
                  admin: {
                    description: 'Bulkbestelling op basis van artikelnummers',
                  },
                },
                {
                  name: 'enableOrderLists',
                  type: 'checkbox',
                  label: 'Bestellijsten',
                  defaultValue: true,
                  admin: {
                    description: 'Klanten kunnen favorieten lijsten maken',
                  },
                },
                {
                  name: 'enableReviews',
                  type: 'checkbox',
                  label: 'Product Reviews',
                  defaultValue: false,
                  admin: {
                    description: 'Klanten kunnen producten reviewen',
                  },
                },
                {
                  name: 'enableWishlist',
                  type: 'checkbox',
                  label: 'Verlanglijstje',
                  defaultValue: true,
                },
                {
                  name: 'enableStockNotifications',
                  type: 'checkbox',
                  label: 'Voorraad Notificaties',
                  defaultValue: false,
                  admin: {
                    description: 'Klanten krijgen bericht als product weer op voorraad is',
                  },
                },
              ],
            },
          ],
        }),

        // ─── TAB 2: B2B INSTELLINGEN (uit Settings.ts B2B tab) ────
        ...featureTab('b2b', {
          label: 'B2B Instellingen',
          description: 'B2B specifieke instellingen',
          fields: [
            {
              name: 'minimumOrderAmount',
              type: 'number',
              label: 'Minimaal bestelbedrag (€)',
              admin: {
                step: 0.01,
                description: 'Optioneel - laat leeg voor geen minimum',
              },
            },
            {
              name: 'showPricesExclVAT',
              type: 'checkbox',
              label: 'Toon prijzen exclusief BTW',
              defaultValue: true,
              admin: {
                description: 'Voor B2B: prijzen excl. BTW, voor B2C: incl. BTW',
              },
            },
            {
              name: 'vatPercentage',
              type: 'number',
              defaultValue: 21,
              label: 'BTW Percentage (%)',
              admin: {
                description: 'Standaard BTW percentage (NL: 21%)',
              },
            },
            {
              name: 'requireAccountForPurchase',
              type: 'checkbox',
              label: 'Account vereist voor aankoop',
              defaultValue: true,
              admin: {
                description: 'B2B mode: klanten moeten ingelogd zijn om te bestellen',
              },
            },
            {
              name: 'enableGuestCheckout',
              type: 'checkbox',
              label: 'Guest checkout toestaan',
              defaultValue: false,
              admin: {
                description: 'Sta eenmalige bestellingen toe zonder account (vereist requireAccountForPurchase = false)',
              },
            },
            {
              name: 'requireB2BApproval',
              type: 'checkbox',
              label: 'Handmatige B2B account goedkeuring',
              defaultValue: true,
              admin: {
                description: 'Nieuwe B2B accounts moeten eerst goedgekeurd worden door admin',
              },
            },
            {
              name: 'b2bBenefits',
              type: 'array',
              label: 'B2B Voordelen',
              maxRows: 8,
              admin: {
                description: 'Voordelen op registratie- en checkout pagina\'s',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Lucide icoon naam',
                  admin: {
                    placeholder: 'bijv. Tag, CreditCard, ClipboardList',
                    description: 'Naam van een Lucide icoon (zie lucide.dev/icons)',
                  },
                },
                {
                  name: 'iconColor',
                  type: 'text',
                  label: 'Icoon kleur',
                  admin: {
                    placeholder: 'bijv. #00897B of var(--color-teal)',
                  },
                },
                {
                  name: 'iconBg',
                  type: 'text',
                  label: 'Icoon achtergrond',
                  admin: {
                    placeholder: 'bijv. var(--color-primary-glow)',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titel',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                },
              ],
            },
            {
              name: 'registrationTrustItems',
              type: 'array',
              label: 'Registratie Trust Items',
              maxRows: 8,
              admin: {
                description: 'Vertrouwensindicatoren op registratiepagina',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Tekst',
                  required: true,
                },
              ],
            },
          ],
        }),

        // ─── TAB 3: VERZENDMETHODEN (vervangt shipping-methods collection) ────
        ...featureTab('checkout', {
          label: 'Verzendmethoden',
          description: 'Verzendopties voor de checkout',
          fields: [
            {
              name: 'shippingMethods',
              type: 'array',
              label: 'Verzendmethoden',
              admin: {
                description: 'Configureer de beschikbare verzendmethoden in de checkout',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                  admin: {
                    description: 'Bijv: Standaard verzending, Express, Ophalen in winkel',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  label: 'Slug',
                  admin: {
                    description: 'Unieke identifier (bijv: standard, express, pickup)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  admin: {
                    description: 'Optionele toelichting zichtbaar in de checkout',
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Lucide Icoon',
                  defaultValue: 'truck',
                  admin: {
                    description: 'Kies een Lucide icoon voor deze verzendmethode',
                  },
                  options: [
                    { label: 'Truck', value: 'truck' },
                    { label: 'Zap (express)', value: 'zap' },
                    { label: 'Package', value: 'package' },
                    { label: 'Clock (same-day)', value: 'clock' },
                    { label: 'Send', value: 'send' },
                    { label: 'Store (ophalen)', value: 'store' },
                    { label: 'Map Pin (locatie)', value: 'map-pin' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'Globe (internationaal)', value: 'globe' },
                    { label: 'Box', value: 'box' },
                    { label: 'Star', value: 'star' },
                    { label: 'Shield Check', value: 'shield-check' },
                  ],
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Prijs (€)',
                  min: 0,
                  admin: {
                    description: 'Verzendkosten in euro (0 = gratis)',
                    step: 0.01,
                  },
                },
                {
                  name: 'freeThreshold',
                  type: 'number',
                  label: 'Gratis vanaf (€)',
                  min: 0,
                  admin: {
                    description: 'Gratis verzending bij bestellingen boven dit bedrag (leeg = nooit gratis)',
                    step: 0.01,
                  },
                },
                {
                  name: 'estimatedDays',
                  type: 'number',
                  label: 'Geschatte levertijd (dagen)',
                  min: 0,
                },
                {
                  name: 'deliveryTime',
                  type: 'text',
                  label: 'Levertijd tekst',
                  admin: {
                    description: 'Bijv: 2-3 werkdagen, Volgende werkdag',
                  },
                },
                {
                  name: 'countries',
                  type: 'select',
                  hasMany: true,
                  label: 'Beschikbare landen',
                  dbName: 'ecom_ship_countries',
                  enumName: 'ecom_ship_country_vals',
                  options: [
                    { label: 'Nederland', value: 'NL' },
                    { label: 'België', value: 'BE' },
                    { label: 'Duitsland', value: 'DE' },
                    { label: 'Frankrijk', value: 'FR' },
                    { label: 'Verenigd Koninkrijk', value: 'UK' },
                  ],
                  defaultValue: ['NL'],
                  admin: {
                    description: 'In welke landen is deze verzendmethode beschikbaar?',
                  },
                },
                {
                  name: 'isActive',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Actief',
                  admin: {
                    description: 'Alleen actieve methoden worden in de checkout getoond',
                  },
                },
                {
                  name: 'sortOrder',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Sortering',
                  admin: {
                    description: 'Lagere waarde = eerder getoond',
                  },
                },
              ],
            },
          ],
        }),

        // ─── TAB 4: BETAALOPTIES (vervangt checkout-payment-options collection) ────
        ...featureTab('checkout', {
          label: 'Betaalopties',
          description: 'Beschikbare betaalmethoden in de checkout',
          fields: [
            {
              name: 'paymentOptions',
              type: 'array',
              label: 'Betaalopties',
              admin: {
                description: 'Configureer de beschikbare betaalmethoden',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                  admin: {
                    description: 'Bijv: iDEAL, Creditcard, Op rekening',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  label: 'Slug',
                  admin: {
                    description: 'Unieke identifier (bijv: ideal, creditcard, invoice)',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                  admin: {
                    description: 'Korte uitleg zichtbaar in de checkout',
                  },
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (afbeelding)',
                  admin: {
                    description: 'Upload een SVG/PNG logo. Heeft voorrang op het Lucide icoon.',
                  },
                },
                {
                  name: 'lucideIcon',
                  type: 'select',
                  label: 'Lucide Icoon',
                  admin: {
                    description: 'Wordt gebruikt als er geen logo is geüpload',
                  },
                  options: [
                    { label: 'Credit Card', value: 'credit-card' },
                    { label: 'Landmark (bank)', value: 'landmark' },
                    { label: 'Building', value: 'building' },
                    { label: 'Banknote', value: 'banknote' },
                    { label: 'Wallet', value: 'wallet' },
                    { label: 'Receipt', value: 'receipt' },
                    { label: 'Hand Coins', value: 'hand-coins' },
                    { label: 'Circle Dollar Sign', value: 'circle-dollar-sign' },
                    { label: 'Shield Check', value: 'shield-check' },
                    { label: 'Globe', value: 'globe' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'Package', value: 'package' },
                    { label: 'Shopping Cart', value: 'shopping-cart' },
                    { label: 'Arrow Right Left', value: 'arrow-right-left' },
                    { label: 'Badge Check', value: 'badge-check' },
                    { label: 'Send', value: 'send' },
                  ],
                },
                {
                  name: 'provider',
                  type: 'select',
                  label: 'Payment Provider',
                  defaultValue: 'manual',
                  options: [
                    { label: 'Mollie', value: 'mollie' },
                    { label: 'Stripe', value: 'stripe' },
                    { label: 'MultiSafepay', value: 'multisafepay' },
                    { label: 'Handmatig / Op rekening', value: 'manual' },
                  ],
                  admin: {
                    description: 'Welke payment provider verwerkt deze methode?',
                  },
                },
                {
                  name: 'fee',
                  type: 'text',
                  label: 'Transactiekosten',
                  admin: {
                    description: 'Optioneel: bijv. "€0.29 per transactie"',
                  },
                },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge',
                  admin: {
                    description: 'Optioneel label: bijv. "Populair", "Aanbevolen"',
                  },
                },
                {
                  name: 'isB2B',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Alleen B2B',
                  admin: {
                    description: 'Alleen tonen voor zakelijke klanten',
                  },
                },
                {
                  name: 'isActive',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Actief',
                  admin: {
                    description: 'Alleen actieve opties worden in de checkout getoond',
                  },
                },
                {
                  name: 'sortOrder',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Sortering',
                  admin: {
                    description: 'Lagere waarde = eerder getoond',
                  },
                },
              ],
            },
          ],
        }),
      ],
    },
  ],
}
