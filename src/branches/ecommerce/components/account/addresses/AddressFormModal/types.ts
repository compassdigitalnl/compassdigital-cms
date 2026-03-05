import type { AddressFormData } from '@/branches/ecommerce/templates/account/AccountTemplate1/AddressesTemplate/types'

export interface AddressFormModalProps {
  formData: AddressFormData
  onUpdateForm: (data: Partial<AddressFormData>) => void
  editingAddress: string | null
  onClose: () => void
  onSave: () => void
}
