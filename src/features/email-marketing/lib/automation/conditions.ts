/**
 * Condition Evaluator
 *
 * Evaluates automation rule conditions against event payloads
 */

import type { Condition, ConditionOperator, EventPayload } from './types'

// ═══════════════════════════════════════════════════════════
// FIELD VALUE EXTRACTION
// ═══════════════════════════════════════════════════════════

/**
 * Get nested field value from object using dot notation
 * Example: getFieldValue({ user: { email: 'test@example.com' } }, 'user.email')
 * Returns: 'test@example.com'
 */
export function getFieldValue(obj: any, path: string): any {
  if (!path) return undefined

  const keys = path.split('.')
  let value = obj

  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined
    }
    value = value[key]
  }

  return value
}

// ═══════════════════════════════════════════════════════════
// VALUE COMPARISON
// ═══════════════════════════════════════════════════════════

/**
 * Compare two values using the specified operator
 */
export function compareValues(
  fieldValue: any,
  operator: ConditionOperator,
  conditionValue?: any
): boolean {
  // Normalize values for comparison
  const normalizedField = normalizeValue(fieldValue)
  const normalizedCondition = normalizeValue(conditionValue)

  switch (operator) {
    case 'equals':
      return normalizedField === normalizedCondition

    case 'not_equals':
      return normalizedField !== normalizedCondition

    case 'contains':
      if (typeof normalizedField !== 'string') return false
      if (typeof normalizedCondition !== 'string') return false
      return normalizedField.includes(normalizedCondition)

    case 'not_contains':
      if (typeof normalizedField !== 'string') return false
      if (typeof normalizedCondition !== 'string') return false
      return !normalizedField.includes(normalizedCondition)

    case 'greater_than':
      return Number(normalizedField) > Number(normalizedCondition)

    case 'less_than':
      return Number(normalizedField) < Number(normalizedCondition)

    case 'starts_with':
      if (typeof normalizedField !== 'string') return false
      if (typeof normalizedCondition !== 'string') return false
      return normalizedField.startsWith(normalizedCondition)

    case 'ends_with':
      if (typeof normalizedField !== 'string') return false
      if (typeof normalizedCondition !== 'string') return false
      return normalizedField.endsWith(normalizedCondition)

    case 'is_empty':
      return (
        normalizedField === null ||
        normalizedField === undefined ||
        normalizedField === '' ||
        (Array.isArray(normalizedField) && normalizedField.length === 0)
      )

    case 'is_not_empty':
      return !(
        normalizedField === null ||
        normalizedField === undefined ||
        normalizedField === '' ||
        (Array.isArray(normalizedField) && normalizedField.length === 0)
      )

    default:
      console.warn(`[Conditions] Unknown operator: ${operator}`)
      return false
  }
}

/**
 * Normalize value for comparison (case-insensitive strings, etc.)
 */
function normalizeValue(value: any): any {
  if (typeof value === 'string') {
    return value.toLowerCase().trim()
  }
  return value
}

// ═══════════════════════════════════════════════════════════
// CONDITION EVALUATION
// ═══════════════════════════════════════════════════════════

/**
 * Evaluate a single condition against an event payload
 */
export function evaluateCondition(
  condition: Condition,
  eventPayload: EventPayload
): boolean {
  try {
    // Extract field value from event payload
    const fieldValue = getFieldValue(eventPayload, condition.field)

    // Compare using operator
    const result = compareValues(fieldValue, condition.operator, condition.value)

    console.log(
      `[Conditions] Evaluating: ${condition.field} ${condition.operator} ${condition.value}`,
      `=> Field value: ${fieldValue}, Result: ${result}`
    )

    return result
  } catch (error) {
    console.error(`[Conditions] Error evaluating condition:`, error)
    return false
  }
}

/**
 * Evaluate multiple conditions (ALL must pass)
 */
