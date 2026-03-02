/**
 * Automation Engine
 *
 * Core engine that processes events and triggers automation rules
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { Queue } from 'bullmq'
import { redisConfig } from '@/lib/queue/redis'
import { evaluateConditions } from './conditions'
import type { EventPayload, AutomationRule, AutomationExecutionContext, EventType, SubscriberEventPayload, EmailEventPayload } from './types'
import { delayToMilliseconds } from './types'
import { enterFlow } from '../flows/executor'

// Type guard to check if event has subscriberId
function hasSubscriberId(event: EventPayload): event is SubscriberEventPayload | EmailEventPayload {
  return 'subscriberId' in event
}

// ═══════════════════════════════════════════════════════════
// EVENT PROCESSING
// ═══════════════════════════════════════════════════════════

/**
 * Process an incoming event and trigger matching automation rules
 */
export async function processEvent(eventPayload: EventPayload): Promise<{
  success: boolean
  triggeredRules: number
  triggeredFlows: number
  queuedExecutions: number
  errors: string[]
}> {
  const errors: string[] = []
  let triggeredRules = 0
  let triggeredFlows = 0
  let queuedExecutions = 0

  try {
    console.log(`[Automation Engine] Processing event: ${eventPayload.eventType}`, eventPayload)

    // Get Payload instance
    const payload = await getPayload({ config })

    // Find active automation rules for this event type and tenant
    const rules = await findMatchingRules(
      payload,
      eventPayload.eventType,
      eventPayload.tenantId
    )

    console.log(`[Automation Engine] Found ${rules.length} potential automation rules`)

    // Process each rule
    for (const rule of rules) {
      try {
        const result = await processRule(rule, eventPayload)

        if (result.triggered) {
          triggeredRules++
        }

        if (result.queued) {
          queuedExecutions++
        }

        if (result.error) {
          errors.push(`Rule "${rule.name}": ${result.error}`)
        }
      } catch (error: any) {
        console.error(`[Automation Engine] Error processing rule "${rule.name}":`, error)
        errors.push(`Rule "${rule.name}": ${error.message}`)
      }
    }

    // Find and trigger matching flows
    const flows = await findMatchingFlows(
      payload,
      eventPayload.eventType,
      eventPayload.tenantId
    )

    console.log(`[Automation Engine] Found ${flows.length} potential flows`)

    // Process each flow
    for (const flow of flows) {
      try {
        // Only trigger for subscriber events that have a subscriberId
        if (hasSubscriberId(eventPayload)) {
          const result = await enterFlow(
            flow.id,
            eventPayload.subscriberId,
            eventPayload,
            eventPayload.tenantId
          )

          if (result.success) {
            triggeredFlows++
            console.log(`[Automation Engine] Flow "${flow.name}" triggered for subscriber ${eventPayload.subscriberId}`)
          } else if (result.error && !result.error.includes('already in flow') && !result.error.includes('conditions not met')) {
            errors.push(`Flow "${flow.name}": ${result.error}`)
          }
        }
      } catch (error: any) {
        console.error(`[Automation Engine] Error triggering flow "${flow.name}":`, error)
        errors.push(`Flow "${flow.name}": ${error.message}`)
      }
    }

    console.log(
      `[Automation Engine] Completed: ${triggeredRules} rules triggered, ${triggeredFlows} flows triggered, ${queuedExecutions} queued`
    )

    return {
      success: errors.length === 0,
      triggeredRules,
      triggeredFlows,
      queuedExecutions,
      errors,
    }
  } catch (error: any) {
    console.error('[Automation Engine] Fatal error processing event:', error)
    return {
      success: false,
      triggeredRules,
      triggeredFlows,
      queuedExecutions,
      errors: [error.message],
    }
  }
}

// ═══════════════════════════════════════════════════════════
// RULE MATCHING
// ═══════════════════════════════════════════════════════════

/**
 * Find automation rules matching event type and tenant
 */
