import type { ABTest, ABTestResult } from '@/payload-types'

/**
 * A/B Test Types
 *
 * Frontend types for A/B testing framework.
 */

export interface ABTestVariant {
  name: string
  label: string
  description?: string
  distribution: number
}

export interface ABTestConfig {
  id: string
  name: string
  targetPage: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ABTestVariant[]
  startDate?: string
  endDate?: string
  winner?: string
  client?: string
}

export interface ABTestAssignment {
  testId: string
  variant: string
  sessionId?: string
  userId?: string
  createdAt: Date
}

export interface ConversionData {
  conversionValue?: number
  orderId?: string
  metadata?: Record<string, any>
}

export interface UseABTestReturn {
  variant: string | null
  isLoading: boolean
  trackConversion: (data?: ConversionData) => Promise<void>
  isConverted: boolean
}

export type ABTestDoc = ABTest
export type ABTestResultDoc = ABTestResult
