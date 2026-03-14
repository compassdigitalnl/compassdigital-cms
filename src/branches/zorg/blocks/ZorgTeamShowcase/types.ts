export interface ZorgTeamShowcaseProps {
  heading?: {
    badge?: string
    title: string
    description?: string
  }
  source?: 'auto' | 'manual'
  members?: any[]
  limit?: number
  columns?: '2' | '3' | '4'
  showSpecialties?: boolean
}
