// Load .env file explicitly — needed when PM2 starts the process without Next.js
// loading env files (e.g. when --update-env doesn't source the .env file).
// dotenv is a no-op if the vars are already set (system env takes precedence).
import 'dotenv/config'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'

import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  HeadingFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// ─── Branch Imports (Vertical Slice Architecture) ────────────────────────────
//
// Collections are now organized by industry/feature domain:
// - ecommerce: Shop, Orders, Loyalty, Subscriptions, etc.
// - content: Blog, FAQs, Testimonials, etc.
// - marketplace: Vendors, Workshops, etc.
// - shared: Media, Pages, Users, etc.
// - platform: Multi-tenant management (Clients, Deployments, etc.)
//

// Ecommerce Branch — organized by subdomain
// Orders & Fulfillment
import { Orders } from '@/branches/ecommerce/shared/collections/orders/Orders'
import { OrderLists } from '@/branches/ecommerce/b2b/collections/orders/OrderLists'
import Quotes from '@/branches/ecommerce/b2b/collections/orders/Quotes'
import { Invoices } from '@/branches/ecommerce/shared/collections/orders/Invoices'
import { Returns } from '@/branches/ecommerce/shared/collections/orders/Returns'
import { RecurringOrders } from '@/branches/ecommerce/b2b/collections/orders/RecurringOrders'
// Products & Catalog
import { Products } from '@/branches/ecommerce/shared/collections/products'
import { ProductCategories } from '@/branches/ecommerce/shared/collections/catalog/ProductCategories'
import { Brands } from '@/branches/ecommerce/shared/collections/catalog/Brands'
import { Branches } from '@/branches/ecommerce/shared/collections/catalog/Branches'
import { RecentlyViewed } from '@/branches/ecommerce/shared/collections/catalog/RecentlyViewed'
import { Magazines } from '@/branches/ecommerce/shared/collections/catalog/Magazines'
// Customers
import { CustomerGroups } from '@/branches/ecommerce/shared/collections/customers/CustomerGroups'
// Checkout & Payment
import { PaymentMethods } from '@/branches/ecommerce/shared/collections/checkout/PaymentMethods'
// Shipping & Stock
import { StockReservations } from '@/branches/ecommerce/shared/collections/shipping/StockReservations'
// Subscriptions
import { SubscriptionPlans } from '@/branches/ecommerce/shared/collections/subscriptions/SubscriptionPlans'
import { SubscriptionPages } from '@/branches/ecommerce/shared/collections/subscriptions/SubscriptionPages'
import { UserSubscriptions } from '@/branches/ecommerce/shared/collections/subscriptions/UserSubscriptions'
// B2B (CompanyInvites & ApprovalRequests — CompanyAccounts merged into Users)
import { CompanyInvites } from '@/branches/ecommerce/b2b/collections/company/CompanyInvites'
import { ApprovalRequests } from '@/branches/ecommerce/b2b/collections/approvals/ApprovalRequests'
// Platform Monitoring
import { UptimeIncidents } from '@/features/platform/monitoring/collections/UptimeIncidents'
// Licenses
import { Licenses } from '@/branches/ecommerce/b2b/collections/licenses/Licenses'
import { LicenseActivations } from '@/branches/ecommerce/b2b/collections/licenses/LicenseActivations'
// Loyalty
import { LoyaltyPoints } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyPoints'
import { LoyaltyRedemptions } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyRedemptions'
import { LoyaltyRewards } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyRewards'
import { LoyaltyTiers } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyTiers'
import { LoyaltyTransactions } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyTransactions'
// Marketing & A/B Testing
import { ABTests } from '@/branches/ecommerce/shared/collections/marketing/ABTests'
import { ABTestResults } from '@/branches/ecommerce/shared/collections/marketing/ABTestResults'
import { DiscountCodes } from '@/branches/ecommerce/shared/collections/marketing/DiscountCodes'
import { Promotions } from '@/branches/ecommerce/shared/collections/marketing/Promotions'
import { EditionNotifications } from '@/branches/ecommerce/shared/collections/marketing/EditionNotifications'
import { GiftVouchers } from '@/branches/ecommerce/b2c/collections/marketing/GiftVouchers'
// Cart & Addresses
import { Carts } from '@/branches/ecommerce/shared/collections/checkout/Carts'
import { Addresses } from '@/branches/ecommerce/shared/collections/customers/Addresses'

// Content Branch (1 collection — premium content)
import { BlogPosts } from '@/branches/publishing/collections/BlogPosts'

