/**
 * Automation Worker
 *
 * BullMQ worker that executes automation rule actions
 */

import { Worker, Job, WorkerOptions } from 'bullmq'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redis } from '../redis'
import { baseWorkerConfig } from '../config'
import { updateRuleStats } from '@/features/email-marketing/lib/automation/engine'
import type {
  AutomationExecutionContext,
  Action,
  SendEmailAction,
  AddToListAction,
  RemoveFromListAction,
  AddTagAction,
  RemoveTagAction,
  WaitAction,
  WebhookAction,
} from '@/features/email-marketing/lib/automation/types'
import { ListmonkClient } from '@/features/email-marketing/lib/listmonk/client'

const listmonkClient = new ListmonkClient()

// ═══════════════════════════════════════════════════════════
// WORKER DEFINITION
// ═══════════════════════════════════════════════════════════

export const automationWorker = new Worker(
  'email-automation',
  async (job: Job<AutomationExecutionContext>) => {
    const context = job.data

    console.log(`[Automation Worker] Processing automation execution for rule: ${context.ruleId}`)
    console.log(`[Automation Worker] Event: ${context.eventPayload.eventType}`)
    console.log(`[Automation Worker] Actions: ${context.actions.length}`)

    try {
      // Execute all actions sequentially
      for (let i = 0; i < context.actions.length; i++) {
        const action = context.actions[i]
        console.log(`[Automation Worker] Executing action ${i + 1}/${context.actions.length}: ${action.type}`)

        await executeAction(action, context)
      }

      // Update success stats
      await updateRuleStats(context.ruleId, { succeeded: true })

      console.log(`[Automation Worker] Completed automation execution for rule: ${context.ruleId}`)

      return {
        success: true,
        ruleId: context.ruleId,
        actionsExecuted: context.actions.length,
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`[Automation Worker] Error executing automation:`, error)

      // Update failure stats
      await updateRuleStats(context.ruleId, {
        failed: true,
        error: message,
      })

      throw error // Re-throw for BullMQ retry logic
    }
  },
  {
    ...baseWorkerConfig,
    concurrency: 5, // Process 5 automations concurrently
  } as WorkerOptions
)

// ═══════════════════════════════════════════════════════════
// ACTION EXECUTION
// ═══════════════════════════════════════════════════════════

/**
 * Execute a single automation action
 */
async function executeAction(
  action: Action,
  context: AutomationExecutionContext
): Promise<void> {
  switch (action.type) {
    case 'send_email':
      await executeSendEmail(action as SendEmailAction, context)
      break

    case 'add_to_list':
      await executeAddToList(action as AddToListAction, context)
      break

    case 'remove_from_list':
      await executeRemoveFromList(action as RemoveFromListAction, context)
      break

    case 'add_tag':
      await executeAddTag(action as AddTagAction, context)
      break

    case 'remove_tag':
      await executeRemoveTag(action as RemoveTagAction, context)
      break

    case 'wait':
      await executeWait(action as WaitAction, context)
      break

    case 'webhook':
      await executeWebhook(action as WebhookAction, context)
      break

    default:
      console.warn(`[Automation Worker] Unknown action type: ${(action as any).type}`)
  }
}

// ═══════════════════════════════════════════════════════════
// ACTION HANDLERS
// ═══════════════════════════════════════════════════════════

/**
 * Send Email Action
 */
