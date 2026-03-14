export interface ItineraryDay {
  dayNumber: number
  title: string
  description?: any // richText content
  location?: string
}

export interface ItineraryTimelineProps {
  days: ItineraryDay[]
  className?: string
}
