import type { ConditionField, ConditionOperator } from '../../lib/segmentation/types'

export interface ConditionValuePickerProps {
  field: ConditionField
  operator: ConditionOperator
  value: string | number | string[] | number[]
  valueEnd?: string | number
  onChange: (value: any, valueEnd?: any) => void
}