async function findMatchingRules(
  payload: any,
  eventType: EventType,
  tenantId: string
): Promise<any[]> {
  try {
    const result = await payload.find({
      collection: 'automation-rules',
      where: {
        and: [
          {
            status: {
              equals: 'active',
            },
          },
          {
            'trigger.eventType': {
              equals: eventType,
            },
          },
          {
            tenant: {
              equals: tenantId,
            },
          },
        ],
      },
      limit: 100, // Reasonable limit
    })

    return result.docs || []
  } catch (error) {
    console.error('[Automation Engine] Error finding rules:', error)
    return []
  }
}

/**
 * Find automation flows matching event type and tenant
 */
async function findMatchingFlows(
  payload: any,
  eventType: EventType,
  tenantId: string
): Promise<any[]> {
  try {
    const result = await payload.find({
      collection: 'automation-flows',
      where: {
        and: [
          {
            status: {
              equals: 'active',
            },
          },
          {
            'entry.eventType': {
              equals: eventType,
            },
          },
          {
            tenant: {
              equals: tenantId,
            },
          },
        ],
      },
      limit: 100, // Reasonable limit
    })

    return result.docs || []
  } catch (error) {
    console.error('[Automation Engine] Error finding flows:', error)
    return []
  }
}

// ═══════════════════════════════════════════════════════════
// RULE PROCESSING
// ═══════════════════════════════════════════════════════════

/**
 * Process a single automation rule
 */
async function processRule(
  rule: any,
  eventPayload: EventPayload
): Promise<{
  triggered: boolean
  queued: boolean
  error?: string
}> {
  console.log(`[Automation Engine] Processing rule: ${rule.name}`)

  try {
    // Check conditions
    const conditionsPassed = evaluateConditions(rule.conditions, eventPayload)

    if (!conditionsPassed) {
      console.log(`[Automation Engine] Rule "${rule.name}" conditions not met - skipping`)
      return { triggered: false, queued: false }
    }

    console.log(`[Automation Engine] Rule "${rule.name}" conditions passed!`)

    // Check max executions limit (if set)
    if (rule.timing?.maxExecutions) {
      const executionCount = await getExecutionCount(rule.id, getEventUserIdentifier(eventPayload))

      if (executionCount >= rule.timing.maxExecutions) {
        console.log(
          `[Automation Engine] Rule "${rule.name}" max executions reached (${executionCount}/${rule.timing.maxExecutions}) - skipping`
        )
        return { triggered: false, queued: false }
      }
    }

    // Update stats (triggered)
    await updateRuleStats(rule.id, { triggered: true })

    // Calculate delay
    let delayMs = 0
    if (rule.timing?.delayEnabled && rule.timing.delay) {
      delayMs = delayToMilliseconds(rule.timing.delay.value, rule.timing.delay.unit)
      console.log(`[Automation Engine] Rule "${rule.name}" will execute with ${delayMs}ms delay`)
    }

    // Queue for execution
    const queued = await queueExecution(rule, eventPayload, delayMs)

    return {
      triggered: true,
      queued,
    }
  } catch (error: any) {
    console.error(`[Automation Engine] Error processing rule "${rule.name}":`, error)
    await updateRuleStats(rule.id, { failed: true, error: error.message })
    return {
      triggered: false,
      queued: false,
      error: error.message,
    }
  }
}

// ═══════════════════════════════════════════════════════════
// EXECUTION QUEUEING
// ═══════════════════════════════════════════════════════════

/**
 * Queue automation rule execution via BullMQ
 */
