export interface QuoteFormProps {
  onSuccess?: (data: QuoteFormData) => void
  className?: string
}

export interface QuoteFormData {
  projectType: string[]
  projectDescription: string
  propertyType: string
  squareMeters?: number
  timeline: string
  budget: string
  name: string
  email: string
  phone: string
  address?: string
  postalCode?: string
  city?: string
  contactMethod: string
  preferredDate?: string
  additionalNotes?: string
}
