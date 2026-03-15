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
// Wishlists (Feature #34 - Wishlist Sharing)
import { Wishlists } from '@/branches/ecommerce/b2c/collections/Wishlists'
// Product Reviews (Feature #32 + #43 - AI Review Moderation)
import { ProductReviews } from '@/branches/ecommerce/b2c/collections/ProductReviews'
// Loyalty (LoyaltyPoints merged into Users, LoyaltyRedemptions merged into LoyaltyTransactions)
import { LoyaltyRewards } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyRewards'
import { LoyaltyTiers } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyTiers'
import { LoyaltyTransactions } from '@/branches/ecommerce/b2c/collections/loyalty/LoyaltyTransactions'
// Marketing & A/B Testing
import { ABTests } from '@/branches/ecommerce/shared/collections/marketing/ABTests'
import { ABTestResults } from '@/branches/ecommerce/shared/collections/marketing/ABTestResults'
// DiscountCodes merged into Promotions (promotionMode: 'coupon')
import { Promotions } from '@/branches/ecommerce/shared/collections/marketing/Promotions'
import { EditionNotifications } from '@/branches/ecommerce/shared/collections/marketing/EditionNotifications'
import { GiftVouchers } from '@/branches/ecommerce/b2c/collections/marketing/GiftVouchers'
// Cart (Addresses merged into Users)
import { Carts } from '@/branches/ecommerce/shared/collections/checkout/Carts'

// Content Branch (premium content + digital library)
import { BlogPosts } from '@/branches/publishing/collections/BlogPosts'
import { DigitalEditionPages } from '@/branches/publishing/collections/DigitalEditionPages'

// Shared Collections (blog, marketing)
import { BlogCategories } from '@/branches/shared/collections/BlogCategories'
// FAQs collection removed — use FAQ block on pages instead

// Marketplace Branch (4 collections)
import { Vendors } from '@/branches/marketplace/collections/Vendors'
import { VendorReviews } from '@/branches/marketplace/collections/VendorReviews'
import { Workshops } from '@/branches/marketplace/collections/Workshops'
import { VendorApplications } from '@/branches/marketplace/collections/VendorApplications'

// Content Approvals (Feature #28 - Content Goedkeuringsworkflows)
import { ContentApprovals } from '@/branches/shared/collections/ContentApprovals'
// Shared Branch (5 collections + 2 subdirectories)
import { CookieConsents } from '@/branches/shared/collections/CookieConsents'
import { Media } from '@/branches/shared/collections/Media'
import { Notifications } from '@/branches/shared/collections/Notifications'
import { Partners } from '@/branches/shared/collections/Partners'
import { Themes } from '@/branches/shared/collections/Themes'
// Note: FormSubmissions is provided by formBuilderPlugin, no need to import manually

// Shared - Subdirectories (still in old location temporarily)
import { Pages } from '@/branches/shared/collections/Pages'
import { Users } from '@/branches/shared/collections/Users'

// Platform Feature (Multi-Tenant - 3 collections)
import { Clients } from '@/features/platform/collections/Clients'
import { ClientRequests } from '@/features/platform/collections/ClientRequests'
import { Deployments } from '@/features/platform/collections/Deployments'

// Automotive Branch (2 branch-specific collections)
import { Vehicles } from '@/branches/automotive/collections/Vehicles'
import { VehicleBrands } from '@/branches/automotive/collections/VehicleBrands'

// Toerisme Branch (3 branch-specific collections)
import { Tours } from '@/branches/toerisme/collections/Tours'
import { Destinations } from '@/branches/toerisme/collections/Destinations'
import { Accommodations } from '@/branches/toerisme/collections/Accommodations'

// Vastgoed Branch (1 branch-specific collection)
import { Properties } from '@/branches/vastgoed/collections/Properties'

// Onderwijs Branch (3 branch-specific collections)
import { Courses } from '@/branches/onderwijs/collections/Courses'
import { CourseCategories } from '@/branches/onderwijs/collections/CourseCategories'
import { Enrollments } from '@/branches/onderwijs/collections/Enrollments'

// Branch-specific collections REMOVED — replaced by unified Content collections
// (ContentServices, ContentCases, ContentReviews, ContentInquiries, ContentBookings, ContentTeam, ContentActivities)

