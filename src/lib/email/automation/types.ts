/**
 * Automation Types & Event Definitions
 *
 * Type-safe event definitions for automation rules
 */

// ═══════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════

export type EventType =
  // User Events
  | 'user.signup'
  | 'user.updated'
  | 'user.login'
  // Subscriber Events
  | 'subscriber.added'
  | 'subscriber.confirmed'
  | 'subscriber.unsubscribed'
  | 'subscriber.list_changed'
  // E-commerce Events
  | 'order.placed'
  | 'order.completed'
  | 'order.cancelled'
  | 'cart.abandoned'
  | 'product.purchased'
  // Engagement Events
  | 'email.opened'
  | 'email.clicked'
  | 'email.bounced'
  | 'campaign.completed'
  // Custom Events
  | 'custom.event'

export type EventCategory =
  | 'user'
  | 'subscriber'
  | 'ecommerce'
  | 'engagement'
  | 'custom'

export interface EventMetadata {
  type: EventType
  category: EventCategory
  label: string
  description: string
  icon: string
}

export const EVENT_DEFINITIONS: Record<EventType, EventMetadata> = {
  // User Events
  'user.signup': {
    type: 'user.signup',
    category: 'user',
    label: 'User Signed Up',
    description: 'When a new user creates an account',
    icon: '👤',
  },
  'user.updated': {
    type: 'user.updated',
    category: 'user',
    label: 'User Profile Updated',
    description: 'When a user updates their profile',
    icon: '👤',
  },
  'user.login': {
    type: 'user.login',
    category: 'user',
    label: 'User Logged In',
    description: 'When a user logs into the system',
    icon: '👤',
  },

  // Subscriber Events
  'subscriber.added': {
    type: 'subscriber.added',
    category: 'subscriber',
    label: 'Subscriber Added',
    description: 'When a new subscriber is added to a list',
    icon: '📧',
  },
  'subscriber.confirmed': {
    type: 'subscriber.confirmed',
    category: 'subscriber',
    label: 'Subscriber Confirmed',
    description: 'When a subscriber confirms their subscription',
    icon: '📧',
  },
  'subscriber.unsubscribed': {
    type: 'subscriber.unsubscribed',
    category: 'subscriber',
    label: 'Subscriber Unsubscribed',
    description: 'When a subscriber opts out',
    icon: '📧',
  },
  'subscriber.list_changed': {
    type: 'subscriber.list_changed',
    category: 'subscriber',
    label: 'Subscriber List Changed',
    description: 'When a subscriber is moved to a different list',
    icon: '📧',
  },

  // E-commerce Events
  'order.placed': {
    type: 'order.placed',
    category: 'ecommerce',
    label: 'Order Placed',
    description: 'When a customer places an order',
    icon: '🛒',
  },
  'order.completed': {
    type: 'order.completed',
    category: 'ecommerce',
    label: 'Order Completed',
    description: 'When an order is fulfilled',
    icon: '🛒',
  },
  'order.cancelled': {
    type: 'order.cancelled',
    category: 'ecommerce',
    label: 'Order Cancelled',
    description: 'When an order is cancelled',
    icon: '🛒',
  },
  'cart.abandoned': {
    type: 'cart.abandoned',
    category: 'ecommerce',
    label: 'Cart Abandoned',
    description: 'When a cart is abandoned for X hours',
    icon: '🛒',
  },
  'product.purchased': {
    type: 'product.purchased',
    category: 'ecommerce',
    label: 'Product Purchased',
    description: 'When a specific product is purchased',
    icon: '🛒',
  },

  // Engagement Events
  'email.opened': {
    type: 'email.opened',
    category: 'engagement',
    label: 'Email Opened',
    description: 'When a subscriber opens an email',
    icon: '✉️',
  },
  'email.clicked': {
    type: 'email.clicked',
    category: 'engagement',
    label: 'Email Link Clicked',
    description: 'When a subscriber clicks a link in an email',
    icon: '✉️',
  },
  'email.bounced': {
    type: 'email.bounced',
    category: 'engagement',
    label: 'Email Bounced',
    description: 'When an email bounces',
    icon: '✉️',
  },
  'campaign.completed': {
    type: 'campaign.completed',
    category: 'engagement',
    label: 'Campaign Completed',
    description: 'When a campaign finishes sending',
    icon: '✉️',
  },

  // Custom Events
  'custom.event': {
    type: 'custom.event',
    category: 'custom',
    label: 'Custom Event',
    description: 'Custom user-defined event',
    icon: '🔔',
  },
}

// ═══════════════════════════════════════════════════════════
// EVENT PAYLOADS
// ═══════════════════════════════════════════════════════════

