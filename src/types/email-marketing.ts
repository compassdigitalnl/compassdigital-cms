/**
 * Email Marketing Engine Types
 *
 * Central TypeScript type definitions for email marketing features
 * Including BullMQ jobs, automation engine, GrapesJS editor, and deliverability
 *
 * @see docs/mail-engine/MASTER_IMPLEMENTATIEPLAN_v1.md
 */

import type { ListmonkCampaign, ListmonkSubscriber } from './listmonk'

// ═══════════════════════════════════════════════════════════
// BULLMQ JOB TYPES
// ═══════════════════════════════════════════════════════════

/**
 * Send campaign job
 * Queued when admin schedules/sends a campaign
 */
export interface SendCampaignJob {
  type: 'send-campaign'
  campaignId: string // Payload EmailCampaign ID
  listmonkCampaignId?: number // Listmonk campaign ID (if already created)
  tenantId: string
  scheduledAt?: Date
  priority?: number
}

/**
 * Send transactional email job
 * Triggered by events (welcome email, order confirmation, etc.)
 */
export interface SendTransactionalJob {
  type: 'send-transactional'
  templateId: string // Payload EmailTemplate ID
  recipientEmail: string
  recipientName: string
  variables: Record<string, any> // Template variables (e.g., {{name}}, {{orderNumber}})
  tenantId: string
  triggeredBy?: string // Event that triggered this (e.g., 'user.registered')
  priority?: number
}

/**
 * Process automation rule job
 * Evaluates conditions and triggers actions
 */
export interface ProcessAutomationJob {
  type: 'process-automation'
  ruleId: string // Payload EmailAutomationRule ID
  eventType: TriggerType
  eventPayload: EventPayload
  tenantId: string
  subscriberId?: string // Payload EmailSubscriber ID
}

/**
 * Flow step execution job
 * Executes a single step in an email flow (sequence)
 */
export interface FlowStepJob {
  type: 'flow-step'
  flowId: string // Payload EmailFlow ID
  stepIndex: number // Which step (0-based)
  subscriberId: string // Payload EmailSubscriber ID
  tenantId: string
  context: Record<string, any> // Flow context data
}

/**
 * Sync analytics job
 * Periodic job to sync Listmonk analytics to Payload
 */
export interface SyncAnalyticsJob {
  type: 'sync-analytics'
  campaignId?: string // If syncing specific campaign
  tenantId: string
  syncType: 'campaign' | 'subscriber' | 'all'
}

/**
 * Warmup sender job
 * Gradually increases send volume for new IPs/domains
 */
export interface WarmupSenderJob {
  type: 'warmup-sender'
  tenantId: string
  day: number // Day of warmup schedule (1-30)
  maxEmails: number // Max emails to send today
}

/**
 * Union type of all email job types
 */
export type EmailJob =
  | SendCampaignJob
  | SendTransactionalJob
  | ProcessAutomationJob
  | FlowStepJob
  | SyncAnalyticsJob
  | WarmupSenderJob

// ═══════════════════════════════════════════════════════════
// AUTOMATION ENGINE TYPES
// ═══════════════════════════════════════════════════════════

/**
 * Available trigger types for automation rules
 */
export type TriggerType =
  | 'subscriber.created' // New subscriber added
  | 'subscriber.subscribed' // Subscriber confirmed opt-in
  | 'subscriber.unsubscribed' // Subscriber unsubscribed
  | 'subscriber.updated' // Subscriber data changed
  | 'campaign.sent' // Campaign sent to subscriber
  | 'campaign.opened' // Subscriber opened email
  | 'campaign.clicked' // Subscriber clicked link
  | 'campaign.bounced' // Email bounced
  | 'user.registered' // User registered on site (Payload Users collection)
  | 'order.placed' // Order placed (e-commerce)
  | 'order.shipped' // Order shipped
  | 'cart.abandoned' // Shopping cart abandoned
  | 'product.purchased' // Specific product purchased
  | 'custom' // Custom webhook event

/**
 * Event payload structure
 * Contains data about the event that triggered automation
 */
export interface EventPayload {
  eventType: TriggerType
  timestamp: Date
  subscriberId?: string // Payload EmailSubscriber ID
  subscriberEmail?: string
  campaignId?: string // Payload EmailCampaign ID
  userId?: string // Payload Users ID
  orderId?: string // Order ID (if applicable)
  productId?: string // Product ID (if applicable)
  metadata?: Record<string, any> // Additional event data
}

/**
 * Automation rule condition
 * Determines if action should be triggered
 */
