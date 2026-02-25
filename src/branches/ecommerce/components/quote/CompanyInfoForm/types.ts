export interface CompanyInfo {
  name: string
  kvk: string // Chamber of Commerce number (8 digits)
  btw: string // VAT number (NL123456789B01)
  address: string
  verified: boolean // Show verified badge
  contactPerson?: {
    name: string
    phone: string
    email: string
  }
}

export interface CompanyInfoFormProps {
  companyInfo: CompanyInfo
  showContactFields?: boolean // Show editable contact person fields
  onContactChange?: (field: keyof NonNullable<CompanyInfo['contactPerson']>, value: string) => void
  helperText?: string // Custom helper text
  showEditButton?: boolean // Show "Wijzig contactpersoon" button (future)
  className?: string
}