export interface BaseEventPayload {
  eventType: EventType
  tenantId: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface UserEventPayload extends BaseEventPayload {
  eventType: 'user.signup' | 'user.updated' | 'user.login'
  userId: string
  email: string
  name?: string
  role?: string
  data?: Record<string, any>
}

export interface SubscriberEventPayload extends BaseEventPayload {
  eventType: 'subscriber.added' | 'subscriber.confirmed' | 'subscriber.unsubscribed' | 'subscriber.list_changed'
  subscriberId: string
  email: string
  listId?: string
  previousListId?: string
  attributes?: Record<string, any>
}

export interface OrderEventPayload extends BaseEventPayload {
  eventType: 'order.placed' | 'order.completed' | 'order.cancelled'
  orderId: string
  userId?: string
  email: string
  total: number
  currency: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
}

export interface CartEventPayload extends BaseEventPayload {
  eventType: 'cart.abandoned'
  cartId: string
  userId?: string
  email: string
  total: number
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
}

export interface ProductEventPayload extends BaseEventPayload {
  eventType: 'product.purchased'
  productId: string
  productName: string
  userId?: string
  email: string
  price: number
  quantity: number
}

export interface EmailEventPayload extends BaseEventPayload {
  eventType: 'email.opened' | 'email.clicked' | 'email.bounced'
  campaignId?: string
  subscriberId: string
  email: string
  linkUrl?: string
  bounceType?: 'hard' | 'soft'
}

export interface CampaignEventPayload extends BaseEventPayload {
  eventType: 'campaign.completed'
  campaignId: string
  campaignName: string
  sent: number
  opened: number
  clicked: number
  bounced: number
}

export interface CustomEventPayload extends BaseEventPayload {
  eventType: 'custom.event'
  customEventName: string
  data: Record<string, any>
}

export type EventPayload =
  | UserEventPayload
  | SubscriberEventPayload
  | OrderEventPayload
  | CartEventPayload
  | ProductEventPayload
  | EmailEventPayload
  | CampaignEventPayload
  | CustomEventPayload

// ═══════════════════════════════════════════════════════════
// CONDITION TYPES
// ═══════════════════════════════════════════════════════════

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'

export interface Condition {
  field: string
  operator: ConditionOperator
  value?: string | number | boolean
}

// ═══════════════════════════════════════════════════════════
// ACTION TYPES
// ═══════════════════════════════════════════════════════════

export type ActionType =
  | 'send_email'
  | 'add_to_list'
  | 'remove_from_list'
  | 'add_tag'
  | 'remove_tag'
  | 'wait'
  | 'webhook'

export interface BaseAction {
  type: ActionType
}

export interface SendEmailAction extends BaseAction {
  type: 'send_email'
  emailTemplate: string // Template ID
}

export interface AddToListAction extends BaseAction {
  type: 'add_to_list'
  list: string // List ID
}

export interface RemoveFromListAction extends BaseAction {
  type: 'remove_from_list'
  list: string // List ID
}

export interface AddTagAction extends BaseAction {
  type: 'add_tag'
  tagName: string
}

export interface RemoveTagAction extends BaseAction {
  type: 'remove_tag'
  tagName: string
}

export interface WaitAction extends BaseAction {
  type: 'wait'
  waitDuration: {
    value: number
    unit: 'minutes' | 'hours' | 'days' | 'weeks'
  }
}

export interface WebhookAction extends BaseAction {
  type: 'webhook'
  webhookUrl: string
  webhookMethod: 'GET' | 'POST' | 'PUT' | 'PATCH'
}

export type Action =
  | SendEmailAction
  | AddToListAction
  | RemoveFromListAction
  | AddTagAction
  | RemoveTagAction
  | WaitAction
  | WebhookAction

// ═══════════════════════════════════════════════════════════
// AUTOMATION RULE TYPE
// ═══════════════════════════════════════════════════════════

export interface AutomationRule {
  id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'paused'
  trigger: {
    eventType: EventType
    customEventName?: string
  }
  conditions?: Condition[]
  actions: Action[]
  timing?: {
    delayEnabled: boolean
    delay?: {
      value: number
      unit: 'minutes' | 'hours' | 'days' | 'weeks'
    }
    maxExecutions?: number
  }
  stats: {
    timesTriggered: number
    timesSucceeded: number
    timesFailed: number
    lastTriggered?: Date
    lastError?: string
  }
  tenant: string
  createdAt: Date
  updatedAt: Date
}

// ═══════════════════════════════════════════════════════════
// EXECUTION CONTEXT
// ═══════════════════════════════════════════════════════════

export interface AutomationExecutionContext {
  ruleId: string
  eventPayload: EventPayload
  matchedConditions: boolean
  actions: Action[]
  delay?: number // milliseconds
  attemptCount: number
  maxAttempts: number
  createdAt: Date
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get event metadata by type
 */
export function getEventMetadata(eventType: EventType): EventMetadata {
  return EVENT_DEFINITIONS[eventType]
}

/**
 * Get all events by category
 */
export function getEventsByCategory(category: EventCategory): EventMetadata[] {
  return Object.values(EVENT_DEFINITIONS).filter((event) => event.category === category)
}

/**
 * Check if event type is valid
 */
export function isValidEventType(type: string): type is EventType {
  return type in EVENT_DEFINITIONS
}

/**
 * Convert delay to milliseconds
 */
export function delayToMilliseconds(value: number, unit: 'minutes' | 'hours' | 'days' | 'weeks'): number {
  const conversions = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
  }
  return value * conversions[unit]
}
