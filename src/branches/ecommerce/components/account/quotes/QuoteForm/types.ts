export interface QuoteFormData {
  companyName: string
  kvkNumber: string
  contactPerson: string
  email: string
  phone: string
  sector: string
  desiredDeliveryDate: string
  deliveryFrequency: string
  notes: string
  wantsConsultation: boolean
  agreedToPrivacy: boolean
}

export interface QuoteFormProps {
  formData: QuoteFormData
  onChange: (field: keyof QuoteFormData, value: string | boolean) => void
  onSubmit: () => void
  isSubmitting?: boolean
}
