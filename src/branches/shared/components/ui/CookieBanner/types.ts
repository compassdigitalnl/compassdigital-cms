export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp?: number
  expiresAt?: number
}

export interface CookieBannerProps {
  privacyPolicyUrl?: string
  onAcceptAll?: (preferences: CookiePreferences) => void
  onSavePreferences?: (preferences: CookiePreferences) => void
  onEssentialOnly?: (preferences: CookiePreferences) => void
  storageKey?: string
  expiryDays?: number
}

export interface CookieCategory {
  id: 'essential' | 'analytics' | 'marketing'
  name: string
  description: string
  icon: string
  required: boolean
}