async function executeSendEmail(
  action: SendEmailAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Sending email template: ${action.emailTemplate}`)

  try {
    const payload = await getPayload({ config })

    // Get email template
    const template = await payload.findByID({
      collection: 'email-templates',
      id: action.emailTemplate,
    })

    if (!template) {
      throw new Error(`Email template not found: ${action.emailTemplate}`)
    }

    // Get recipient email from event payload
    const recipientEmail = getRecipientEmail(context)

    if (!recipientEmail) {
      throw new Error('No recipient email found in event payload')
    }

    // Find or create subscriber
    let subscriber = await findSubscriberByEmail(recipientEmail, context.eventPayload.tenantId)

    if (!subscriber) {
      console.log(`[Automation Worker] Subscriber not found, creating: ${recipientEmail}`)
      subscriber = await createSubscriber(recipientEmail, context.eventPayload.tenantId)
    }

    // Send via Listmonk (transactional email)
    if (!subscriber.listmonkId || !template.listmonkId) {
      throw new Error('Subscriber or template not synced to Listmonk')
    }

    await listmonkClient.sendTransactional({
      subscriber_id: subscriber.listmonkId,
      template_id: template.listmonkId,
      data: context.eventPayload.metadata || {},
    })

    console.log(`[Automation Worker] Email sent successfully to: ${recipientEmail}`)
  } catch (error) {
    console.error('[Automation Worker] Error sending email:', error)
    throw error
  }
}

/**
 * Add to List Action
 */
async function executeAddToList(
  action: AddToListAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Adding subscriber to list: ${action.list}`)

  try {
    const recipientEmail = getRecipientEmail(context)

    if (!recipientEmail) {
      throw new Error('No recipient email found in event payload')
    }

    // Find subscriber
    const subscriber = await findSubscriberByEmail(recipientEmail, context.eventPayload.tenantId)

    if (!subscriber) {
      throw new Error(`Subscriber not found: ${recipientEmail}`)
    }

    // Get list details
    const payload = await getPayload({ config })
    const list = await payload.findByID({
      collection: 'email-lists',
      id: action.list,
    })

    if (!list || !list.listmonkId) {
      throw new Error(`List not found or not synced: ${action.list}`)
    }

    // Add subscriber to list via Listmonk
    await listmonkClient.addSubscriberToLists(subscriber.listmonkId, [list.listmonkId])

    console.log(`[Automation Worker] Added ${recipientEmail} to list: ${list.name}`)
  } catch (error) {
    console.error('[Automation Worker] Error adding to list:', error)
    throw error
  }
}

/**
 * Remove from List Action
 */
async function executeRemoveFromList(
  action: RemoveFromListAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Removing subscriber from list: ${action.list}`)

  try {
    const recipientEmail = getRecipientEmail(context)

    if (!recipientEmail) {
      throw new Error('No recipient email found in event payload')
    }

    const subscriber = await findSubscriberByEmail(recipientEmail, context.eventPayload.tenantId)

    if (!subscriber) {
      console.log(`[Automation Worker] Subscriber not found, skipping remove: ${recipientEmail}`)
      return
    }

    const payload = await getPayload({ config })
    const list = await payload.findByID({
      collection: 'email-lists',
      id: action.list,
    })

    if (!list || !list.listmonkId) {
      throw new Error(`List not found or not synced: ${action.list}`)
    }

    // Remove subscriber from list via Listmonk
    await listmonkClient.removeSubscriberFromLists(subscriber.listmonkId, [list.listmonkId])

    console.log(`[Automation Worker] Removed ${recipientEmail} from list: ${list.name}`)
  } catch (error) {
    console.error('[Automation Worker] Error removing from list:', error)
    throw error
  }
}

/**
 * Add Tag Action
 */
async function executeAddTag(
  action: AddTagAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Adding tag: ${action.tagName}`)

  try {
    const recipientEmail = getRecipientEmail(context)

    if (!recipientEmail) {
      throw new Error('No recipient email found in event payload')
    }

    const subscriber = await findSubscriberByEmail(recipientEmail, context.eventPayload.tenantId)

    if (!subscriber) {
      throw new Error(`Subscriber not found: ${recipientEmail}`)
    }

    // Update subscriber attributes (add tag)
    const currentTags = subscriber.attributes?.tags || []
    const updatedTags = [...new Set([...currentTags, action.tagName])]

    await listmonkClient.updateSubscriber(subscriber.listmonkId, {
      attribs: {
        ...subscriber.attributes,
        tags: updatedTags,
      },
    })

    console.log(`[Automation Worker] Added tag "${action.tagName}" to ${recipientEmail}`)
  } catch (error) {
    console.error('[Automation Worker] Error adding tag:', error)
    throw error
  }
}