// ─── Unified Content Collections (consolidation of 24+ branch-specific collections) ────
import { ContentServices } from '@/branches/shared/collections/ContentServices'
import { ContentCases } from '@/branches/shared/collections/ContentCases'
import { ContentReviews } from '@/branches/shared/collections/ContentReviews'
import { ContentInquiries } from '@/branches/shared/collections/ContentInquiries'
import { ContentBookings } from '@/branches/shared/collections/ContentBookings'
import { ContentTeam } from '@/branches/shared/collections/ContentTeam'
import { ContentActivities } from '@/branches/shared/collections/ContentActivities'

// Multistore Feature (2 collections + 1 global - Feature flagged)
import { MultistoreSites } from '@/features/multistore/collections/MultistoreSites'
import { SyncLog } from '@/features/multistore/collections/SyncLog'
import { MultistoreSettings } from '@/features/multistore/globals/MultistoreSettings'

// Email Marketing Feature (8 collections - Feature flagged)
import { emailMarketingFeatures, features } from '@/lib/tenant/features'
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

// PWA Feature (Push Notifications)
import { PushSubscriptions } from '@/features/pwa/collections/PushSubscriptions'

// Plugins
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ─── Collection Visibility ────────────────────────────────────────────────────
//
// ALL collections are ALWAYS registered in config. This is critical because
// removing collections via DISABLED_COLLECTIONS breaks relationTo references
// and causes 500 errors on any collection that references a disabled one.
//
// Visibility is controlled by:
// 1. admin.hidden + shouldHideCollection(featureKey) — server-side, per ENABLE_* env vars
// 2. HideCollections.tsx — client-side CSS hiding in admin sidebar
// 3. Feature toggles in EcommerceSettings — database-driven feature flags
//
// Platform-only collections (Clients, Deployments, etc.) are still conditionally
// included because they have no cross-references from other collections.
import { isClientDeployment } from '@/lib/tenant/isClientDeployment'
const _isPlatform = !isClientDeployment()

// ─── Database Configuration ───────────────────────────
// Automatically switch between SQLite (dev) and PostgreSQL (prod)
const databaseURL = process.env.DATABASE_URL || 'file:./payload.db'
const isPostgreSQL = databaseURL.startsWith('postgres://') || databaseURL.startsWith('postgresql://')

const databaseAdapter = isPostgreSQL
  ? postgresAdapter({
      pool: {
        connectionString: databaseURL,
      },
      // NOTE: push:true only works in development (NODE_ENV !== 'production').
      // In production, schema sync is handled by src/scripts/schema-push.ts
      // which is called during deploy (safe-deploy.sh / deploy.sh).
      push: true,
    })
  : sqliteAdapter({
      client: {
        url: databaseURL,
      },
      push: false,
    })

// ─── CORS Configuration ──────────────────────────────
// Use CORS_ORIGIN env var if set, otherwise derive from NEXT_PUBLIC_SERVER_URL
const corsOrigins: string[] = (() => {
  const corsEnv = process.env.CORS_ORIGIN
  if (corsEnv) {
    return corsEnv.split(',').map((s) => s.trim()).filter(Boolean)
  }
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (serverUrl) {
    return [serverUrl]
  }
  return []
})()

