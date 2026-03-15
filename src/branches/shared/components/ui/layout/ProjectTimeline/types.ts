export interface TimelinePhase {
  title: string
  description?: string
  duration?: string
  icon?: string
}

export interface ProjectTimelineProps {
  phases: TimelinePhase[]
  title?: string
  className?: string
}