export interface AutomationCondition {
  field: string // Field to check (e.g., 'subscriber.tags', 'event.metadata.orderTotal')
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any // Value to compare against
  logicalOperator?: 'AND' | 'OR' // For multiple conditions
}

/**
 * Automation rule action
 * What to do when conditions are met
 */
export interface AutomationAction {
  type: 'send_email' | 'add_to_list' | 'remove_from_list' | 'add_tag' | 'remove_tag' | 'update_attribute' | 'trigger_webhook'

  // For send_email
  templateId?: string // Payload EmailTemplate ID
  delay?: number // Delay in minutes before sending

  // For list operations
  listId?: string // Payload EmailList ID

  // For tag operations
  tag?: string

  // For attribute updates
  attributeName?: string
  attributeValue?: any

  // For webhook triggers
  webhookUrl?: string
  webhookPayload?: Record<string, any>
}

/**
 * Condition evaluation result
 */
export interface ConditionEvaluationResult {
  passed: boolean
  evaluatedConditions: Array<{
    condition: AutomationCondition
    result: boolean
    actualValue: any
  }>
  failureReason?: string
}

/**
 * Automation execution context
 * Tracks execution state
 */
export interface AutomationExecutionContext {
  ruleId: string
  eventPayload: EventPayload
  conditionResult: ConditionEvaluationResult
  actionsExecuted: Array<{
    action: AutomationAction
    success: boolean
    error?: string
    executedAt: Date
  }>
  startedAt: Date
  completedAt?: Date
  status: 'pending' | 'running' | 'completed' | 'failed'
}

// ═══════════════════════════════════════════════════════════
// GRAPESJS EDITOR TYPES
// ═══════════════════════════════════════════════════════════

/**
 * GrapesJS component definition
 */
export interface GrapesComponent {
  tagName?: string
  type?: string
  content?: string
  classes?: string[]
  attributes?: Record<string, any>
  style?: Record<string, string>
  components?: GrapesComponent[]
  traits?: Array<{
    type: string
    label: string
    name: string
    value?: any
  }>
}

/**
 * GrapesJS style definition
 */
export interface GrapesStyle {
  selectors: string[]
  style: Record<string, string>
  mediaText?: string // For responsive styles
  atRuleType?: string
}

/**
 * GrapesJS project data
 * Saved/loaded from database
 */
export interface GrapesProjectData {
  pages: Array<{
    id: string
    name?: string
    component?: string // HTML string
    style?: string // CSS string
    frames: Array<{
      component: GrapesComponent
      id: string
    }>
  }>
  styles: GrapesStyle[]
  assets: Array<{
    type: 'image' | 'video' | 'svg'
    src: string
    name?: string
    height?: number
    width?: number
  }>
}

/**
 * GrapesJS editor configuration
 */
export interface GrapesEditorConfig {
  container: string | HTMLElement
  height?: string
  width?: string
  storageManager?: {
    type: 'local' | 'remote'
    autosave: boolean
    autoload: boolean
    stepsBeforeSave?: number
  }
  deviceManager?: {
    devices: Array<{
      id: string
      name: string
      width: string
      widthMedia?: string
    }>
  }
  plugins?: string[]
  pluginsOpts?: Record<string, any>
  canvas?: {
    styles?: string[]
    scripts?: string[]
  }
}

/**
 * GrapesJS block definition
 * Custom email blocks (header, footer, CTA, etc.)
 */
export interface GrapesBlock {
  id: string
  label: string
  category?: string
  content: string | GrapesComponent
  media?: string // SVG icon
  activate?: boolean
  select?: boolean
  attributes?: Record<string, any>
}

/**
 * Email template variables
 * Replaced at send time (e.g., {{name}}, {{company}})
 */
export interface TemplateVariable {
  key: string // Variable name (e.g., 'firstName')
  label: string // Human-readable label
  defaultValue?: string
  required?: boolean
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image'
  description?: string
}

// ═══════════════════════════════════════════════════════════
// DELIVERABILITY TYPES
// ═══════════════════════════════════════════════════════════

/**
 * DNS record for email authentication
 */
export interface DNSRecord {
  type: 'SPF' | 'DKIM' | 'DMARC' | 'MX' | 'TXT'
  name: string // Domain or subdomain
  value: string // DNS record value
  priority?: number // For MX records
  ttl?: number
  status?: 'pending' | 'verified' | 'failed'
  verifiedAt?: Date
  lastChecked?: Date
  errorMessage?: string
}

/**
 * DNS verification result
 */
export interface DNSVerificationResult {
  domain: string
  records: Array<{
    record: DNSRecord
    found: boolean
    expectedValue: string
    actualValue?: string
    isValid: boolean
    errorMessage?: string
  }>
  overallStatus: 'valid' | 'invalid' | 'partial'
  score: number // 0-100
  recommendations: string[]
  checkedAt: Date
}

