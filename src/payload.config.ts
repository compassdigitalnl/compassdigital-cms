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

// Ecommerce Branch (19 collections)
import { Brands } from '@/branches/ecommerce/collections/Brands'
import { GiftVouchers } from '@/branches/ecommerce/collections/GiftVouchers'
import { Invoices } from '@/branches/ecommerce/collections/Invoices'
import { LicenseActivations } from '@/branches/ecommerce/collections/LicenseActivations'
import { Licenses } from '@/branches/ecommerce/collections/Licenses'
import { LoyaltyPoints } from '@/branches/ecommerce/collections/LoyaltyPoints'
import { LoyaltyRedemptions } from '@/branches/ecommerce/collections/LoyaltyRedemptions'
import { LoyaltyRewards } from '@/branches/ecommerce/collections/LoyaltyRewards'
import { LoyaltyTiers } from '@/branches/ecommerce/collections/LoyaltyTiers'
import { LoyaltyTransactions } from '@/branches/ecommerce/collections/LoyaltyTransactions'
import { OrderLists } from '@/branches/ecommerce/collections/OrderLists'
import { Orders } from '@/branches/ecommerce/collections/Orders'
import { PaymentMethods } from '@/branches/ecommerce/collections/PaymentMethods'
import { Products } from '@/branches/ecommerce/collections/Products'
import { RecentlyViewed } from '@/branches/ecommerce/collections/RecentlyViewed'
import { RecurringOrders } from '@/branches/ecommerce/collections/RecurringOrders'
import { Returns } from '@/branches/ecommerce/collections/Returns'
import { SubscriptionPlans } from '@/branches/ecommerce/collections/SubscriptionPlans'
import { UserSubscriptions } from '@/branches/ecommerce/collections/UserSubscriptions'

// Ecommerce - Shop Subdirectory (still in old location temporarily)
import { ProductCategories } from '@/collections/shop/ProductCategories'
import { CustomerGroups } from '@/collections/shop/CustomerGroups'

// Content Branch (5 collections)
import { BlogPosts } from '@/branches/content/collections/BlogPosts'
import { BlogCategories } from '@/branches/content/collections/BlogCategories'
import { Cases } from '@/branches/content/collections/Cases'
import { FAQs } from '@/branches/content/collections/FAQs'
import { Testimonials } from '@/branches/content/collections/Testimonials'

// Marketplace Branch (3 collections)
import { Vendors } from '@/branches/marketplace/collections/Vendors'
import { VendorReviews } from '@/branches/marketplace/collections/VendorReviews'
import { Workshops } from '@/branches/marketplace/collections/Workshops'

// Shared Branch (5 collections + 2 subdirectories)
import { Media } from '@/branches/shared/collections/Media'
import { Notifications } from '@/branches/shared/collections/Notifications'
import { Partners } from '@/branches/shared/collections/Partners'
import { ServicesCollection } from '@/branches/shared/collections/ServicesCollection'
// Note: FormSubmissions is provided by formBuilderPlugin, no need to import manually

// Shared - Subdirectories (still in old location temporarily)
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'

// Platform Collections (Multi-Tenant - stays in platform/)
import { ClientRequests } from '@/platform/collections/ClientRequests'
import { Clients } from '@/platform/collections/Clients'
import { Deployments } from '@/platform/collections/Deployments'

// Globals (Consolidated: 8 → 4 globals!)
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Settings } from '@/globals/Settings'
import { Theme } from '@/globals/Theme'

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
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
      beforeNavLinks: [
        '@/components/platform/ClientSwitcher#ClientSwitcher',
        '@/components/admin/HideCollections#HideCollections',
      ],
      graphics: {
        Logo: '@/components/AdminLogo#AdminLogo',
        Icon: '@/components/AdminLogo#AdminLogo',
      },
    },
    user: Users.slug,
    meta: {
      titleSuffix: '— Contyzr CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
    // Custom CSS - Contyzr Brand Styling (DISABLED - uncomment to re-enable)
    // css: path.resolve(dirname, 'styles/admin.scss'),
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
  // 5. PLATFORM - Multi-tenant management (alleen op platform-instantie)
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
    _col(Partners),
    _col(ServicesCollection),
    _col(Notifications),
    // FormSubmissions is provided by formBuilderPlugin

    // ═══════════════════════════════════════════════════════════════════════════
    // ECOMMERCE BRANCH - Shop, Orders, Loyalty, Subscriptions
    // ═══════════════════════════════════════════════════════════════════════════

    // Product Management
    _col(Products),
    _col(ProductCategories),
    _col(Brands),
    _col(RecentlyViewed),

    // Customer Management
    _col(CustomerGroups),

    // Order Management
    _col(Orders),
    _col(OrderLists),
    _col(RecurringOrders),
    _col(Invoices),
    _col(Returns),

    // Subscriptions (Sprint 6)
    _col(SubscriptionPlans),
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
    // PLATFORM BRANCH - Multi-tenant Management (alleen op platform-instantie)
    // ═══════════════════════════════════════════════════════════════════════════
    ...(_isPlatform ? [ClientRequests, Clients, Deployments] : []),
  ].filter(Boolean) as any[],

  // ─── Globals ──────────────────────────────
  // Consolidated from 8 → 4 globals for better UX!
  globals: [
    Settings, // NEW: Combines SiteSettings + ShopSettings
    Theme, // Design System (colors, typography, spacing)
    Header, // NEW: Combines TopBarSettings + AlertBarSettings + Navigation + old Header
    Footer,
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
