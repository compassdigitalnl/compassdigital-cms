export interface CategoryPill {
  label: string
  href: string
  icon?: string
}

export interface CategoryPillsProps {
  title?: string
  pills: CategoryPill[]
  className?: string
}
