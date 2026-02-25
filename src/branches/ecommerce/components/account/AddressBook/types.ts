export type AddressType = 'shipping' | 'billing' | 'both'

export type AddressTypeIcon = 'building-2' | 'file-text' | 'home'

export interface Address {
  id: string
  type: AddressType
  isPrimary: boolean
  company?: string
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  country?: string
  phone?: string
  kvk?: string // KVK number for business addresses
  createdAt?: string // ISO 8601 format
}

export interface AddressBookProps {
  addresses: Address[]
  onAdd?: (address: Omit<Address, 'id'>) => void | Promise<void>
  onEdit?: (addressId: string, updates: Partial<Address>) => void | Promise<void>
  onDelete?: (addressId: string) => void | Promise<void>
  onSetPrimary?: (addressId: string) => void | Promise<void>
  onDuplicate?: (addressId: string) => void
  maxAddresses?: number
  validatePostalCode?: (code: string) => boolean
  className?: string
}

export interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
  onSetPrimary: () => void
  onDuplicate?: () => void
}

export interface AddressEditFormProps {
  address: Address | null // null = new address
  onSave: (address: Omit<Address, 'id' | 'createdAt'> & { id?: string }) => void | Promise<void>
  onCancel: () => void
  validatePostalCode?: (code: string) => boolean
}
