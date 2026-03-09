import type { SegmentCondition } from '../../lib/segmentation/types'

export interface SegmentConditionRowProps {
  condition: SegmentCondition
  onChange: (condition: SegmentCondition) => void
  onDelete: () => void
}
