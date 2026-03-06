export interface BranchStat {
  value: string
  label: string
}

export interface BranchHeroProps {
  badge?: string
  title: string
  description?: string
  icon?: string
  stats?: BranchStat[]
  className?: string
}
