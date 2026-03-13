import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/tenant/isClientDeployment'
import { featureField, featureFields } from '@/lib/tenant/featureFields'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Both admin and editor roles can access the Payload admin panel
    admin: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Open registration for customers + admin creation
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    group: 'Systeem',
    defaultColumns: ['name', 'email', 'roles', 'accountType', 'customerStatus'],
    useAsTitle: 'name',
    hidden: false,
  },
  auth: {
    tokenExpiration: 1209600, // 14 dagen
  },
  fields: [
    // ══════════════════════════════════════════════════════════════════════
    // TAB: Algemeen
    // ══════════════════════════════════════════════════════════════════════
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Algemeen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  label: 'Voornaam',
                  admin: { width: '50%' },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  label: 'Achternaam',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'name',
              type: 'text',
              label: 'Volledige Naam',
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    if (siblingData?.firstName && siblingData?.lastName) {
                      return `${siblingData.firstName} ${siblingData.lastName}`
                    }
                    return siblingData?.name
                  },
                ],
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Telefoon',
              admin: {
                placeholder: '+31 6 1234 5678',
              },
            },
            {
              name: 'dateOfBirth',
              type: 'date',
              label: 'Geboortedatum',
              admin: {
                date: {
                  displayFormat: 'dd-MM-yyyy',
                },
              },
            },
            {
              name: 'roles',
              type: 'select',
              access: {
                create: adminOnlyFieldAccess,
                read: adminOnlyFieldAccess,
                update: adminOnlyFieldAccess,
              },
              defaultValue: ['editor'],
              hasMany: true,
              hooks: {
                beforeChange: [ensureFirstUserIsAdmin],
              },
              options: [
                {
                  label: 'Super Admin (Platform)',
                  value: 'super-admin',
                },
                {
                  label: 'Admin (CompassDigital)',
                  value: 'admin',
                },
                {
                  label: 'Editor (Klant)',
                  value: 'editor',
                },
              ],
            },
            {
              name: 'clientType',
              type: 'select',
              label: 'Type website',
              access: {
                create: adminOnlyFieldAccess,
                read: adminOnlyFieldAccess,
                update: adminOnlyFieldAccess,
              },
              options: [
                { label: 'Website (informatief)', value: 'website' },
                { label: 'Webshop (e-commerce)', value: 'webshop' },
              ],
              admin: {
                description: 'Bepaalt welke functies en collecties zichtbaar zijn voor deze klant',
                condition: (data) => Array.isArray(data.roles) && data.roles.includes('editor'),
              },
            },
            // Only include client relationship field in platform deployments
            ...(!isClientDeployment()
              ? [
                  {
                    name: 'client',
                    type: 'relationship' as const,
                    relationTo: 'clients' as const,
                    label: 'Gekoppelde klant',
                    access: {
                      create: adminOnlyFieldAccess,
                      read: adminOnlyFieldAccess,
                      update: adminOnlyFieldAccess,
                    },
                    admin: {
                      description: 'De client-omgeving die bij deze gebruiker hoort',
                      condition: (data: any) =>
                        Array.isArray(data.roles) && data.roles.includes('editor'),
                    },
                  },
                ]
              : []),
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Klantgegevens (merged from Customers collection)
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Klantgegevens',
          fields: [
            ...featureFields('b2b', [
              {
                name: 'accountType',
                type: 'select',
                label: 'Account Type',
                defaultValue: 'individual',
                options: [
                  { label: 'Particulier', value: 'individual' },
                  { label: 'B2C (Consument)', value: 'b2c' },
                  { label: 'B2B Zakelijk', value: 'b2b' },
                ],
                admin: {
                  description: 'B2B accounts hebben toegang tot zakelijke functionaliteiten',
                },
              },
            ]),
            {
              name: 'customerGroup',
              type: 'relationship',
              relationTo: 'customer-groups',
              label: 'Klantengroep',
              admin: {
                description: 'Bepaalt pricing en permissions',
              },
            },
            {
              name: 'customerStatus',
              type: 'select',
              label: 'Klantstatus',
              defaultValue: 'active',
              options: [
                { label: 'In afwachting', value: 'pending' },
                { label: 'Actief', value: 'active' },
                { label: 'Inactief', value: 'inactive' },
                { label: 'Geblokkeerd', value: 'blocked' },
              ],
              admin: {
                description: 'B2B accounts kunnen goedkeuring vereisen',
              },
            },
            {
              name: 'customPricingRole',
              type: 'text',
              label: 'Custom Pricing Role',
              admin: {
                description: 'Role ID voor custom pricing (bijv. "hospital", "clinic")',
              },
            },
            {
              name: 'discount',
              type: 'number',
              label: 'Persoonlijke Korting (%)',
              min: 0,
              max: 100,
              admin: {
                description: 'Extra korting bovenop groepskorting',
              },
            },
            {
              name: 'creditLimit',
              type: 'number',
              label: 'Kredietlimiet',
              admin: {
                description: 'Maximale openstaande facturen (B2B)',
                condition: (data) => data?.accountType === 'b2b',
              },
            },
            {
              name: 'paymentTerms',
              type: 'select',
              label: 'Betalingstermijn',
              defaultValue: 'immediate',
              options: [
                { label: 'Direct', value: 'immediate' },
                { label: '14 dagen', value: '14' },
                { label: '30 dagen', value: '30' },
                { label: '60 dagen', value: '60' },
                { label: '90 dagen', value: '90' },
              ],
              admin: {
                condition: (data) => data?.accountType === 'b2b',
              },
            },
            {
              name: 'verified',
              type: 'checkbox',
              defaultValue: false,
              label: 'E-mail Geverifieerd',
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Interne Notities',
              admin: {
                description: 'Alleen zichtbaar voor admins',
              },
            },
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Bedrijf (merged from CompanyAccounts collection)
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Bedrijf',
          fields: [
            ...featureFields('b2b', [
              {
                name: 'company',
                type: 'group',
                label: 'Bedrijfsgegevens',
                admin: {
                  condition: (data) => data.accountType === 'b2b',
                  description: 'Bedrijfsinformatie voor B2B klanten',
                },
                fields: [
                  {
                    name: 'name',
                    type: 'text',
                    label: 'Bedrijfsnaam',
                  },
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'kvkNumber',
                        type: 'text',
                        label: 'KVK Nummer',
                        admin: {
                          placeholder: '12345678',
                          width: '50%',
                        },
                      },
                      {
                        name: 'vatNumber',
                        type: 'text',
                        label: 'BTW Nummer',
                        admin: {
                          placeholder: 'NL123456789B01',
                          width: '50%',
                        },
                      },
                    ],
                  },
                  {
                    name: 'invoiceEmail',
                    type: 'email',
                    label: 'Factuur Email',
                    admin: {
                      description: 'Email voor facturen (indien anders dan hoofdemail)',
                    },
                  },
                  {
                    name: 'branch',
                    type: 'select',
                    label: 'Branche',
                    options: [
                      { label: 'Zorg & Welzijn', value: 'healthcare' },
                      { label: 'Horeca & Catering', value: 'hospitality' },
                      { label: 'Bouw & Techniek', value: 'construction' },
                      { label: 'Industrie & Productie', value: 'industry' },
                      { label: 'Onderwijs', value: 'education' },
                      { label: 'Zakelijke Diensten', value: 'business_services' },
                      { label: 'Retail & Groothandel', value: 'retail' },
                      { label: 'Transport & Logistiek', value: 'logistics' },
                      { label: 'Overig', value: 'other' },
                    ],
                  },
                  {
                    name: 'website',
                    type: 'text',
                    label: 'Website',
                    admin: {
                      placeholder: 'https://www.bedrijf.nl',
                    },
                  },
                  // ── Company-level budget & credit (was CompanyAccounts) ──
                  {
                    name: 'status',
                    type: 'select',
                    label: 'Bedrijfsstatus',
                    defaultValue: 'active',
                    options: [
                      { label: 'Actief', value: 'active' },
                      { label: 'Inactief', value: 'inactive' },
                      { label: 'Opgeschort', value: 'suspended' },
                    ],
                  },
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'monthlyBudget',
                        type: 'number',
                        label: 'Maandbudget (€)',
                        admin: { description: 'Laat leeg voor onbeperkt', width: '50%' },
                      },
                      {
                        name: 'quarterlyBudget',
                        type: 'number',
                        label: 'Kwartaalbudget (€)',
                        admin: { description: 'Laat leeg voor onbeperkt', width: '50%' },
                      },
                    ],
                  },
                  {
                    name: 'approvalThreshold',
                    type: 'number',
                    label: 'Goedkeuringsdrempel (€)',
                    admin: {
                      description:
                        'Bestellingen boven dit bedrag vereisen goedkeuring. Laat leeg om uit te schakelen.',
                    },
                  },
                  {
                    name: 'approvalRoles',
                    type: 'select',
                    hasMany: true,
                    label: 'Rollen die goedkeuring vereisen',
                    options: [
                      { label: 'Inkoper', value: 'buyer' },
                      { label: 'Alleen-lezen', value: 'viewer' },
                    ],
                    admin: {
                      description: 'Bestellingen van gebruikers met deze rollen vereisen goedkeuring',
                    },
                  },
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'creditLimit',
                        type: 'number',
                        label: 'Kredietlimiet (€)',
                        admin: { description: 'Maximaal openstaand bedrag op rekening', width: '50%' },
                      },
                      {
                        name: 'creditUsed',
                        type: 'number',
                        label: 'Krediet gebruikt (€)',
                        defaultValue: 0,
                        admin: { readOnly: true, width: '50%' },
                      },
                    ],
                  },
                  {
                    name: 'paymentTerms',
                    type: 'select',
                    label: 'Betaaltermijn (bedrijf)',
                    defaultValue: '30',
                    options: [
                      { label: '14 dagen', value: '14' },
                      { label: '30 dagen', value: '30' },
                      { label: '60 dagen', value: '60' },
                    ],
                  },
                ],
              },
              // ── B2B Company Role (for team members within same company) ──
              {
                name: 'companyRole',
                type: 'select',
                label: 'Bedrijfsrol',
                defaultValue: 'viewer',
                options: [
                  { label: 'Eigenaar', value: 'owner' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Manager', value: 'manager' },
                  { label: 'Inkoper', value: 'buyer' },
                  { label: 'Financieel', value: 'finance' },
                  { label: 'Alleen-lezen', value: 'viewer' },
                ],
                admin: {
                  condition: (data) => data.accountType === 'b2b',
                  description: 'Rol binnen het bedrijfsaccount',
                },
              },
              {
                name: 'companyOwner',
                type: 'relationship',
                relationTo: 'users',
                label: 'Bedrijfseigenaar',
                admin: {
                  condition: (data) =>
                    data.accountType === 'b2b' && data.companyRole !== 'owner',
                  description: 'De eigenaar van het bedrijfsaccount (voor teamleden)',
                },
              },
              {
                name: 'monthlyBudgetLimit',
                type: 'number',
                label: 'Persoonlijk maandbudget (€)',
                admin: {
                  condition: (data) => data.accountType === 'b2b',
                  description: 'Persoonlijke bestedingslimiet per maand',
                },
              },
            ]),
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Adressen
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Adressen',
          fields: [
            {
              name: 'addresses',
              type: 'array',
              label: 'Adressen',
              admin: {
                description: 'Verzend- en facturadressen',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  admin: {
                    description: 'Bijv. "Thuis", "Werk", "Magazijn"',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  label: 'Type',
                  options: [
                    { label: 'Verzendadres', value: 'shipping' },
                    { label: 'Factuuradres', value: 'billing' },
                    { label: 'Beide', value: 'both' },
                  ],
                  defaultValue: 'both',
                },
                {
                  name: 'companyName',
                  type: 'text',
                  label: 'Bedrijfsnaam',
                },
                {
                  name: 'street',
                  type: 'text',
                  required: true,
                  label: 'Straat',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'houseNumber',
                      type: 'text',
                      required: true,
                      label: 'Huisnummer',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'houseNumberAddition',
                      type: 'text',
                      label: 'Toevoeging',
                      admin: { width: '25%', placeholder: 'A, B, etc.' },
                    },
                    {
                      name: 'postalCode',
                      type: 'text',
                      required: true,
                      label: 'Postcode',
                      admin: { width: '25%', placeholder: '1234 AB' },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      required: true,
                      label: 'Plaats',
                      admin: { width: '25%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'state',
                      type: 'text',
                      label: 'Provincie/Staat',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'country',
                      type: 'select',
                      defaultValue: 'NL',
                      label: 'Land',
                      options: [
                        { label: 'Nederland', value: 'NL' },
                        { label: 'België', value: 'BE' },
                        { label: 'Duitsland', value: 'DE' },
                        { label: 'Frankrijk', value: 'FR' },
                        { label: 'Verenigd Koninkrijk', value: 'GB' },
                        { label: 'Overig', value: 'OTHER' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Telefoonnummer',
                },
                {
                  name: 'deliveryInstructions',
                  type: 'textarea',
                  label: 'Bezorgnotities',
                },
                {
                  name: 'isDefault',
                  type: 'checkbox',
                  label: 'Standaard adres',
                  defaultValue: false,
                },
              ],
            },
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Voorkeuren
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Voorkeuren',
          fields: [
            {
              name: 'language',
              type: 'select',
              defaultValue: 'nl',
              label: 'Taal',
              options: [
                { label: 'Nederlands', value: 'nl' },
                { label: 'English', value: 'en' },
                { label: 'Deutsch', value: 'de' },
              ],
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'EUR',
              label: 'Valuta',
              options: [
                { label: 'Euro (EUR)', value: 'EUR' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'British Pound (GBP)', value: 'GBP' },
              ],
            },
            {
              name: 'newsletter',
              type: 'checkbox',
              defaultValue: false,
              label: 'Nieuwsbrief',
            },
            {
              name: 'marketingEmails',
              type: 'checkbox',
              defaultValue: false,
              label: 'Marketing E-mails',
            },
            {
              name: 'orderNotifications',
              type: 'checkbox',
              defaultValue: true,
              label: 'Order Notificaties',
            },
            ...featureFields('shop', [
              {
                name: 'favorites',
                type: 'array',
                label: 'Favorieten',
                admin: {
                  description: 'Favoriete producten van deze gebruiker',
                },
                fields: [
                  {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                    required: true,
                    label: 'Product',
                  },
                  {
                    name: 'addedAt',
                    type: 'date',
                    label: 'Toegevoegd op',
                    defaultValue: () => new Date().toISOString(),
                    admin: {
                      readOnly: true,
                      date: {
                        pickerAppearance: 'dayAndTime',
                      },
                    },
                  },
                ],
              },
            ]),
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Statistieken (merged from Customers.statistics)
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Statistieken',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'totalOrders',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Totaal Bestellingen',
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'totalSpent',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Totaal Besteed (€)',
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'averageOrderValue',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Gem. Bestelwaarde (€)',
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'lastOrderDate',
                  type: 'date',
                  label: 'Laatste Bestelling',
                  admin: {
                    readOnly: true,
                    width: '25%',
                    date: { displayFormat: 'dd-MM-yyyy' },
                  },
                },
              ],
            },
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Loyaliteit (merged from LoyaltyPoints collection)
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Loyaliteit',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'loyaltyAvailablePoints',
                  type: 'number',
                  label: 'Beschikbare Punten',
                  defaultValue: 0,
                  admin: {
                    width: '33%',
                    description: 'Huidig besteedbaar saldo',
                  },
                },
                {
                  name: 'loyaltyTotalEarned',
                  type: 'number',
                  label: 'Totaal Verdiend',
                  defaultValue: 0,
                  admin: {
                    width: '33%',
                    description: 'Lifetime verdiende punten (voor tier berekening)',
                  },
                },
                {
                  name: 'loyaltyTotalSpent',
                  type: 'number',
                  label: 'Totaal Besteed',
                  defaultValue: 0,
                  admin: {
                    width: '33%',
                    description: 'Lifetime ingewisselde punten',
                  },
                },
              ],
            },
            {
              name: 'loyaltyTier',
              type: 'relationship',
              relationTo: 'loyalty-tiers',
              label: 'Huidige Tier',
              hasMany: false,
              admin: {
                description: 'Berekend op basis van totaal verdiende punten',
              },
            },
            {
              name: 'referralCode',
              type: 'text',
              label: 'Referral Code',
              unique: true,
              admin: {
                description: 'Unieke code om vrienden uit te nodigen',
              },
            },
            {
              name: 'loyaltyMemberSince',
              type: 'date',
              label: 'Lid Sinds',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
            },
            {
              name: 'loyaltyStats',
              type: 'group',
              label: 'Loyalty Statistieken',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rewardsRedeemed',
                      type: 'number',
                      label: 'Beloningen Ingewisseld',
                      defaultValue: 0,
                      admin: { readOnly: true, width: '50%' },
                    },
                    {
                      name: 'referrals',
                      type: 'number',
                      label: 'Succesvolle Referrals',
                      defaultValue: 0,
                      admin: { readOnly: true, width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ══════════════════════════════════════════════════════════════════════
        // TAB: Beveiliging (2FA)
        // ══════════════════════════════════════════════════════════════════════
        {
          label: 'Beveiliging',
          fields: [
            {
              name: 'twoFactorEnabled',
              type: 'checkbox',
              label: 'Tweefactorauthenticatie (2FA)',
              defaultValue: false,
              admin: {
                readOnly: true,
                description: '2FA kan worden in-/uitgeschakeld via het account instellingen menu',
              },
            },
            {
              name: 'twoFactorSecret',
              type: 'text',
              label: '2FA Secret',
              admin: { hidden: true },
              access: {
                read: () => false,
                update: () => false,
              },
            },
            {
              name: 'twoFactorBackupCodes',
              type: 'json',
              label: '2FA Backup Codes',
              admin: { hidden: true },
              access: {
                read: () => false,
                update: () => false,
              },
            },
            {
              name: 'twoFactorPendingSecret',
              type: 'text',
              label: '2FA Pending Secret',
              admin: { hidden: true },
              access: {
                read: () => false,
                update: () => false,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Send welcome email on user creation (non-admin users only)
        if (operation !== 'create') return doc
        if (!doc.email) return doc
        // Skip admin/editor users — only welcome customer registrations
        if (doc.roles && (doc.roles.includes('admin') || doc.roles.includes('super-admin'))) return doc

        try {
          const { emailService } = await import('@/features/email-marketing/lib/EmailService')
          if (!emailService.isConfigured()) return doc

          const siteName = process.env.SITE_NAME || 'Webshop'
          const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
          const customerName = doc.name || doc.firstName || doc.email.split('@')[0]

          const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Welkom!</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1e293b; margin: 0 0 16px;">Hoi ${customerName},</h2>
    <p>Welkom bij <strong>${siteName}</strong>! Je account is succesvol aangemaakt.</p>
    <p>Met je account kun je:</p>
    <ul>
      <li>Bestellingen volgen en herhalen</li>
      <li>Favoriete producten bewaren</li>
      <li>Facturen downloaden</li>
      <li>Retouren aanvragen</li>
    </ul>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${baseUrl}/account" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">Naar je account</a>
    </p>
  </div>
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${siteName}</p>
  </div>
</body></html>`

          await emailService.send({
            to: doc.email,
            subject: `Welkom bij ${siteName}, ${customerName}!`,
            html,
          })
          console.log(`[Users] Welcome email sent to ${doc.email}`)
        } catch (error) {
          console.error(`[Users] Failed to send welcome email:`, error)
        }

        return doc
      },
    ],
  },
}

export default Users