export default buildConfig({
  // ─── CORS ──────────────────────────────────
  cors: corsOrigins.length > 0 ? corsOrigins : undefined,

  // ─── Admin Panel ──────────────────────────
  admin: {
    components: {
      beforeLogin: ['@/branches/shared/components/admin/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/branches/shared/components/admin/BeforeDashboard#BeforeDashboard'],
      beforeNavLinks: [
        '@/features/platform/components/ClientSwitcher#ClientSwitcher',
        '@/branches/shared/components/admin/HideCollections#HideCollections',
        '@/branches/shared/components/admin/NavIcons#NavIcons',
      ],
      afterNavLinks: [
        ...(!features.multistoreHub
          ? [
              '@/features/analytics/components/admin/AnalyticsNavLinks#AnalyticsNavLinks',
              '@/features/stock-photos/components/admin/StockPhotosNavLink#StockPhotosNavLink',
              '@/features/ai/components/admin/AIToolsNavLink#AIToolsNavLink',
            ]
          : []),
        ...(features.multistoreHub
          ? ['@/features/multistore/components/admin/MultistoreNavLinks#MultistoreNavLinks']
          : []),
      ],
      graphics: {
        Logo: '@/branches/shared/components/admin/AdminLogo#AdminLogo',
        Icon: '@/branches/shared/components/admin/AdminLogo#AdminLogo',
      },
      views: {
        // Analytics, Stock Photos, AI views — hidden on multistore hub
        ...(!features.multistoreHub
          ? {
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
              stockPhotos: {
                Component:
                  '@/features/stock-photos/components/admin/StockPhotosView#StockPhotosView',
                path: '/stock-photos',
                meta: {
                  title: 'Stock Foto\'s',
                  description:
                    'Zoek en importeer professionele foto\'s van Unsplash en Pexels',
                },
              },
              aiStudio: {
                Component: '@/features/ai/components/admin/AIStudioView#AIStudioView',
                path: '/ai-studio',
                meta: {
                  title: 'AI Studio',
                  description:
                    'Genereer, verbeter, optimaliseer en vertaal content met AI',
                },
              },
              contentTemplates: {
                Component:
                  '@/features/ai/components/admin/ContentTemplatesView#ContentTemplatesView',
                path: '/content-templates',
                meta: {
                  title: 'Content Templates',
                  description:
                    'Kies een template en laat AI een complete pagina genereren',
                },
              },
            }
          : {}),
        // Multistore Hub views
        ...(features.multistoreHub
          ? {
              multistoreDashboard: {
                Component:
                  '@/features/multistore/components/admin/MultistoreDashboardView#MultistoreDashboardView',
                path: '/multistore',
                meta: {
                  title: 'Multistore Hub',
                  description: 'Overzicht van alle webshops en synchronisatie',
                },
              },
              multistoreOrders: {
                Component:
                  '@/features/multistore/components/admin/CentralOrdersView#CentralOrdersView',
                path: '/multistore/orders',
                meta: {
                  title: 'Centraal Orderdashboard',
                  description: 'Alle bestellingen van alle webshops',
                },
              },
              multistoreInventory: {
                Component:
                  '@/features/multistore/components/admin/InventoryOverviewView#InventoryOverviewView',
                path: '/multistore/inventory',
                meta: {
                  title: 'Voorraadbeheer',
                  description: 'Voorraadniveaus per product en per webshop',
                },
              },
              multistoreFulfillment: {
                Component:
                  '@/features/multistore/components/admin/FulfillmentView#FulfillmentView',
                path: '/multistore/fulfillment',
                meta: {
                  title: 'Fulfillment',
                  description: 'Pick, pack & ship workflow',
                },
              },
              multistoreDistribution: {
                Component:
                  '@/features/multistore/components/admin/ProductDistributionView#ProductDistributionView',
                path: '/multistore/distribution',
                meta: {
                  title: 'Productdistributie',
                  description: 'Distribueer producten in bulk naar webshops',
                },
              },
              multistoreReports: {
                Component:
                  '@/features/multistore/components/admin/ReportsView#ReportsView',
                path: '/multistore/reports',
                meta: {
                  title: 'Rapporten',
                  description: 'Omzet en commissie per webshop',
                },
              },
            }
          : {}),
      },
    },
    user: Users.slug,
    meta: {
      titleSuffix: '— Contyzr CMS',
    },
    css: path.resolve(dirname, 'globals/design/styles/admin.scss'),
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
  // 5. UNIFIED CONTENT - Services, Cases, Reviews, etc.
  // 6. EMAIL MARKETING - Campaigns, Lists, Subscribers
  // 7. PLATFORM - Multi-tenant management (alleen op platform-instantie)
  //
  // Visibility per tenant is controlled by ENABLE_* feature flags + admin.hidden.
  // Collections are ALWAYS registered — never removed from config — to prevent
  // broken relationTo references that cause 500 errors.
  //
  collections: [
    // ═══════════════════════════════════════════════════════════════════════════
    // SHARED BRANCH - Core collections (altijd actief)
    // ═══════════════════════════════════════════════════════════════════════════
    Users,
    Pages,
    Media,
    CookieConsents, // GDPR cookie consent tracking (always enabled)
    ContentApprovals, // Content approval workflow (Feature #28)
    Partners,
    Notifications,
    PushSubscriptions,
    Themes,
    // FormSubmissions is provided by formBuilderPlugin

    // ═══════════════════════════════════════════════════════════════════════════
    // ECOMMERCE BRANCH - Shop, Orders, Loyalty, Subscriptions
    // ═══════════════════════════════════════════════════════════════════════════

    // Product Management
    Products,
    ProductCategories,
    Brands,
    Branches,
    RecentlyViewed,
    EditionNotifications,

    // Publishing
    Magazines,
    DigitalEditionPages,

    // Customer Management (Customers + Addresses merged into Users)
    CustomerGroups,

    // Cart & Checkout (DiscountCodes merged into Promotions)
    Carts,
    Promotions,

    // Order Management
    Orders,
    OrderLists,
    RecurringOrders,
    Invoices,
    Returns,
    StockReservations,

    // Subscriptions (Sprint 6)
    SubscriptionPlans,
    SubscriptionPages,
    UserSubscriptions,
    PaymentMethods,

    // Wishlists (Feature #34 - Wishlist Sharing)
    Wishlists,

    // Product Reviews (Feature #32 + #43 - AI Review Moderation)
    ProductReviews,

    // Gift Vouchers (Sprint 6)
    GiftVouchers,

    // Licenses (Sprint 6)
    Licenses,
    LicenseActivations,

    // Loyalty Program (Sprint 6 — Points merged into Users, Redemptions merged into Transactions)
    LoyaltyTiers,
    LoyaltyRewards,
    LoyaltyTransactions,

    // B2B Invites & Approvals (CompanyAccounts merged into Users)
    CompanyInvites,
    ApprovalRequests,

    // Quotes (Sprint 10)
    Quotes,

    // A/B Testing (Sprint 9)
    ABTests,
    ABTestResults,

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTENT BRANCH - Blog
    // ═══════════════════════════════════════════════════════════════════════════
    BlogPosts,
    BlogCategories,

    // ═══════════════════════════════════════════════════════════════════════════
    // MARKETPLACE BRANCH - Vendors, Workshops, Reviews, Applications
    // ═══════════════════════════════════════════════════════════════════════════
    Vendors,
    VendorReviews,
    Workshops,
    VendorApplications,

    // ═══════════════════════════════════════════════════════════════════════════
    // AUTOMOTIVE BRANCH - Vehicle management for dealers and garages
    // ═══════════════════════════════════════════════════════════════════════════
    Vehicles,
    VehicleBrands,

    // ═══════════════════════════════════════════════════════════════════════════
    // TOERISME BRANCH - Tours, destinations and accommodations
    // ═══════════════════════════════════════════════════════════════════════════
    Tours,
    Destinations,
    Accommodations,

    // ═══════════════════════════════════════════════════════════════════════════
    // VASTGOED BRANCH - Property management for real estate agents
    // ═══════════════════════════════════════════════════════════════════════════
    Properties,

    // ═══════════════════════════════════════════════════════════════════════════
    // ONDERWIJS BRANCH - Course management for online academies
    // ═══════════════════════════════════════════════════════════════════════════
    Courses,
    CourseCategories,
    Enrollments,

    // ═══════════════════════════════════════════════════════════════════════════
    // UNIFIED CONTENT COLLECTIONS - Consolidation of branch-specific collections
    // Controlled by Settings > Content Modules (not feature flags)
    // ═══════════════════════════════════════════════════════════════════════════
    ContentServices,
    ContentCases,
    ContentReviews,
    ContentInquiries,
    ContentBookings,
    ContentTeam,
    ContentActivities,

    // ═══════════════════════════════════════════════════════════════════════════
    // MULTISTORE BRANCH - Hub management for multi-webshop sync
    // ═══════════════════════════════════════════════════════════════════════════
    MultistoreSites,
    SyncLog,

    // ═══════════════════════════════════════════════════════════════════════════
    // EMAIL MARKETING BRANCH - Email campaigns, lists, subscribers (Feature flagged)
    // ═══════════════════════════════════════════════════════════════════════════
    // Visibility en access geregeld via admin.hidden + access functies op de collections zelf.
    EmailSubscribers,
    EmailLists,
    EmailTemplates,
    EmailApiKeys,
    EmailCampaigns,
    AutomationRules,
    AutomationFlows,
    FlowInstances,
    EmailEvents,
    EmailSegments,

    // ═══════════════════════════════════════════════════════════════════════════
    // PLATFORM BRANCH - Multi-tenant Management
    // Clients is always registered because other collections reference it.
    // Platform-only collections are conditionally included.
    // ═══════════════════════════════════════════════════════════════════════════
    Clients,
    ...(_isPlatform ? [ClientRequests, Deployments, UptimeIncidents] : []),
  ] as any[],

  // ─── Globals ──────────────────────────────
  globals: [
    Settings,
    EcommerceSettings, // E-commerce: shipping, payment, B2B, features
    Theme, // Design System (colors, typography, spacing)
    Header,
    Footer,
    MeilisearchSettings, // Search engine configuration
    ChatbotSettings, // AI Chatbot configuration
    MultistoreSettings, // Multistore Hub configuration
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
