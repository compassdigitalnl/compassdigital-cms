export interface MagazineStat {
  value: string
  label: string
}

export interface MagazineHeroProps {
  badge?: string
  title: string
  description?: string
  logoUrl?: string | null
  stats?: MagazineStat[]
  className?: string
}
