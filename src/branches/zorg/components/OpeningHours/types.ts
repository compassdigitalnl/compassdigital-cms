export interface OpeningHoursProps {
  hours?: Array<{
    day: string
    morning?: string
    afternoon?: string
    closed?: boolean
  }>
  className?: string
}
