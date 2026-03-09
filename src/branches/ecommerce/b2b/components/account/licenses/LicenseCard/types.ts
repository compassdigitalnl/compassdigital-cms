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

export interface LicenseCardProps {
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
  onDeactivateDevice: (licenseId: number, activationId: number) => void
  onDownloadLicense: (licenseId: number) => void
}
