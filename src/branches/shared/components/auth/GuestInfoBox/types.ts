export interface GuestBenefit {
  label: string
  icon?: string
}

export interface GuestInfoBoxProps {
  title?: string
  description?: string
  benefits?: GuestBenefit[]
  className?: string
}
