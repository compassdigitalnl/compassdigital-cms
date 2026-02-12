/**
 * 🔧 Dynamic Payload Config Generator
 *
 * Generates Payload CMS configuration based on template selection.
 * Used during client provisioning to create customized CMS instances.
 */

import type { TemplateConfig } from './index'
import type { Config } from 'payload'

/**
 * Collection imports (lazy loaded based on template)
 * NOTE: This is used for CLIENT site generation, not the platform itself.
 * These imports are optional - if collection doesn't exist, it will be skipped.
 */
const collectionRegistry: Record<string, () => Promise<any>> = {
  // Core collections (exist in platform)
  pages: () => import('@/collections/Pages'),
  media: () => import('@/collections/Media'),
  users: () => import('@/collections/Users'),

  // E-commerce (exist in platform)
  products: () => import('@/collections/Products'),
  'product-categories': () => import('@/collections/shop/ProductCategories'),
  'product-brands': () => import('@/collections/Brands'),
  orders: () => import('@/collections/Orders'),

  // Blog (exist in platform)
  'blog-posts': () => import('@/collections/BlogPosts'),

  // Portfolio (exist in platform)
  cases: () => import('@/collections/Cases'),
  services: () => import('@/collections/ServicesCollection'),

  // Forms (exist in platform)
  'form-submissions': () => import('@/collections/FormSubmissions'),
}

/**
 * Block imports (lazy loaded based on template)
 * NOTE: These imports are for CLIENT site generation, not the platform.
 * Blocks are imported from config.ts files or direct .ts files.
 */
const blockRegistry: Record<string, () => Promise<any>> = {
  // Core blocks (exist in platform)
  hero: () => import('@/blocks/Hero'),
  content: () => import('@/blocks/Content/config'),
  spacer: () => import('@/blocks/Spacer'),
  cta: () => import('@/blocks/CTA'),
  faq: () => import('@/blocks/FAQ'),

  // E-commerce blocks (exist in platform)
  'product-grid': () => import('@/blocks/ProductGrid'),
  'category-grid': () => import('@/blocks/CategoryGrid'),
  'search-bar': () => import('@/blocks/SearchBar'),
  'quick-order': () => import('@/blocks/QuickOrder'),
  'top-bar': () => import('@/blocks/TopBar'),

  // Social proof (exist in platform)
  testimonials: () => import('@/blocks/TestimonialsBlock'),
}

/**
 * Global imports
 */
const globalRegistry: Record<string, () => Promise<any>> = {
  header: () => import('@/globals/Header'),
  footer: () => import('@/globals/Footer'),
  settings: () => import('@/globals/Settings'),
}

/**
 * Plugin imports
 * NOTE: These are optional and may not exist
 */
const pluginRegistry: Record<string, () => Promise<any>> = {
  // Plugins are typically loaded dynamically, skip for now
}

/**
 * Generate Payload configuration from template
 */
export async function generatePayloadConfig(
  template: TemplateConfig,
  options?: {
    enabledFeatures?: string[]
    disabledCollections?: string[]
    customSettings?: Record<string, any>
  },
): Promise<Partial<Config>> {
  const {
    enabledFeatures = [],
    disabledCollections = [],
    customSettings = {},
  } = options || {}

  // Filter collections based on template and disabled list
  const activeCollections = template.collections.filter(
    (name) => !disabledCollections.includes(name),
  )

  // Load collections
  const collections = await Promise.all(
    activeCollections.map(async (name) => {
      const loader = collectionRegistry[name]
      if (!loader) {
        console.warn(`Collection "${name}" not found in registry`)
        return null
      }
      try {
        const module = await loader()
        return module.default || module
      } catch (error) {
        console.error(`Failed to load collection "${name}":`, error)
        return null
      }
    }),
  )

  // Load blocks
  const blocks = await Promise.all(
    template.blocks.map(async (name) => {
      const loader = blockRegistry[name]
      if (!loader) {
        console.warn(`Block "${name}" not found in registry`)
        return null
      }
      try {
        const module = await loader()
        return module.default || module
      } catch (error) {
        console.error(`Failed to load block "${name}":`, error)
        return null
      }
    }),
  )

  // Load globals
  const globals = await Promise.all(
    template.globals.map(async (name) => {
      const loader = globalRegistry[name]
      if (!loader) {
        console.warn(`Global "${name}" not found in registry`)
        return null
      }
      try {
        const module = await loader()
        return module.default || module
      } catch (error) {
        console.error(`Failed to load global "${name}":`, error)
        return null
      }
    }),
  )

  // Load plugins
  const plugins = await Promise.all(
    template.plugins.map(async (name) => {
      const loader = pluginRegistry[name]
      if (!loader) {
        console.warn(`Plugin "${name}" not found in registry`)
        return null
      }
      try {
        const module = await loader()
        return module.default || module
      } catch (error) {
        console.error(`Failed to load plugin "${name}":`, error)
        return null
      }
    }),
  )

  return {
    collections: collections.filter(Boolean),
    globals: globals.filter(Boolean),
    plugins: plugins.filter(Boolean),
    // Custom settings from template + overrides
    admin: {
      meta: {
        titleSuffix: ` - ${template.name}`,
      },
    },
  }
}

