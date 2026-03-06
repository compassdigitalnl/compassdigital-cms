import type { LucideIcon } from 'lucide-react'

export interface ServiceLink {
  icon: LucideIcon | string
  label: string
  href: string
}

export interface MagazineServiceLinksProps {
  links?: ServiceLink[]
  title?: string
  className?: string
}
