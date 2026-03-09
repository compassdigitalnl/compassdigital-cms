import type { SegmentDefinition } from '../../lib/segmentation/types'

export interface SegmentBuilderProps {
  value: SegmentDefinition
  onChange: (value: SegmentDefinition) => void
}