/**
 * Generate environment variables for client deployment
 */
export function generateClientEnvironment(data: {
  clientName: string
  domain: string
  databaseUrl: string
  template: TemplateConfig
  adminEmail?: string
  customVars?: Record<string, string>
}): Record<string, string> {
  const { clientName, domain, databaseUrl, template, adminEmail, customVars = {} } = data

  // Generate secure payload secret
  const payloadSecret = generateSecureSecret(32)

  // Base environment
  const env: Record<string, string> = {
    // Core
    PAYLOAD_SECRET: payloadSecret,
    DATABASE_URL: databaseUrl,
    NEXT_PUBLIC_SERVER_URL: `https://${domain}`,
    SITE_NAME: clientName,

    // Template info (for runtime checks)
    TEMPLATE_ID: template.id,
    TEMPLATE_NAME: template.name,

    // Features (comma-separated for easy parsing)
    ENABLED_FEATURES: Object.entries(template.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature)
      .join(','),

    // Admin
    ...(adminEmail ? { ADMIN_EMAIL: adminEmail } : {}),

    // Default settings from template
    ...Object.entries(template.defaultSettings || {}).reduce(
      (acc, [key, value]) => {
        acc[`DEFAULT_${key.toUpperCase()}`] = String(value)
        return acc
      },
      {} as Record<string, string>,
    ),

    // Custom overrides
    ...customVars,
  }

  return env
}

/**
 * Generate secure random secret
 */
function generateSecureSecret(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate .env file content
 */
export function generateEnvFileContent(env: Record<string, string>): string {
  const lines = [
    '# ======================================',
    '# Generated Client Environment',
    '# ======================================',
    '',
    '# Core Configuration',
    ...Object.entries(env)
      .filter(([key]) => ['PAYLOAD_SECRET', 'DATABASE_URL', 'NEXT_PUBLIC_SERVER_URL', 'SITE_NAME'].includes(key))
      .map(([key, value]) => `${key}="${value}"`),
    '',
    '# Template Configuration',
    ...Object.entries(env)
      .filter(([key]) => key.startsWith('TEMPLATE_') || key.startsWith('ENABLED_'))
      .map(([key, value]) => `${key}="${value}"`),
    '',
    '# Default Settings',
    ...Object.entries(env)
      .filter(([key]) => key.startsWith('DEFAULT_'))
      .map(([key, value]) => `${key}="${value}"`),
    '',
    '# Optional Configuration (configure as needed)',
    '# NEXT_PUBLIC_GA_ID=""',
    '# NEXT_PUBLIC_SENTRY_DSN=""',
    '# RECAPTCHA_SECRET_KEY=""',
    '# NEXT_PUBLIC_RECAPTCHA_SITE_KEY=""',
    '# RESEND_API_KEY=""',
    '# OPENAI_API_KEY=""',
    '',
  ]

  return lines.join('\n')
}

/**
 * Validate template configuration
 */
export function validateTemplateConfig(template: TemplateConfig): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!template.id) errors.push('Template ID is required')
  if (!template.name) errors.push('Template name is required')
  if (!template.collections || template.collections.length === 0) {
    errors.push('Template must have at least one collection')
  }

  // Core collections should always be present
  const coreCollections = ['pages', 'media', 'users']
  coreCollections.forEach((col) => {
    if (!template.collections.includes(col)) {
      errors.push(`Template missing core collection: ${col}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
