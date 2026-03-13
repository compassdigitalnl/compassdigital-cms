export type DropdownItem = {
  id?: string | null
  label: string
  page?: unknown
  url?: string | null
}

export type SimpleDropdownProps = {
  items: DropdownItem[]
  isOpen: boolean
  onClose: () => void
  primaryColor?: string
  secondaryColor?: string
}
