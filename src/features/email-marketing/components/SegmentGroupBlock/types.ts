import type { SegmentGroup } from '../../lib/segmentation/types'

export interface SegmentGroupBlockProps {
  group: SegmentGroup
  onChange: (group: SegmentGroup) => void
  onDelete: () => void
  index: number
}
