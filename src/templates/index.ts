/**
 * 🎨 Template System
 *
 * Defines available site templates with their collections, blocks, and features.
 * Used for provisioning new client sites with specific configurations.
 */

export interface TemplateConfig {
  id: string
  name: string
  description: string
  collections: string[]
  blocks: string[]
  plugins: string[]
  globals: string[]
  features: {
    ecommerce?: boolean
    blog?: boolean
    forms?: boolean
    authentication?: boolean
    multiLanguage?: boolean
    ai?: boolean
  }
  defaultSettings?: Record<string, any>
}

/**
 * E-commerce Template
 * Full-featured online store with products, cart, checkout
 */
export const ecommerceTemplate: TemplateConfig = {
  id: 'ecommerce',
  name: 'E-commerce Store',
  description: 'Complete online store with products, cart, checkout, and order management',
  collections: [
    // Core
    'pages',
    'media',
    'users',
    // E-commerce specific
    'products',
    'product-categories',
    'product-brands',
    'orders',
    // Optional
    'blog-posts',
    'form-submissions',
  ],
  blocks: [
    // Layout
    'hero',
    'content',
    'spacer',
    'cta',
    // E-commerce
    'product-grid',
    'category-grid',
    'search-bar',
    'quick-order',
    'top-bar',
    // Social proof
    'testimonials',
    // Utility
    'faq',
  ],
  plugins: [],
  globals: ['header', 'footer', 'settings'],
  features: {
    ecommerce: true,
    blog: true,
    forms: true,
    authentication: true,
    multiLanguage: false,
    ai: true,
  },
  defaultSettings: {
    currency: 'EUR',
    locale: 'nl-NL',
    theme: 'default',
    enableCart: true,
    enableCheckout: true,
    enableWishlist: true,
  },
}

/**
 * Blog Template
 * Content-focused blog with posts, categories, authors
 */
export const blogTemplate: TemplateConfig = {
  id: 'blog',
  name: 'Blog & Magazine',
  description: 'Content-first blog with advanced publishing features',
  collections: [
    // Core
    'pages',
    'media',
    'users',
    // Blog specific
    'blog-posts',
    // Optional
    'form-submissions',
  ],
  blocks: [
    // Layout
    'hero',
    'content',
    'spacer',
    'cta',
    // Content
    'testimonials',
    'faq',
  ],
  plugins: [],
  globals: ['header', 'footer', 'settings'],
  features: {
    ecommerce: false,
    blog: true,
    forms: true,
    authentication: true,
    multiLanguage: false,
    ai: true,
  },
  defaultSettings: {
    postsPerPage: 12,
    enableComments: false,
    enableSocialShare: true,
  },
}

/**
 * B2B Template
 * Business-to-business platform with quotes, bulk ordering, account management
 */
export const b2bTemplate: TemplateConfig = {
  id: 'b2b',
  name: 'B2B Platform',
  description: 'Professional B2B platform with bulk ordering and customer accounts',
  collections: [
    // Core
    'pages',
    'media',
    'users',
    // B2B specific
    'products',
    'product-categories',
    'orders',
    // Optional
    'blog-posts',
    'form-submissions',
  ],
  blocks: [
    // Layout
    'hero',
    'content',
    'spacer',
    'cta',
    // B2B
    'product-grid',
    'quick-order',
    'search-bar',
    'top-bar',
    // Social proof
    'testimonials',
    // Utility
    'faq',
  ],
  plugins: [],
  globals: ['header', 'footer', 'settings'],
  features: {
    ecommerce: true,
    blog: true,
    forms: true,
    authentication: true,
    multiLanguage: false,
    ai: true,
  },
  defaultSettings: {
    enableQuotes: true,
    enableBulkOrder: true,
    requireApproval: true,
    showPricing: false, // B2B often has custom pricing
  },
}

/**
 * Portfolio Template
 * Showcase work with cases, projects, and services
 */
export const portfolioTemplate: TemplateConfig = {
  id: 'portfolio',
  name: 'Portfolio & Agency',
  description: 'Showcase your work with cases, projects, and services',
  collections: [
    // Core
    'pages',
    'media',
    'users',
    // Portfolio specific
    'cases',
    'services',
    // Optional
    'blog-posts',
    'form-submissions',
  ],
  blocks: [
    // Layout
    'hero',
    'content',
    'spacer',
    'cta',
    // Social proof
    'testimonials',
    // Utility
    'faq',
  ],
  plugins: [],
  globals: ['header', 'footer', 'settings'],
  features: {
    ecommerce: false,
    blog: true,
    forms: true,
    authentication: false,
    multiLanguage: false,
    ai: true,
  },
  defaultSettings: {
    showcaseFeaturedWork: true,
    enableContactForm: true,
  },
}

/**
 * Corporate Template
 * Professional corporate website with company info, services, team
 */
export const corporateTemplate: TemplateConfig = {
  id: 'corporate',
  name: 'Corporate Website',
  description: 'Professional corporate site with services and company information',
  collections: [
    // Core
    'pages',
    'media',
    'users',
    // Corporate specific
    'services',
    // Optional
    'blog-posts',
    'cases',
    'form-submissions',
  ],
  blocks: [
    // Layout
    'hero',
    'content',
    'spacer',
    'cta',
    // Social proof
    'testimonials',
    // Utility
    'faq',
  ],
  plugins: [],
  globals: ['header', 'footer', 'settings'],
  features: {
    ecommerce: false,
    blog: true,
    forms: true,
    authentication: false,
    multiLanguage: false,
    ai: true,
  },
  defaultSettings: {
    enableTeamSection: true,
    enableServicesSection: true,
  },
}

/**
 * All available templates
 */
export const templates: Record<string, TemplateConfig> = {
  ecommerce: ecommerceTemplate,
  blog: blogTemplate,
  b2b: b2bTemplate,
  portfolio: portfolioTemplate,
  corporate: corporateTemplate,
}

/**
 * Get template by ID
 */
export function getTemplate(id: string): TemplateConfig | null {
  return templates[id] || null
}

/**
 * Get all template IDs
 */
export function getTemplateIds(): string[] {
  return Object.keys(templates)
}

/**
 * Get all templates
 */
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templates)
}

/**
 * Validate template ID
 */
export function isValidTemplate(id: string): boolean {
  return id in templates
}
