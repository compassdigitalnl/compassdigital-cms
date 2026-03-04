export interface LicenseActivation {
  id: number
  deviceName: string
  os: string
  status: 'active' | 'deactivated'
  activatedAt: string
}

export interface LicenseDownload {
  version: string
  releasedAt: string
  label: string
  url: string
}

export interface LicenseItem {
  id: number
  productName: string
  licenseKey: string
  type: 'personal' | 'professional' | 'lifetime' | 'yearly' | 'ebook' | 'templates'
  status: 'active' | 'expiring' | 'expired'
  maxActivations: number
  currentActivations: number
  purchasedAt: string
  expiresAt: string | null
  activations: LicenseActivation[]
  downloads?: LicenseDownload[]
  daysUntilExpiry?: number
}

export interface LicenseStats {
  activeLicenses: number
  totalDevices: number
  actionRequired: number
  totalDownloads: number
}

export interface LicensesTemplateProps {
  licenses: LicenseItem[]
  stats: LicenseStats
  onDeactivateDevice: (licenseId: number, activationId: number) => void
  onDownloadLicense: (licenseId: number) => void
  isLoading?: boolean
}
