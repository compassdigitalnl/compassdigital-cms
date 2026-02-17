import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

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
      beforeNavLinks: ['@/components/platform/ClientSwitcher#ClientSwitcher'],
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
  collections: [
    // Systeem
    Users,

    // Website Content
    Pages,
    BlogPosts,
    FAQs,
    Media,

    // Marketing
    Cases,
    Testimonials,
    ServicesCollection,
    Partners,

    // E-commerce (Logische volgorde: opbouwen → resultaat)
    ProductCategories, // 1. Eerst categorieën opzetten
    Brands, // 2. Dan merken toevoegen
    Products, // 3. Dan producten aanmaken en koppelen
    CustomerGroups, // 4. B2B klantgroepen instellen
    OrderLists, // 5. Klant favorieten/bestellijsten
    Orders, // 6. Uiteindelijke bestellingen

    // Platform Management (Multi-Tenant)
    ClientRequests, // Onboarding aanvragen van nieuwe klanten
    Clients, // Platform clients
    Deployments, // Deployment history

    // FormSubmissions is provided by formBuilderPlugin
  ],

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