export function evaluateConditions(
  conditions: Condition[] | undefined,
  eventPayload: EventPayload
): boolean {
  // No conditions = always match
  if (!conditions || conditions.length === 0) {
    return true
  }

  // All conditions must pass (AND logic)
  const results = conditions.map((condition) => evaluateCondition(condition, eventPayload))

  const allPass = results.every((result) => result === true)

  console.log(
    `[Conditions] Evaluated ${conditions.length} conditions:`,
    `${results.filter((r) => r).length}/${conditions.length} passed`,
    `=> Overall: ${allPass ? 'PASS' : 'FAIL'}`
  )

  return allPass
}

// ═══════════════════════════════════════════════════════════
// ADVANCED CONDITION HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Validate condition syntax
 */
export function validateCondition(condition: Condition): { valid: boolean; error?: string } {
  // Check required fields
  if (!condition.field) {
    return { valid: false, error: 'Field name is required' }
  }

  if (!condition.operator) {
    return { valid: false, error: 'Operator is required' }
  }

  // Check if value is required for operator
  const valuelessOperators: ConditionOperator[] = ['is_empty', 'is_not_empty']
  if (!valuelessOperators.includes(condition.operator) && condition.value === undefined) {
    return { valid: false, error: `Value is required for operator: ${condition.operator}` }
  }

  return { valid: true }
}

/**
 * Validate multiple conditions
 */
export function validateConditions(conditions: Condition[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  conditions.forEach((condition, index) => {
    const result = validateCondition(condition)
    if (!result.valid && result.error) {
      errors.push(`Condition ${index + 1}: ${result.error}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get human-readable condition description
 */
export function describeCondition(condition: Condition): string {
  const operatorLabels: Record<ConditionOperator, string> = {
    equals: 'equals',
    not_equals: 'does not equal',
    contains: 'contains',
    not_contains: 'does not contain',
    greater_than: 'is greater than',
    less_than: 'is less than',
    starts_with: 'starts with',
    ends_with: 'ends with',
    is_empty: 'is empty',
    is_not_empty: 'is not empty',
  }

  const operator = operatorLabels[condition.operator] || condition.operator

  if (condition.operator === 'is_empty' || condition.operator === 'is_not_empty') {
    return `${condition.field} ${operator}`
  }

  return `${condition.field} ${operator} "${condition.value}"`
}

/**
 * Get human-readable conditions summary
 */
export function describeConditions(conditions: Condition[]): string {
  if (!conditions || conditions.length === 0) {
    return 'No conditions (always triggers)'
  }

  if (conditions.length === 1) {
    return describeCondition(conditions[0])
  }

  const descriptions = conditions.map((c) => describeCondition(c))
  return descriptions.join(' AND ')
}

// ═══════════════════════════════════════════════════════════
// EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════

/*
Example 1: Simple email check
--------------------------------
const condition = {
  field: 'email',
  operator: 'ends_with',
  value: '@gmail.com'
}

const event = {
  eventType: 'user.signup',
  email: 'john@gmail.com',
  // ...
}

evaluateCondition(condition, event) // => true


Example 2: Order total check
--------------------------------
const condition = {
  field: 'total',
  operator: 'greater_than',
  value: 100
}

const event = {
  eventType: 'order.placed',
  total: 150,
  // ...
}

evaluateCondition(condition, event) // => true


Example 3: Multiple conditions (AND)
--------------------------------
const conditions = [
  { field: 'email', operator: 'ends_with', value: '@gmail.com' },
  { field: 'total', operator: 'greater_than', value: 50 }
]

const event = {
  eventType: 'order.placed',
  email: 'john@gmail.com',
  total: 100,
  // ...
}

evaluateConditions(conditions, event) // => true (both conditions pass)


Example 4: Nested field access
--------------------------------
const condition = {
  field: 'items.0.name',
  operator: 'contains',
  value: 'premium'
}

const event = {
  eventType: 'order.placed',
  items: [
    { name: 'Premium Subscription', price: 99 }
  ],
  // ...
}

evaluateCondition(condition, event) // => true
*/
