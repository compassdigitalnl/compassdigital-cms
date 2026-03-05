/**
 * Email Marketing Test Helpers
 *
 * Utility functions for testing email marketing features
 *
 * @see docs/mail-engine/MASTER_IMPLEMENTATIEPLAN_v1.md
 */

import type {
  ListmonkSubscriber,
  ListmonkList,
  ListmonkCampaign,
  ListmonkTemplate,
} from '@/features/email-marketing/types/listmonk'
import type {
  SendCampaignJob,
  SendTransactionalJob,
  ProcessAutomationJob,
  FlowStepJob,
} from '@/features/email-marketing/types/email-marketing'

// ═══════════════════════════════════════════════════════════
// FACTORY FUNCTIONS - Create Test Data
// ═══════════════════════════════════════════════════════════

/**
 * Create a test subscriber
 */
export function createTestSubscriber(
  overrides?: Partial<ListmonkSubscriber>,
): ListmonkSubscriber {
  return {
    id: 1,
    uuid: 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    email: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
    name: 'Test User',
    status: 'enabled',
    lists: [1],
    attribs: {
      tenant_id: 'test-tenant',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a test list
 */
export function createTestList(overrides?: Partial<ListmonkList>): ListmonkList {
  return {
    id: 1,
    uuid: 'list-uuid-' + Math.random().toString(36).substr(2, 9),
    name: 'Test List',
    type: 'public',
    optin: 'single',
    tags: ['test'],
    description: 'Test list description',
    subscriber_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a test campaign
 */
export function createTestCampaign(overrides?: Partial<ListmonkCampaign>): ListmonkCampaign {
  return {
    id: 1,
    uuid: 'campaign-uuid-' + Math.random().toString(36).substr(2, 9),
    name: 'Test Campaign',
    subject: 'Test Subject',
    from_email: 'test@example.com',
    body: '<p>Test email body</p>',
    content_type: 'html',
    status: 'draft',
    lists: [1],
    type: 'regular',
    tags: ['test'],
    sent: 0,
    views: 0,
    clicks: 0,
    bounces: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a test template
 */
export function createTestTemplate(overrides?: Partial<ListmonkTemplate>): ListmonkTemplate {
  return {
    id: 1,
    name: 'Test Template',
    type: 0, // 0 = campaign
    subject: 'Test Template Subject',
    body: '<p>{{ .Subscriber.FirstName }}, this is a test template</p>',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a test SendCampaignJob
 */
export function createTestCampaignJob(overrides?: Partial<SendCampaignJob>): SendCampaignJob {
  return {
    type: 'send-campaign',
    campaignId: 'campaign-id-' + Math.random().toString(36).substr(2, 9),
    tenantId: 'test-tenant',
    priority: 5,
    ...overrides,
  }
}

/**
 * Create a test SendTransactionalJob
 */
export function createTestTransactionalJob(
  overrides?: Partial<SendTransactionalJob>,
): SendTransactionalJob {
  return {
    type: 'send-transactional',
    templateId: 'template-id-' + Math.random().toString(36).substr(2, 9),
    recipientEmail: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
    recipientName: 'Test Recipient',
    variables: {
      name: 'Test User',
      orderNumber: '12345',
    },
    tenantId: 'test-tenant',
    triggeredBy: 'order.placed',
    priority: 10,
    ...overrides,
  }
}

/**
 * Create a test ProcessAutomationJob
 */
export function createTestAutomationJob(
  overrides?: Partial<ProcessAutomationJob>,
): ProcessAutomationJob {
  return {
    type: 'process-automation',
    ruleId: 'rule-id-' + Math.random().toString(36).substr(2, 9),
    eventType: 'subscriber.created',
    eventPayload: {
      eventType: 'subscriber.created',
      timestamp: new Date(),
      subscriberEmail: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
    },
    tenantId: 'test-tenant',
    ...overrides,
  }
}

/**
 * Create a test FlowStepJob
 */
export function createTestFlowStepJob(overrides?: Partial<FlowStepJob>): FlowStepJob {
  return {
    type: 'flow-step',
    flowId: 'flow-id-' + Math.random().toString(36).substr(2, 9),
    stepIndex: 0,
    subscriberId: 'subscriber-id-' + Math.random().toString(36).substr(2, 9),
    tenantId: 'test-tenant',
    context: {
      flowStartedAt: new Date().toISOString(),
    },
    ...overrides,
  }
}

// ═══════════════════════════════════════════════════════════
// ASSERTION HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Assert that an email address is valid
 */
export function assertValidEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email address: ${email}`)
  }
}

/**
 * Assert that a subscriber has required fields
 */
export function assertValidSubscriber(subscriber: Partial<ListmonkSubscriber>): void {
  if (!subscriber.email) {
    throw new Error('Subscriber must have an email')
  }
  if (!subscriber.name) {
    throw new Error('Subscriber must have a name')
  }
  if (!subscriber.status) {
    throw new Error('Subscriber must have a status')
  }
  assertValidEmail(subscriber.email)
}

/**
 * Assert that a campaign has required fields
 */
export function assertValidCampaign(campaign: Partial<ListmonkCampaign>): void {
  if (!campaign.name) {
    throw new Error('Campaign must have a name')
  }
  if (!campaign.subject) {
    throw new Error('Campaign must have a subject')
  }
  if (!campaign.body) {
    throw new Error('Campaign must have a body')
  }
  if (!campaign.lists || campaign.lists.length === 0) {
    throw new Error('Campaign must have at least one list')
  }
}

// ═══════════════════════════════════════════════════════════
// WAIT HELPERS (for async operations)
// ═══════════════════════════════════════════════════════════

/**
 * Wait for a job to complete (poll until condition is met)
 */
export async function waitForJobCompletion(
  checkFn: () => Promise<boolean>,
  timeout = 5000,
  interval = 100,
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await checkFn()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error(`Job did not complete within ${timeout}ms`)
}

/**
 * Wait for email to be sent (check sent status)
 */
export async function waitForEmailSent(
  getCampaignFn: () => Promise<ListmonkCampaign>,
  timeout = 5000,
): Promise<void> {
  await waitForJobCompletion(async () => {
    const campaign = await getCampaignFn()
    return campaign.status === 'finished'
  }, timeout)
}

// ═══════════════════════════════════════════════════════════
// CLEANUP HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Clean up test subscribers (for use in afterEach hooks)
 */
export async function cleanupTestSubscribers(subscriberIds: number[]): Promise<void> {
  // Implementation will call Listmonk API to delete subscribers
  // This is a placeholder - actual implementation in tests
  console.log(`Cleaning up ${subscriberIds.length} test subscribers`)
}

/**
 * Clean up test campaigns
 */
export async function cleanupTestCampaigns(campaignIds: number[]): Promise<void> {
  console.log(`Cleaning up ${campaignIds.length} test campaigns`)
}

/**
 * Clean up test lists
 */
export async function cleanupTestLists(listIds: number[]): Promise<void> {
  console.log(`Cleaning up ${listIds.length} test lists`)
}

// ═══════════════════════════════════════════════════════════
// FEATURE FLAG HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Check if email marketing features are enabled
 */
export function isEmailMarketingEnabled(): boolean {
  return process.env.ENABLE_EMAIL_MARKETING === 'true'
}

/**
 * Skip test if email marketing is disabled
 */
export function skipIfEmailMarketingDisabled(): void {
  if (!isEmailMarketingEnabled()) {
    console.log('Skipping test: ENABLE_EMAIL_MARKETING is not set to "true"')
    // Note: In actual tests, use test.skip() or it.skip()
  }
}

/**
 * Check if specific email feature is enabled
 */
export function isEmailFeatureEnabled(feature: string): boolean {
  const envVar = `ENABLE_EMAIL_${feature.toUpperCase()}`
  return process.env[envVar] === 'true'
}
