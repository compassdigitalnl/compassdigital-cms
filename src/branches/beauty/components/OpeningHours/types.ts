export interface OpeningHoursProps {
  hours?: Array<{
    day: string
    open: string
    close: string
    closed?: boolean
  }>
  className?: string
}