async function queueExecution(
  rule: any,
  eventPayload: EventPayload,
  delayMs: number = 0
): Promise<boolean> {
  try {
    const queue = new Queue('email-automation', { connection: redisConfig })

    const executionContext: AutomationExecutionContext = {
      ruleId: rule.id,
      eventPayload,
      matchedConditions: true,
      actions: rule.actions,
      delay: delayMs,
      attemptCount: 0,
      maxAttempts: 3,
      createdAt: new Date(),
    }

    await queue.add(
      'execute-automation',
      executionContext,
      {
        delay: delayMs,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 7 * 24 * 60 * 60, // Keep for 7 days
          count: 1000,
        },
        removeOnFail: {
          age: 30 * 24 * 60 * 60, // Keep failures for 30 days
        },
      }
    )

    console.log(
      `[Automation Engine] Queued execution for rule "${rule.name}"`,
      delayMs > 0 ? `(delayed ${delayMs}ms)` : ''
    )

    return true
  } catch (error) {
    console.error('[Automation Engine] Error queueing execution:', error)
    return false
  }
}

// ═══════════════════════════════════════════════════════════
// STATS TRACKING
// ═══════════════════════════════════════════════════════════

/**
 * Update automation rule statistics
 */
async function updateRuleStats(
  ruleId: string,
  update: {
    triggered?: boolean
    succeeded?: boolean
    failed?: boolean
    error?: string
  }
): Promise<void> {
  try {
    const payload = await getPayload({ config })

    // Get current stats
    const rule = await payload.findByID({
      collection: 'automation-rules',
      id: ruleId,
    })

    if (!rule) {
      console.error(`[Automation Engine] Rule not found for stats update: ${ruleId}`)
      return
    }

    const stats: any = rule.stats || {
      timesTriggered: 0,
      timesSucceeded: 0,
      timesFailed: 0,
    }

    // Update stats
    if (update.triggered) {
      stats.timesTriggered = (stats.timesTriggered || 0) + 1
      stats.lastTriggered = new Date()
    }

    if (update.succeeded) {
      stats.timesSucceeded = (stats.timesSucceeded || 0) + 1
    }

    if (update.failed) {
      stats.timesFailed = (stats.timesFailed || 0) + 1
      if (update.error) {
        stats.lastError = update.error
      }
    }

    // Save updated stats
    await payload.update({
      collection: 'automation-rules',
      id: ruleId,
      data: { stats },
    })

    console.log(`[Automation Engine] Updated stats for rule ${ruleId}`, stats)
  } catch (error) {
    console.error('[Automation Engine] Error updating rule stats:', error)
  }
}

/**
 * Get execution count for a rule + user combination
 */
async function getExecutionCount(ruleId: string, userIdentifier: string): Promise<number> {
  // TODO: In production, store execution counts in Redis or database
  // For now, return 0 (no limit enforcement)
  // Example Redis key: `automation:executions:${ruleId}:${userIdentifier}`
  return 0
}

/**
 * Get user identifier from event payload
 */
function getEventUserIdentifier(eventPayload: EventPayload): string {
  // Extract email or userId from event payload
  if ('email' in eventPayload && typeof eventPayload.email === 'string') {
    return eventPayload.email
  }
  if ('userId' in eventPayload && typeof eventPayload.userId === 'string') {
    return eventPayload.userId
  }
  return 'anonymous'
}

// ═══════════════════════════════════════════════════════════
// BATCH PROCESSING
// ═══════════════════════════════════════════════════════════

/**
 * Process multiple events in batch (useful for bulk imports, migrations)
 */
export async function processBatchEvents(
  events: EventPayload[]
): Promise<{
  success: boolean
  totalProcessed: number
  totalTriggered: number
  totalQueued: number
  errors: string[]
}> {
  let totalProcessed = 0
  let totalTriggered = 0
  let totalQueued = 0
  const errors: string[] = []

  console.log(`[Automation Engine] Processing batch of ${events.length} events`)

  for (const event of events) {
    const result = await processEvent(event)

    totalProcessed++
    totalTriggered += result.triggeredRules
    totalQueued += result.queuedExecutions

    if (!result.success) {
      errors.push(...result.errors)
    }
  }

  console.log(
    `[Automation Engine] Batch complete: ${totalProcessed} processed, ${totalTriggered} triggered, ${totalQueued} queued`
  )

  return {
    success: errors.length === 0,
    totalProcessed,
    totalTriggered,
    totalQueued,
    errors,
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

export { updateRuleStats }
