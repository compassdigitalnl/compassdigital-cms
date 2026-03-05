/**
 * Site Generator Wizard Types
 * Type definitions for the wizard flow
 */

// ─── Site Goal Types ──────────────────────────────────────────────────────────

export type PrimaryType = 'website' | 'webshop' | 'hybrid'

export type WebsiteSubType = 'corporate' | 'portfolio' | 'agency' | 'blog' | 'landing'

export type WebshopModel = 'b2c-simple' | 'b2c-advanced' | 'b2b' | 'hybrid'

export type PricingModel = 'flat' | 'tiered' | 'customer-groups'

export type ExtraFeature =
  | 'paywall'
  | 'ad-space'
  | 'events-calendar'
  | 'job-board'
  | 'booking-system'
  | 'live-chat'

export interface SiteGoal {
  primaryType: PrimaryType
  // Website specifiek
  websiteSubType?: WebsiteSubType
  // Webshop specifiek
  shopModel?: WebshopModel
  pricingModel?: PricingModel
  hasCustomerGroups?: boolean
  requiresApproval?: boolean
  hidePricesForGuests?: boolean
  enableQuoteRequests?: boolean
  enableBulkOrder?: boolean
  // Hybrid: website-type naast de shop
  hybridWebsiteType?: WebsiteSubType
}

// ─── Wizard State ─────────────────────────────────────────────────────────────

export interface WizardState {
  currentStep: number
  siteGoal?: SiteGoal
  companyInfo: CompanyInfo
  design: DesignPreferences
  content: ContentSettings
  features: Features
  extraFeatures?: ExtraFeature[]
  ecommerce?: EcommerceSettings
}

export interface CompanyInfo {
  name: string
  businessType: 'B2B' | 'B2C' | 'Non-profit' | 'E-commerce' | ''
  industry: string
  targetAudience: string
  coreValues: string[]
  usps: string[]
  services?: UserService[]
  testimonials?: UserTestimonial[]
  portfolioCases?: UserPortfolioCase[]
  pricingPackages?: UserPricingPackage[]
  contactInfo?: ContactInfo
}

export interface UserService {
  name: string
  description: string
}

export interface UserTestimonial {
  name: string
  role?: string
  company?: string
  quote: string
  rating?: number
}

export interface UserPortfolioCase {
  projectName: string
  client: string
  industry?: string
  description: string
  challenge?: string
  solution?: string
  results?: string
  technologies?: string[]
  duration?: string
  imageUrl?: string
}

export interface UserPricingPackage {
  name: string
  price: string
  currency?: string
  period?: string
  description?: string
  features: string[]
  ctaText?: string
  highlighted?: boolean
  badge?: string
}

export interface ContactInfo {
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  openingHours?: string
  formConfig?: {
    enableNameField: boolean
    enablePhoneField: boolean
    enableCompanyField: boolean
    enableSubjectField: boolean
    requirePhoneField: boolean
    requireCompanyField: boolean
    notificationEmail: string
    confirmationMessage?: string
  }
}

export interface DesignPreferences {
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
  style: 'modern' | 'classic' | 'minimalist' | 'bold'
  logo?: File | string
  fontPreference: 'serif' | 'sans-serif' | 'monospace'
}

export interface ContentSettings {
  language: 'nl' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt'
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative'
  pages: string[]
}

export interface Features {
  contactForm: boolean
  newsletter: boolean
  testimonials: boolean
  faq: boolean
  socialMedia: boolean
  maps: boolean
  cta: boolean
  ecommerce: boolean
}

export interface EcommerceSettings {
  enabled: boolean
  shopType: 'B2C' | 'B2B' | 'Hybrid' | ''
  pricingStrategy: 'simple' | 'role-based' | 'volume-based' | 'hybrid'
  customRoles: CustomPricingRole[]
  currency: string
  taxRate?: number
  shippingEnabled: boolean
  stockManagement: boolean
  productImportMethod?: 'manual' | 'csv' | 'xlsx'
}

export interface CustomPricingRole {
  id: string
  name: string
  description?: string
  isDefault: boolean
  priority: number // Lower = higher priority (1 = highest)
}

export interface ProductTemplate {
  templateType: 'basis' | 'advanced' | 'enterprise'
  includeRolePricing: boolean
  customRoles: CustomPricingRole[]
  includeVariants: boolean
  includeSpecifications: boolean
  includeCategories: boolean
}

export interface ProductTemplateColumn {
  key: string
  label: string
  description: string
  required: boolean
  example: string
  category: 'basic' | 'pricing' | 'inventory' | 'shipping' | 'media' | 'variants' | 'seo' | 'status'
}

export interface GeneratedSite {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  currentStep: string
  pages: GeneratedPage[]
  siteSettings?: any
  previewUrl?: string
  error?: string
}

export interface GeneratedPage {
  id: string
  title: string
  slug: string
  blocks: any[]
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface BlockGenerationContext {
  companyInfo: CompanyInfo
  design: DesignPreferences
  content: ContentSettings
  features: Features
  pageType: string
  blockType: string
}

export interface PageGenerationContext {
  companyInfo: CompanyInfo
  design: DesignPreferences
  content: ContentSettings
  features: Features
  pageType: string
}
