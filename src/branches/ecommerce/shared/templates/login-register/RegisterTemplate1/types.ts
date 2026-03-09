export type AccountType = 'b2b' | 'b2c'

export interface SiteConfig {
  companyName?: string
  phone?: string
  phoneFormatted?: string
  email?: string
}

export interface RegistrationData {
  // Step 1
  accountType: AccountType | null

  // Step 2 (B2B only)
  kvkNumber: string
  companyName: string
  vatNumber: string
  street: string
  postalCity: string
  country: string
  companyPhone: string
  branch: string | null
  referralSource: string
  separateBillingAddress: boolean

  // Step 3
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  acceptTerms: boolean

  // Step 4
  verificationSent: boolean
}

export interface RegisterTemplate1Props {
  defaultStep?: number
  siteConfig?: SiteConfig
  benefits?: Array<{
    icon: string
    iconColor: string
    iconBg: string
    title: string
    description: string
  }>
  trustItems?: Array<{ text: string }>
  branches?: Array<{ id: string; name: string; icon?: string }>
  freeShippingThreshold?: number
}
