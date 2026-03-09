export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'not_in' | 'is_set' | 'is_not_set'

export type ConditionField =
  | 'email' | 'name' | 'created_at' | 'status'
  | 'total_orders' | 'total_revenue' | 'avg_order_value' | 'last_order_at' | 'days_since_last_order'
  | 'rfm_segment' | 'recency_score' | 'frequency_score' | 'monetary_score'
  | 'churn_risk' | 'churn_label' | 'clv_predicted'
  | 'list_id' | 'tag'

export interface SegmentCondition {
  id: string
  field: ConditionField
  operator: ConditionOperator
  value: string | number | string[] | number[]
  valueEnd?: string | number  // for 'between' operator
}

export interface SegmentGroup {
  id: string
  logic: 'and' | 'or'
  conditions: SegmentCondition[]
}

export interface SegmentDefinition {
  logic: 'and' | 'or'
  groups: SegmentGroup[]
}

export interface EmailSegment {
  id: number
  title: string
  slug: string
  description?: string
  conditions: SegmentDefinition
  conditionLogic: 'and' | 'or'
  subscriberCount: number
  lastCalculatedAt?: string
  autoSync: boolean
  listmonkListId?: number
  status: 'active' | 'archived'
}
