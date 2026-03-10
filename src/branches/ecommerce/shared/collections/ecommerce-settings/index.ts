import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/tenant/isClientDeployment'
import { featureTab } from '@/lib/tenant/featureFields'

export const EcommerceSettings: GlobalConfig = {
  slug: 'e-commerce-settings',
  label: 'E-commerce Instellingen',
  admin: {
    group: 'Instellingen',
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
        // ─── TAB 0: FEATURE TOGGLES (altijd zichtbaar) ────
        {
          label: 'Feature Toggles',
          description: 'Schakel features aan of uit. Uitgeschakelde features worden verborgen uit het admin menu en de frontend.',
          fields: [
            {
              name: 'featureToggles',
              type: 'group',
              label: ' ',
              admin: { hideGutter: true },
              fields: [
                // ── Catalogus & Winkel ──
                {
                  name: 'enableProducts',
                  type: 'checkbox',
                  label: 'Producten & Catalogus',
                  defaultValue: true,
                  admin: { description: 'Producten, categorieën en de webshop pagina' },
                },
                {
                  name: 'enableBrands',
                  type: 'checkbox',
                  label: 'Merken',
                  defaultValue: true,
                  admin: { description: 'Merkenpagina en merkfilter in de shop' },
                },
                {
                  name: 'enableBranches',
                  type: 'checkbox',
                  label: 'Vestigingen',
                  defaultValue: false,
                  admin: { description: 'Vestigingen / filialen met locatiegegevens' },
                },
                {
                  name: 'enableRecentlyViewed',
                  type: 'checkbox',
                  label: 'Recent Bekeken',
                  defaultValue: false,
                  admin: { description: 'Toont recent bekeken producten aan klanten' },
                },
                {
                  name: 'enableEditionNotifications',
                  type: 'checkbox',
                  label: 'Editie Notificaties',
                  defaultValue: false,
                  admin: { description: 'Klanten ontvangen notificatie bij nieuwe product edities' },
                },

                // ── Reviews & Verlanglijst ──
                {
                  name: 'enableReviews',
                  type: 'checkbox',
                  label: 'Product Reviews',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen producten reviewen en beoordelen' },
                },
                {
                  name: 'enableWishlist',
                  type: 'checkbox',
                  label: 'Verlanglijstje',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen een verlanglijstje bijhouden' },
                },

                // ── Checkout & Bestellingen ──
                {
                  name: 'enableOrders',
                  type: 'checkbox',
                  label: 'Bestellingen',
                  defaultValue: true,
                  admin: { description: 'Bestellingen, checkout en orderoverzicht' },
                },
                {
                  name: 'enableInvoices',
                  type: 'checkbox',
                  label: 'Facturen',
                  defaultValue: true,
                  admin: { description: 'Automatische factuurgeneratie (PDF)' },
                },
                {
                  name: 'enableReturns',
                  type: 'checkbox',
                  label: 'Retouren',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen retourverzoeken indienen' },
                },
                {
                  name: 'enablePromotions',
                  type: 'checkbox',
                  label: 'Promoties & Kortingscodes',
                  defaultValue: true,
                  admin: { description: 'Kortingscodes, automatische kortingen en promotieacties' },
                },

                // ── Mijn Account ──
                {
                  name: 'enableQuickOrder',
                  type: 'checkbox',
                  label: 'Quick Order',
                  defaultValue: false,
                  admin: { description: 'Bulkbestelling op basis van artikelnummers' },
                },
                {
                  name: 'enableOrderLists',
                  type: 'checkbox',
                  label: 'Bestellijsten',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen favorieten lijsten maken' },
                },
                {
                  name: 'enableRecurringOrders',
                  type: 'checkbox',
                  label: 'Herhalingsbestellingen',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen bestellingen automatisch laten herhalen' },
                },
                {
                  name: 'enableNotifications',
                  type: 'checkbox',
                  label: 'Notificaties',
                  defaultValue: false,
                  admin: { description: 'In-app notificaties voor klanten' },
                },

                // ── Loyalty & Abonnementen ──
                {
                  name: 'enableLoyalty',
                  type: 'checkbox',
                  label: 'Loyaliteitsprogramma',
                  defaultValue: false,
                  admin: { description: 'Punten, tiers, beloningen en transacties' },
                },
                {
                  name: 'enableSubscriptions',
                  type: 'checkbox',
                  label: 'Abonnementen',
                  defaultValue: false,
                  admin: { description: 'Abonnementsplannen, klantabonnementen en betaalmethoden' },
                },
                {
                  name: 'enableGiftVouchers',
                  type: 'checkbox',
                  label: 'Cadeaubonnen',
                  defaultValue: false,
                  admin: { description: 'Digitale cadeaubonnen verkopen en inwisselen' },
                },
                {
                  name: 'enableLicenses',
                  type: 'checkbox',
                  label: 'Licenties',
                  defaultValue: false,
                  admin: { description: 'Softwarelicenties, activaties en licentiebeheer' },
                },

                // ── B2B ──
                {
                  name: 'enableCustomerGroups',
                  type: 'checkbox',
                  label: 'Klantgroepen & Groepsprijzen',
                  defaultValue: false,
                  admin: { description: 'Klantgroepen met specifieke prijzen en kortingen' },
                },
                {
                  name: 'enableCompanyAccounts',
                  type: 'checkbox',
                  label: 'Bedrijfsaccounts',
                  defaultValue: false,
                  admin: { description: 'Bedrijfsaccounts met uitnodigingen en teamleden' },
                },
                {
                  name: 'enableApprovalWorkflow',
                  type: 'checkbox',
                  label: 'Goedkeuringsworkflow',
                  defaultValue: false,
                  admin: { description: 'Bestellingen moeten goedgekeurd worden door manager' },
                },
                {
                  name: 'enableQuotes',
                  type: 'checkbox',
                  label: 'Offertes',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen offertes aanvragen' },
                },

                // ── Marktplaats ──
                {
                  name: 'enableVendors',
                  type: 'checkbox',
                  label: 'Vendors (Marktplaats)',
                  defaultValue: false,
                  admin: { description: 'Multi-vendor marktplaats met eigen producten per vendor' },
                },
                {
                  name: 'enableVendorReviews',
                  type: 'checkbox',
                  label: 'Vendor Reviews',
                  defaultValue: false,
                  admin: { description: 'Klanten kunnen vendors beoordelen' },
                },
                {
                  name: 'enableWorkshops',
                  type: 'checkbox',
                  label: 'Workshops',
                  defaultValue: false,
                  admin: { description: 'Workshops en evenementen van vendors' },
                },

                // ── Content & Publicaties ──
                {
                  name: 'enableBlog',
                  type: 'checkbox',
                  label: 'Blog',
                  defaultValue: true,
                  admin: { description: 'Blog posts en blog categorieën' },
                },
                {
                  name: 'enableTestimonials',
                  type: 'checkbox',
                  label: 'Testimonials',
                  defaultValue: true,
                  admin: { description: 'Klantbeoordelingen en referenties' },
                },
                {
                  name: 'enableCases',
                  type: 'checkbox',
                  label: 'Cases / Portfolio',
                  defaultValue: false,
                  admin: { description: 'Portfolio items en case studies' },
                },
                {
                  name: 'enablePartners',
                  type: 'checkbox',
                  label: 'Partners',
                  defaultValue: false,
                  admin: { description: 'Partnerbedrijven en samenwerkingen' },
                },
                {
                  name: 'enableServices',
                  type: 'checkbox',
                  label: 'Diensten',
                  defaultValue: false,
                  admin: { description: 'Diensten en services overzicht' },
                },
                {
                  name: 'enableMagazines',
                  type: 'checkbox',
                  label: 'Magazines & Publicaties',
                  defaultValue: false,
                  admin: { description: 'Digitale magazines, edities en digital library' },
                },

                // ── Branche-specifiek ──
                {
                  name: 'enableExperiences',
                  type: 'checkbox',
                  label: 'Ervaringen',
                  defaultValue: false,
                  admin: { description: 'Ervaringen, categorieën en reviews (Tourism/Hospitality)' },
                },
                {
                  name: 'enableConstruction',
                  type: 'checkbox',
                  label: 'Bouw',
                  defaultValue: false,
                  admin: { description: 'Bouwdiensten, projecten, reviews en offerteaanvragen' },
                },
                {
                  name: 'enableHospitality',
                  type: 'checkbox',
                  label: 'Zorg / Welzijn',
                  defaultValue: false,
                  admin: { description: 'Behandelingen, praktijkhouders en afspraken' },
                },
                {
                  name: 'enableBeauty',
                  type: 'checkbox',
                  label: 'Beauty / Salon',
                  defaultValue: false,
                  admin: { description: 'Salonservices, stylisten en boekingen' },
                },
                {
                  name: 'enableHoreca',
                  type: 'checkbox',
                  label: 'Horeca',
                  defaultValue: false,
                  admin: { description: 'Menu items, reserveringen en evenementen' },
                },

                // ── Geavanceerd ──
                {
                  name: 'enableAbTesting',
                  type: 'checkbox',
                  label: 'A/B Testing',
                  defaultValue: false,
                  admin: { description: 'A/B testen van pagina varianten' },
                },
                {
                  name: 'enablePushNotifications',
                  type: 'checkbox',
                  label: 'Push Notificaties',
                  defaultValue: false,
                  admin: { description: 'Web push notificaties (PWA)' },
                },
                {
                  name: 'enableStockNotifications',
                  type: 'checkbox',
                  label: 'Voorraad Notificaties',
                  defaultValue: false,
                  admin: { description: 'Klanten krijgen bericht als product weer op voorraad is' },
                },
              ],
            },
          ],
        },

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
            // Legacy feature toggles — beheerd via Feature Toggles tab
            {
              name: 'features',
              type: 'group',
              label: 'Feature Toggles',
              admin: { hidden: true },
              fields: [
                { name: 'enableQuickOrder', type: 'checkbox', defaultValue: true },
                { name: 'enableOrderLists', type: 'checkbox', defaultValue: false },
                { name: 'enableReviews', type: 'checkbox', defaultValue: false },
                { name: 'enableWishlist', type: 'checkbox', defaultValue: false },
                { name: 'enableStockNotifications', type: 'checkbox', defaultValue: false },
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

        // ─── TAB 3: E-MAIL & NOTIFICATIES ────
        ...featureTab('shop', {
          label: 'E-mail & Notificaties',
          description: 'Instellingen voor transactionele e-mails en notificaties',
          fields: [
            {
              name: 'emailNotifications',
              type: 'group',
              label: 'E-mail Notificaties',
              fields: [
                {
                  name: 'enableInvoiceAttachment',
                  type: 'checkbox',
                  label: 'Factuur PDF meesturen bij orderbevestiging',
                  defaultValue: false,
                  admin: {
                    description: 'De gegenereerde factuur-PDF wordt als bijlage meegestuurd met de orderbevestigings-e-mail',
                  },
                },
                {
                  name: 'enableTrackingLink',
                  type: 'checkbox',
                  label: 'Tracking link in e-mails',
                  defaultValue: false,
                  admin: {
                    description: 'Voeg een "Volg je bestelling" knop toe aan alle transactionele e-mails (linkt naar /track)',
                  },
                },
                {
                  name: 'enablePublicTracking',
                  type: 'checkbox',
                  label: 'Publieke order tracking pagina (/track)',
                  defaultValue: false,
                  admin: {
                    description: 'Activeer de publieke tracking pagina waar klanten zonder account hun bestelling kunnen volgen met ordernummer + e-mail',
                  },
                },
              ],
            },
          ],
        }),

        // ─── TAB 4: ABANDONED CART ────
        ...featureTab('shop', {
          label: 'Abandoned Cart',
          description: 'Instellingen voor verlaten winkelwagen detectie en herinnerings-e-mails',
          fields: [
            {
              name: 'abandonedCart',
              type: 'group',
              label: 'Abandoned Cart Detectie',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Abandoned cart detectie activeren',
                  defaultValue: false,
                  admin: {
                    description: 'Detecteert inactieve winkelwagens en triggert automatische herinneringsmails via het automation systeem (Listmonk)',
                  },
                },
                {
                  name: 'timeoutHours',
                  type: 'number',
                  label: 'Timeout (uren)',
                  defaultValue: 24,
                  min: 1,
                  max: 168,
                  admin: {
                    description: 'Na hoeveel uur inactiviteit wordt een winkelwagen als "verlaten" gemarkeerd (1-168 uur)',
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
              ],
            },
          ],
        }),

        // ─── TAB 5: CARRIER INTEGRATIE ────
        ...featureTab('checkout', {
          label: 'Carrier Integratie',
          description: 'Koppel met Sendcloud of MyParcel voor automatische tracking updates',
          fields: [
            {
              name: 'carrierIntegration',
              type: 'group',
              label: 'Carrier API Koppeling',
              fields: [
                {
                  name: 'provider',
                  type: 'select',
                  label: 'Carrier Provider',
                  defaultValue: 'none',
                  options: [
                    { label: 'Geen (handmatig)', value: 'none' },
                    { label: 'Sendcloud', value: 'sendcloud' },
                    { label: 'MyParcel', value: 'myparcel' },
                  ],
                  admin: {
                    description: 'Selecteer je verzendsoftware voor automatische T&T updates',
                  },
                },
                {
                  name: 'apiKey',
                  type: 'text',
                  label: 'API Key',
                  admin: {
                    description: 'API key van je carrier provider',
                    condition: (_, siblingData) => siblingData?.provider && siblingData.provider !== 'none',
                  },
                },
                {
                  name: 'apiSecret',
                  type: 'text',
                  label: 'API Secret',
                  admin: {
                    description: 'API secret van je carrier provider',
                    condition: (_, siblingData) => siblingData?.provider && siblingData.provider !== 'none',
                  },
                },
                {
                  name: 'webhookSecret',
                  type: 'text',
                  label: 'Webhook Secret',
                  admin: {
                    description: 'Secret voor webhook signature verificatie. Stel de webhook URL in op: {jouw-domein}/api/webhooks/carrier',
                    condition: (_, siblingData) => siblingData?.provider && siblingData.provider !== 'none',
                  },
                },
                {
                  name: 'webhookUrl',
                  type: 'text',
                  label: 'Webhook URL (kopieer naar carrier)',
                  admin: {
                    readOnly: true,
                    description: 'Kopieer deze URL naar de webhook-instellingen van je carrier provider',
                    condition: (_, siblingData) => siblingData?.provider && siblingData.provider !== 'none',
                  },
                  hooks: {
                    beforeChange: [
                      ({ siblingData }) => {
                        const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SITE_URL || ''
                        return `${siteUrl}/api/webhooks/carrier`
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }),

        // ─── TAB 6: VERZENDMETHODEN ────
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

        // ─── TAB 7: BETAALOPTIES ────
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