// Shared Collections (blog, marketing)
import { BlogCategories } from '@/branches/shared/collections/BlogCategories'
import { Cases } from '@/branches/shared/collections/Cases'
import { FAQs } from '@/branches/shared/collections/FAQs'
import { Testimonials } from '@/branches/shared/collections/Testimonials'

// Marketplace Branch (3 collections)
import { Vendors } from '@/branches/marketplace/collections/Vendors'
import { VendorReviews } from '@/branches/marketplace/collections/VendorReviews'
import { Workshops } from '@/branches/marketplace/collections/Workshops'

// Shared Branch (6 collections + 2 subdirectories)
import { CookieConsents } from '@/branches/shared/collections/CookieConsents'
import { Media } from '@/branches/shared/collections/Media'
import { Notifications } from '@/branches/shared/collections/Notifications'
import { Partners } from '@/branches/shared/collections/Partners'
import { ServicesCollection } from '@/branches/shared/collections/ServicesCollection'
import { Themes } from '@/branches/shared/collections/Themes'
// Note: FormSubmissions is provided by formBuilderPlugin, no need to import manually

// Shared - Subdirectories (still in old location temporarily)
import { Pages } from '@/branches/shared/collections/Pages'
import { Users } from '@/branches/shared/collections/Users'

// Platform Feature (Multi-Tenant - 3 collections)
import { Clients } from '@/features/platform/collections/Clients'
import { ClientRequests } from '@/features/platform/collections/ClientRequests'
import { Deployments } from '@/features/platform/collections/Deployments'

// Construction Branch (4 collections - Sprint 2)
import { ConstructionServices } from '@/branches/construction/collections/ConstructionServices'
import { ConstructionProjects } from '@/branches/construction/collections/ConstructionProjects'
import { ConstructionReviews } from '@/branches/construction/collections/ConstructionReviews'
import { QuoteRequests } from '@/branches/construction/collections/QuoteRequests'

// Hospitality Branch (3 collections - Sprint 4)
import { Treatments } from '@/branches/hospitality/collections/Treatments'
import { Practitioners } from '@/branches/hospitality/collections/Practitioners'
import { Appointments } from '@/branches/hospitality/collections/Appointments'

// Beauty Branch (3 collections - Sprint 5)
import { BeautyServices } from '@/branches/beauty/collections/BeautyServices'
import { Stylists } from '@/branches/beauty/collections/Stylists'
import { BeautyBookings } from '@/branches/beauty/collections/BeautyBookings'

// Horeca Branch (3 collections - Sprint 6)
import { MenuItems } from '@/branches/horeca/collections/MenuItems'
import { Reservations } from '@/branches/horeca/collections/Reservations'
import { Events } from '@/branches/horeca/collections/Events'

// Email Marketing Feature (8 collections - Feature flagged)
import { emailMarketingFeatures } from '@/lib/tenant/features'
import {
  EmailSubscribers,
  EmailLists,
  EmailTemplates,
  EmailCampaigns,
  AutomationRules,
  AutomationFlows,
  FlowInstances,
  EmailEvents,
  EmailApiKeys,
} from '@/features/email-marketing/collections'
import { EmailSegments } from '@/features/email-marketing/collections/EmailSegments'

// Globals (Consolidated: 8 → 6 globals!)
import { Footer } from '@/globals/site/footer/Footer'
import { Header } from '@/globals/site/header/Header'
import { MeilisearchSettings } from '@/features/search/globals/MeilisearchSettings'
import { ChatbotSettings } from '@/features/ai/globals/ChatbotSettings'
import { Settings } from '@/globals/site/Settings'
import { EcommerceSettings } from '@/branches/ecommerce/shared/collections/ecommerce-settings'
import { Theme } from '@/globals/design/Theme'

// Plugins
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ─── Collection Filtering (per-client CMS customization) ──────────────────────
//
// DISABLED_COLLECTIONS bevat een komma-gescheiden lijst van collection slugs
// die uitgeschakeld zijn voor deze specifieke klant-CMS instantie.
//
// De platform-instantie zelf heeft DISABLED_COLLECTIONS leeg → alle collections actief.
// Klant-instanties op Ploi krijgen deze env var automatisch gezet via CMSConfigService.
//
// Slugs moeten exact overeenkomen met ALL_COLLECTION_SLUGS in CMSConfigService.ts.
const _disabledCollectionsEnv = process.env.DISABLED_COLLECTIONS || ''
const _disabledSet = new Set(
  _disabledCollectionsEnv.split(',').map((s) => s.trim()).filter(Boolean),
)
const _isPlatform = _disabledSet.size === 0

