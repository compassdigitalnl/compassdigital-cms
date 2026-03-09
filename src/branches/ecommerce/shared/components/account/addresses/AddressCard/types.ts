export interface AddressCardProps {
  address: any
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
  onEdit: (address: any) => void
}
