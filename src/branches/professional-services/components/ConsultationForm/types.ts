export interface ConsultationFormProps {
  onSuccess?: (data: ConsultationFormData) => void
  className?: string
}

export interface ConsultationFormData {
  serviceType: string[]
  projectDescription: string
  budget: string
  timeline: string
  name: string
  email: string
  phone: string
  companyName?: string
  website?: string
  contactMethod: string
  preferredDate?: string
  additionalNotes?: string
}
