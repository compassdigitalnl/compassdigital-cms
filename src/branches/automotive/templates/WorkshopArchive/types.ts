export interface WorkshopArchiveProps {
  services: any[]
  categories: Array<{
    value: string
    label: string
    count: number
  }>
  activeCategory?: string
}
