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

// Collections
import { BlogPosts } from '@/collections/BlogPosts'
import { BlogCategories } from '@/collections/BlogCategories'
import { Brands } from '@/collections/Brands'
import { Cases } from '@/collections/Cases'
import { FAQs } from '@/collections/FAQs'
// Note: FormSubmissions is provided by formBuilderPlugin, no need to import manually
import { Media } from '@/collections/Media'
import { OrderLists } from '@/collections/OrderLists'
import { Orders } from '@/collections/Orders'
import { Pages } from '@/collections/Pages'
import { Partners } from '@/collections/Partners'
import { Products } from '@/collections/Products'
import { ServicesCollection } from '@/collections/ServicesCollection'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'

// Shop Collections
import { ProductCategories } from '@/collections/shop/ProductCategories'
import { CustomerGroups } from '@/collections/shop/CustomerGroups'

// Platform Collections (Multi-Tenant)
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

  // ─── Collections ──────────────────────────
  // Altijd aan (kern — nooit uitgeschakeld)
  // Optioneel gefilterd via DISABLED_COLLECTIONS env var (zie boven)
  // Platform-only collections (Clients, Deployments, ClientRequests) zijn
  // alleen actief op de platform-instantie (_isPlatform === true).
  collections: [
    // Kern — altijd actief
    Users,
    Pages,
    Media,

    // Website content — optioneel per klant
    _col(BlogPosts),
    _col(BlogCategories),
    _col(FAQs),
    _col(Cases),
    _col(Testimonials),
    _col(ServicesCollection),
    _col(Partners),

    // E-commerce — optioneel per klant
    _col(ProductCategories),
    _col(Brands),
    _col(Products),
    _col(CustomerGroups),
    _col(OrderLists),
    _col(Orders),

    // Platform Management — alleen op platform-instantie
    ...(_isPlatform ? [ClientRequests, Clients, Deployments] : []),

    // FormSubmissions is provided by formBuilderPlugin
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
