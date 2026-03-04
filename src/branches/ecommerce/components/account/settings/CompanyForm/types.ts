export interface CompanyFormProps {
  companyData: {
    companyName: string
    kvk: string
    vat: string
  }
  onUpdate: (data: Partial<CompanyFormProps['companyData']>) => void
  onSave: () => void
  isSaving: boolean
}
