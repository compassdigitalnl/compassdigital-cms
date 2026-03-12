import type { CalculatorBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * Calculator Block Props
 *
 * Extends the Payload-generated CalculatorBlock interface with animation props.
 */
export interface CalculatorBlockProps extends CalculatorBlock, BlockAnimationProps {}

export type CalculatorBgColor = 'white' | 'light-grey' | 'gradient'
export type SliderUnit = 'euro' | 'hours' | 'percentage'

export interface SliderItem {
  label: string
  minValue?: number | null
  maxValue: number
  defaultValue?: number | null
  step?: number | null
  unit?: SliderUnit | null
  hourlyRate?: number | null
  id?: string | null
}
