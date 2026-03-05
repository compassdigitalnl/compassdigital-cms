export interface CreateAddressModalProps {
  onAddressCreated?: (address: any) => void
  callback?: (address: any) => void
  children?: React.ReactNode
  disabled?: boolean
  skipSubmission?: boolean
}
