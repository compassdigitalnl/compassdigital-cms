export interface KvkResult {
  kvkNumber: string
  companyName: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
}

export interface KvkLookupProps {
  onResult: (result: KvkResult) => void
  onClear?: () => void
  className?: string
}

/** Shape returned by /api/kvk/lookup */
export interface KvkApiResponse {
  company?: {
    kvkNumber?: string
    name?: string
    tradeName?: string
    address?: {
      street?: string
      houseNumber?: string
      postalCode?: string
      city?: string
      country?: string
    }
  }
  message?: string
  error?: string
}