// Helper: geef de collection terug als hij NIET uitgeschakeld is
const _col = <T extends { slug: string }>(collection: T): T | null =>
  _disabledSet.has(collection.slug) ? null : collection

// ─── Database Configuration ───────────────────────────
// Automatically switch between SQLite (dev) and PostgreSQL (prod)
const databaseURL = process.env.DATABASE_URL || 'file:./payload.db'
const isPostgreSQL = databaseURL.startsWith('postgres://') || databaseURL.startsWith('postgresql://')

const databaseAdapter = isPostgreSQL
  ? postgresAdapter({
      pool: {
        connectionString: databaseURL,
      },
    })
  : sqliteAdapter({
      client: {
        url: databaseURL,
      },
    })

export default buildConfig({
  // ─── Admin Panel ──────────────────────────
  admin: {
    components: {
      beforeLogin: ['@/branches/shared/components/admin/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/branches/shared/components/admin/BeforeDashboard#BeforeDashboard'],
      beforeNavLinks: [
        '@/features/platform/components/ClientSwitcher#ClientSwitcher',
        '@/branches/shared/components/admin/HideCollections#HideCollections',
      ],
      afterNavLinks: [
        '@/features/analytics/components/admin/AnalyticsNavLinks#AnalyticsNavLinks',
      ],
      graphics: {
        Logo: '@/branches/shared/components/admin/AdminLogo#AdminLogo',
        Icon: '@/branches/shared/components/admin/AdminLogo#AdminLogo',
      },
      views: {
        analytics: {
          Component: '@/features/analytics/components/admin/AnalyticsView#AnalyticsView',
          path: '/analytics',
          meta: {
            title: 'Analytics',
            description: 'Omzet, bestellingen, conversie en klantanalyse',
          },
        },
        insights: {
          Component: '@/features/analytics/components/admin/InsightsView#InsightsView',
          path: '/insights',
          meta: {
            title: 'Klantinzichten',
            description: 'RFM-analyse, segmentatie, CLV en churn-predictie',
          },
        },
      },
    },
    user: Users.slug,
    meta: {
      titleSuffix: '— Contyzr CMS',
    },
    // Custom CSS - Contyzr Brand Styling (DISABLED - uncomment to re-enable)
    // css: path.resolve(dirname, 'globals/design/styles/admin.scss'),
  },

  // ─── Editor ───────────────────────────────
  editor: lexicalEditor({
    features: () => {
      return [
        // Basis formatting
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),

        // Headings (H2-H4, geen H1)
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),

        // Lijsten
        OrderedListFeature(),
        UnorderedListFeature(),

        // Links
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),

        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),

  // ─── Database ─────────────────────────────
  db: databaseAdapter,

  // ─── Collections (Organized by Branch) ───────────────────────────────────────
  //
  // Collections zijn georganiseerd per vertical slice (branch):
  // 1. SHARED - Altijd actief (Users, Pages, Media)
  // 2. ECOMMERCE - Shop, Orders, Loyalty, Subscriptions, etc.
  // 3. CONTENT - Blog, FAQs, Testimonials, Cases
  // 4. MARKETPLACE - Vendors, Workshops
  // 5. CONSTRUCTION - Bouwbedrijf (Services, Projects, Reviews, Quotes)
  // 6. PLATFORM - Multi-tenant management (alleen op platform-instantie)
  //
  // Filtering via DISABLED_COLLECTIONS env var (per-client customization)
  //
  collections: [
    // ═══════════════════════════════════════════════════════════════════════════
    // SHARED BRANCH - Core collections (altijd actief)
    // ═══════════════════════════════════════════════════════════════════════════
    Users,
    Pages,
    Media,
    CookieConsents, // GDPR cookie consent tracking (always enabled)
    _col(Partners),
    _col(ServicesCollection),
    _col(Notifications),
    _col(Themes),
    // FormSubmissions is provided by formBuilderPlugin

    // ═══════════════════════════════════════════════════════════════════════════
    // ECOMMERCE BRANCH - Shop, Orders, Loyalty, Subscriptions
    // ═══════════════════════════════════════════════════════════════════════════

    // Product Management
    _col(Products),
    _col(ProductCategories),
    _col(Brands),
    _col(Branches),
    _col(RecentlyViewed),
    _col(EditionNotifications),

    // Publishing
    _col(Magazines),

    // Customer Management (Customers merged into Users)
    _col(CustomerGroups),
    _col(Addresses),

    // Cart & Checkout
    _col(Carts),
    _col(DiscountCodes),
    _col(Promotions),

    // Order Management
    _col(Orders),
    _col(OrderLists),
    _col(RecurringOrders),
    _col(Invoices),
    _col(Returns),
    _col(StockReservations),

    // Subscriptions (Sprint 6)
    _col(SubscriptionPlans),
    _col(SubscriptionPages),
    _col(UserSubscriptions),
    _col(PaymentMethods),

    // Gift Vouchers (Sprint 6)
    _col(GiftVouchers),

    // Licenses (Sprint 6)
    _col(Licenses),
    _col(LicenseActivations),

    // Loyalty Program (Sprint 6)
    _col(LoyaltyTiers),
    _col(LoyaltyRewards),
    _col(LoyaltyPoints),
    _col(LoyaltyTransactions),
    _col(LoyaltyRedemptions),

    // B2B Invites & Approvals (CompanyAccounts merged into Users)
    _col(CompanyInvites),
    _col(ApprovalRequests),

    // Quotes (Sprint 10)
    _col(Quotes),

    // A/B Testing (Sprint 9)
    _col(ABTests),
    _col(ABTestResults),

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTENT BRANCH - Blog, FAQs, Testimonials, Cases
    // ═══════════════════════════════════════════════════════════════════════════
    _col(BlogPosts),
    _col(BlogCategories),
    _col(FAQs),
    _col(Cases),
    _col(Testimonials),

    // ═══════════════════════════════════════════════════════════════════════════
    // MARKETPLACE BRANCH - Vendors, Workshops, Reviews
    // ═══════════════════════════════════════════════════════════════════════════
    _col(Vendors),
    _col(VendorReviews),
    _col(Workshops),

    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTRUCTION BRANCH - Bouwbedrijf Template (Sprint 2)
    // ═══════════════════════════════════════════════════════════════════════════
    _col(ConstructionServices),
    _col(ConstructionProjects),
    _col(ConstructionReviews),
    _col(QuoteRequests),

    // ═══════════════════════════════════════════════════════════════════════════
    // HOSPITALITY BRANCH - Fysiotherapie/Zorg Template (Sprint 4)
    // ═══════════════════════════════════════════════════════════════════════════
    _col(Treatments),
    _col(Practitioners),
    _col(Appointments),

    // ═══════════════════════════════════════════════════════════════════════════
    // BEAUTY BRANCH - Hair & Beauty Salon Template (Sprint 5)
    // ═══════════════════════════════════════════════════════════════════════════
    _col(BeautyServices),
    _col(Stylists),
    _col(BeautyBookings),

    // ═══════════════════════════════════════════════════════════════════════════
    // HORECA BRANCH - Restaurant & Hospitality Template (Sprint 6)
    // ═══════════════════════════════════════════════════════════════════════════
    _col(MenuItems),
    _col(Reservations),
    _col(Events),

    // ═══════════════════════════════════════════════════════════════════════════
    // EMAIL MARKETING BRANCH - Email campaigns, lists, subscribers (Feature flagged)
    // ═══════════════════════════════════════════════════════════════════════════
    // Email marketing collections zijn ALTIJD geregistreerd zodat de importMap
    // alle custom components bevat (o.a. GrapesJSField). Visibility en access
    // worden geregeld via admin.hidden + access functies op de collections zelf.
    _col(EmailSubscribers),
    _col(EmailLists),
    _col(EmailTemplates),
    _col(EmailApiKeys),
    _col(EmailCampaigns),
    _col(AutomationRules),
    _col(AutomationFlows),
    _col(FlowInstances),
    _col(EmailEvents),
    _col(EmailSegments),

    // ═══════════════════════════════════════════════════════════════════════════
    // PLATFORM BRANCH - Multi-tenant Management (alleen op platform-instantie)
    // ═══════════════════════════════════════════════════════════════════════════
    ...(_isPlatform ? [ClientRequests, Clients, Deployments, UptimeIncidents] : []),
  ].filter(Boolean) as any[],

  // ─── Globals ──────────────────────────────
  globals: [
    Settings,
    EcommerceSettings, // E-commerce: shipping, payment, B2B, features
    Theme, // Design System (colors, typography, spacing)
    Header,
    Footer,
    MeilisearchSettings, // Search engine configuration
    ChatbotSettings, // AI Chatbot configuration
  ],

  // ─── Plugins ──────────────────────────────
  plugins,

  // ─── Image Processing ─────────────────────
  sharp,

  // ─── Upload Configuratie ──────────────────
  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max per klant
    },
  },

  // ─── Environment ──────────────────────────
  secret: process.env.PAYLOAD_SECRET || '',

  // ─── TypeScript ───────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  endpoints: [],
})
