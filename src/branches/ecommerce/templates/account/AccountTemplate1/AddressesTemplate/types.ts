export interface AddressFormData {
  type: string
  name: string
  contactPerson: string
  street: string
  houseNumber: string
  addition: string
  postalCode: string
  city: string
  country: string
  isDefault: boolean
  kvk: string
  vat: string
}

export interface AddressesTemplateProps {
  addresses: any[]
  formData: AddressFormData
  onUpdateForm: (data: Partial<AddressFormData>) => void
  showNewAddressModal: boolean
  editingAddress: string | null
  onOpenNewModal: () => void
  onCloseModal: () => void
  onSaveAddress: () => void
  onDeleteAddress: (id: string) => void
  onSetDefault: (id: string) => void
  onStartEdit: (address: any) => void
}
