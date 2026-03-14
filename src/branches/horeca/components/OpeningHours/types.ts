export interface OpeningHoursProps {
  hours?: Array<{
    day: string
    lunch?: string
    dinner?: string
    closed?: boolean
  }>
  className?: string
}
