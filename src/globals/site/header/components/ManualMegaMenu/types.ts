export type MegaMenuLink = {
  id?: string | null
  label: string
  url: string
  icon?: string | null
  description?: string | null
}

export type MegaMenuColumn = {
  id?: string | null
  title?: string | null
  links?: MegaMenuLink[]
}

export type ManualMegaMenuProps = {
  columns: MegaMenuColumn[]
  isOpen: boolean
  onClose: () => void
  navTop: number
  parentLabel?: string
  primaryColor?: string
  secondaryColor?: string
}