/**
 * Warmup schedule configuration
 * Gradually increases send volume for new IPs/domains
 */
export interface WarmupSchedule {
  id: string
  tenantId: string
  domain: string
  ipAddress?: string
  status: 'active' | 'paused' | 'completed' | 'failed'
  startDate: Date
  currentDay: number // 1-30
  targetDailyVolume: number // Final target (e.g., 50000 emails/day)

  // Daily progression
  schedule: Array<{
    day: number
    maxEmails: number
    actualSent?: number
    bouncesAllowed: number
    complaintsAllowed: number
    openRateTarget: number // Percentage
  }>

  // Metrics
  totalEmailsSent: number
  averageOpenRate: number
  averageBounceRate: number
  averageComplaintRate: number

  // Configuration
  increasePercentage: number // Daily increase (e.g., 20%)
  pauseOnHighBounces: boolean
  pauseThreshold: number // Bounce rate threshold (e.g., 5%)

  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

/**
 * Sender reputation metrics
 */
export interface ReputationMetrics {
  domain: string
  ipAddress?: string
  tenantId: string

  // Sending metrics (last 30 days)
  emailsSent: number
  emailsDelivered: number
  emailsBounced: number
  emailsOpened: number
  emailsClicked: number
  spamComplaints: number
  unsubscribes: number

  // Calculated rates
  deliveryRate: number // Percentage
  bounceRate: number // Percentage
  openRate: number // Percentage
  clickRate: number // Percentage
  complaintRate: number // Percentage
  unsubscribeRate: number // Percentage

  // Reputation score (0-100)
  reputationScore: number
  scoreBreakdown: {
    deliverability: number // Weight: 40%
    engagement: number // Weight: 30%
    complaints: number // Weight: 20%
    bounces: number // Weight: 10%
  }

  // External reputation checks
  blacklists: Array<{
    name: string // DNSBL name (e.g., 'spamhaus.org')
    listed: boolean
    checkedAt: Date
    delistUrl?: string
  }>

  // Trends
  trend: 'improving' | 'stable' | 'declining'
  previousScore?: number
  scoreChange?: number

  // Warnings
  warnings: Array<{
    type: 'high_bounce_rate' | 'high_complaint_rate' | 'low_engagement' | 'blacklisted'
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    actionRequired?: string
  }>

  lastUpdated: Date
}

/**
 * Email deliverability health check
 */
export interface DeliverabilityHealthCheck {
  tenantId: string
  domain: string

  // DNS checks
  dnsVerification: DNSVerificationResult

  // Reputation
  reputation: ReputationMetrics

  // Warmup status
  warmupStatus?: {
    isActive: boolean
    currentDay: number
    totalDays: number
    progressPercentage: number
  }

  // Overall health
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  healthScore: number // 0-100

  // Recommendations
  criticalIssues: string[]
  recommendations: string[]

  // Next steps
  nextActions: Array<{
    priority: 'high' | 'medium' | 'low'
    action: string
    estimatedImpact: string
  }>

  checkedAt: Date
}

// ═══════════════════════════════════════════════════════════
// FLOW EXECUTION TYPES
// ═══════════════════════════════════════════════════════════

/**
 * Flow step type
 */
export type FlowStepType =
  | 'send_email' // Send an email
  | 'wait' // Wait for X days/hours
  | 'condition' // Branch based on condition
  | 'add_tag' // Add tag to subscriber
  | 'remove_tag' // Remove tag
  | 'add_to_list' // Add to list
  | 'remove_from_list' // Remove from list
  | 'end' // End flow

/**
 * Flow step definition
 */
export interface FlowStep {
  id: string
  type: FlowStepType
  name: string

  // For send_email
  templateId?: string

  // For wait
  waitDuration?: number // In minutes
  waitUnit?: 'minutes' | 'hours' | 'days'

  // For condition
  condition?: AutomationCondition
  onTrue?: string // Next step ID if condition true
  onFalse?: string // Next step ID if condition false

  // For tag/list operations
  tag?: string
  listId?: string

  // Next step (for linear flows)
  nextStepId?: string

  // Position (for visual editor)
  position?: { x: number; y: number }
}

/**
 * Flow subscriber state
 * Tracks where subscriber is in a flow
 */
export interface FlowSubscriberState {
  flowId: string
  subscriberId: string
  tenantId: string

  currentStepId: string
  currentStepIndex: number

  status: 'active' | 'paused' | 'completed' | 'exited'