/**
 * Remove Tag Action
 */
async function executeRemoveTag(
  action: RemoveTagAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Removing tag: ${action.tagName}`)

  try {
    const recipientEmail = getRecipientEmail(context)

    if (!recipientEmail) {
      throw new Error('No recipient email found in event payload')
    }

    const subscriber = await findSubscriberByEmail(recipientEmail, context.eventPayload.tenantId)

    if (!subscriber) {
      console.log(`[Automation Worker] Subscriber not found, skipping tag removal: ${recipientEmail}`)
      return
    }

    // Update subscriber attributes (remove tag)
    const currentTags = subscriber.attributes?.tags || []
    const updatedTags = currentTags.filter((tag: string) => tag !== action.tagName)

    await listmonkClient.updateSubscriber(subscriber.listmonkId, {
      attribs: {
        ...subscriber.attributes,
        tags: updatedTags,
      },
    })

    console.log(`[Automation Worker] Removed tag "${action.tagName}" from ${recipientEmail}`)
  } catch (error) {
    console.error('[Automation Worker] Error removing tag:', error)
    throw error
  }
}

/**
 * Wait Action (used within action chains)
 */
async function executeWait(
  action: WaitAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Wait action: ${action.waitDuration.value} ${action.waitDuration.unit}`)

  // Wait actions are handled by delays in job scheduling
  // This is a no-op during execution, but could log analytics
  console.log('[Automation Worker] Wait action acknowledged (handled by job scheduler)')
}

/**
 * Webhook Action
 */
async function executeWebhook(
  action: WebhookAction,
  context: AutomationExecutionContext
): Promise<void> {
  console.log(`[Automation Worker] Calling webhook: ${action.webhookMethod} ${action.webhookUrl}`)

  try {
    const response = await fetch(action.webhookUrl, {
      method: action.webhookMethod,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Payload-Automation/1.0',
      },
      body: action.webhookMethod !== 'GET' ? JSON.stringify({
        event: context.eventPayload,
        ruleId: context.ruleId,
        timestamp: new Date().toISOString(),
      }) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`)
    }

    console.log(`[Automation Worker] Webhook called successfully: ${response.status}`)
  } catch (error) {
    console.error('[Automation Worker] Error calling webhook:', error)
    throw error
  }
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get recipient email from event payload
 */
function getRecipientEmail(context: AutomationExecutionContext): string | null {
  const payload = context.eventPayload

  if ('email' in payload) {
    return payload.email
  }

  return null
}

/**
 * Find subscriber by email
 */
async function findSubscriberByEmail(email: string, tenantId: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'email-subscribers',
      where: {
        and: [
          {
            email: {
              equals: email,
            },
          },
          {
            tenant: {
              equals: tenantId,
            },
          },
        ],
      },
      limit: 1,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('[Automation Worker] Error finding subscriber:', error)
    return null
  }
}

/**
 * Create new subscriber
 */
async function createSubscriber(email: string, tenantId: string): Promise<any> {
  const payload = await getPayload({ config })

  const subscriber = await payload.create({
    collection: 'email-subscribers',
    data: {
      email,
      status: 'enabled',
      tenant: tenantId as any,
      syncStatus: 'pending',
    } as any,
  })

  return subscriber
}

// ═══════════════════════════════════════════════════════════
// WORKER LIFECYCLE
// ═══════════════════════════════════════════════════════════

automationWorker.on('completed', (job) => {
  console.log(`[Automation Worker] Job completed: ${job.id}`)
})

automationWorker.on('failed', (job, error) => {
  console.error(`[Automation Worker] Job failed: ${job?.id}`, error)
})

automationWorker.on('error', (error) => {
  console.error('[Automation Worker] Worker error:', error)
})

console.log('✅ Automation Worker registered')
