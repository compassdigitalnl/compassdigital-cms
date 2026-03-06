export interface BranchCTAButton {
  label: string
  href: string
  variant: 'primary' | 'outline'
}

export interface BranchCTAProps {
  title: string
  description?: string
  buttons?: BranchCTAButton[]
  className?: string
}