  // Execution history
  stepsCompleted: Array<{
    stepId: string
    stepType: FlowStepType
    completedAt: Date
    success: boolean
    error?: string
    metadata?: Record<string, any>
  }>

  // Next execution
  nextStepScheduledAt?: Date

  // Context data (carried through flow)
  context: Record<string, any>

  // Timing
  startedAt: Date
  completedAt?: Date
  pausedAt?: Date
  exitedAt?: Date

  // Exit reason
  exitReason?: 'completed' | 'unsubscribed' | 'bounced' | 'manual' | 'error'
}

// ═══════════════════════════════════════════════════════════
// ANALYTICS & REPORTING TYPES
// ═══════════════════════════════════════════════════════════

/**
 * Campaign analytics summary
 */
export interface CampaignAnalytics {
  campaignId: string
  tenantId: string

  // Send stats
  totalRecipients: number
  emailsSent: number
  emailsDelivered: number
  emailsBounced: number
  emailsFailed: number

  // Engagement stats
  uniqueOpens: number
  totalOpens: number
  uniqueClicks: number
  totalClicks: number

  // Negative actions
  spamComplaints: number
  unsubscribes: number

  // Calculated rates
  deliveryRate: number
  bounceRate: number
  openRate: number
  clickRate: number
  clickToOpenRate: number // (Clicks / Opens) * 100
  complaintRate: number
  unsubscribeRate: number

  // Revenue (if tracked)
  revenue?: number
  conversions?: number
  conversionRate?: number

  // Links clicked
  topLinks?: Array<{
    url: string
    clicks: number
    uniqueClicks: number
  }>

  // Timeline
  sentAt?: Date
  lastOpenedAt?: Date
  lastClickedAt?: Date

  // Updated
  lastSyncedAt: Date
}

/**
 * Subscriber analytics
 */
export interface SubscriberAnalytics {
  subscriberId: string
  tenantId: string

  // Engagement
  totalCampaignsReceived: number
  totalOpens: number
  totalClicks: number
  lastOpenedAt?: Date
  lastClickedAt?: Date

  // Engagement score (0-100)
  engagementScore: number
  engagementLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low' | 'inactive'

  // Behavior
  averageOpenRate: number
  averageClickRate: number
  preferredSendTime?: string // "14:00" (24h format)
  preferredSendDay?: string // "Tuesday"

  // Lists & tags
  totalLists: number
  totalTags: number

  // Activity
  lastActivityAt?: Date
  daysSinceLastActivity?: number

  // Status
  isActive: boolean
  bounces: number
  complaints: number

  lastUpdated: Date
}

/**
 * Time-series analytics data point
 */
export interface AnalyticsDataPoint {
  date: Date
  sends: number
  opens: number
  clicks: number
  bounces: number
  complaints: number
  unsubscribes: number
}

/**
 * Analytics report configuration
 */
export interface AnalyticsReport {
  id: string
  name: string
  tenantId: string

  reportType: 'campaign' | 'subscriber' | 'list' | 'overall'

  // Filters
  dateRange: {
    start: Date
    end: Date
  }
  campaignIds?: string[]
  listIds?: string[]

  // Metrics to include
  metrics: Array<'sends' | 'opens' | 'clicks' | 'bounces' | 'complaints' | 'unsubscribes' | 'revenue'>

  // Grouping
  groupBy?: 'day' | 'week' | 'month' | 'campaign' | 'list'

  // Schedule
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number // 0-6 (Sunday-Saturday)
    dayOfMonth?: number // 1-31
    time: string // "09:00"
    recipients: string[] // Email addresses
  }

  // Last run
  lastGeneratedAt?: Date
  nextScheduledAt?: Date

  createdAt: Date
  updatedAt: Date
}

// ═══════════════════════════════════════════════════════════
// SYNC TYPES
// ═══════════════════════════════════════════════════════════

/**
 * Sync operation record
 * Tracks Payload <-> Listmonk synchronization
 */
export interface SyncOperation {
  id: string
  tenantId: string

  operation: 'create' | 'update' | 'delete'
  resourceType: 'subscriber' | 'list' | 'campaign' | 'template'

  // IDs
  payloadId: string
  listmonkId?: number

  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  direction: 'payload_to_listmonk' | 'listmonk_to_payload' | 'bidirectional'

  // Data
  payloadData?: Record<string, any>
  listmonkData?: Record<string, any>

  // Result
  success: boolean
  error?: string
  errorCode?: string
  retryCount: number
  maxRetries: number

  // Timing
  startedAt: Date
  completedAt?: Date
  nextRetryAt?: Date

  // Metadata
  triggeredBy: 'user' | 'webhook' | 'scheduled' | 'automation'
  metadata?: Record<string, any>
}
