import type { EmailSegment } from '../../lib/segmentation/types'

export interface SegmentCardProps {
  segment: EmailSegment
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}
