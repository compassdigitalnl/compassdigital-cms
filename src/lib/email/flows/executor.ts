/**
 * Flow Executor
 *
 * Executes flow steps and manages flow state progression
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { Queue } from 'bullmq'
import { redis } from '@/lib/queue/redis'
import { evaluateCondition } from '../automation/conditions'
import type { EventPayload } from '../automation/types'
import { delayToMilliseconds } from '../automation/types'
import { listmonkClient } from '../listmonk/client'

// ═══════════════════════════════════════════════════════════
// FLOW ENTRY
// ═══════════════════════════════════════════════════════════

/**
 * Enter a user into a flow based on an event
 */
export async function enterFlow(
  flowId: string,
  subscriberId: string,
  eventPayload: EventPayload,
  tenantId: string
): Promise<{ success: boolean; instanceId?: string; error?: string }> {
  try {
    const payload = await getPayload({ config })

    // Get flow
    const flow = await payload.findByID({
      collection: 'automation-flows',
      id: flowId,
    })

    if (!flow || flow.status !== 'active') {
      return { success: false, error: 'Flow not found or not active' }
    }

    // Check entry conditions
    if (flow.entryConditions && flow.entryConditions.length > 0) {
      const conditionsPassed = flow.entryConditions.every((condition: any) =>
        evaluateCondition(condition, eventPayload)
      )

      if (!conditionsPassed) {
        console.log(`[Flow Executor] Entry conditions not met for flow: ${flow.name}`)
        return { success: false, error: 'Entry conditions not met' }
      }
    }

    // Check if user already in flow
    const existingInstances = await payload.find({
      collection: 'flow-instances',
      where: {
        and: [
          { flow: { equals: flowId } },
          { subscriber: { equals: subscriberId } },
          { status: { equals: 'active' } },
        ],
      },
    })

    if (existingInstances.docs.length > 0 && !flow.settings?.allowReentry) {
      console.log(`[Flow Executor] User already in flow: ${flow.name}`)
      return { success: false, error: 'User already in flow' }
    }

    // Create flow instance
    const instance = await payload.create({
      collection: 'flow-instances',
      data: {
        flow: flowId,
        subscriber: subscriberId,
        status: 'active',
        currentStep: 0,
        currentStepName: flow.steps[0]?.name || 'Step 1',
        startedAt: new Date().toISOString(),
        entryEventData: eventPayload,
        stepHistory: [],
        tenant: tenantId,
      },
    })

    // Update flow stats
    await payload.update({
      collection: 'automation-flows',
      id: flowId,
      data: {
        stats: {
          ...flow.stats,
          totalEntries: (flow.stats?.totalEntries || 0) + 1,
          activeInstances: (flow.stats?.activeInstances || 0) + 1,
          lastEntry: new Date(),
        },
      },
    })

    // Queue first step execution
    await queueStepExecution(instance.id, 0)

    console.log(`[Flow Executor] User entered flow: ${flow.name}, instance: ${instance.id}`)

    return { success: true, instanceId: instance.id }
  } catch (error: any) {
    console.error('[Flow Executor] Error entering flow:', error)
    return { success: false, error: error.message }
  }
}

// ═══════════════════════════════════════════════════════════
// STEP EXECUTION
// ═══════════════════════════════════════════════════════════

/**
 * Execute a flow step
 */
export async function executeFlowStep(
  instanceId: string,
  stepIndex: number
): Promise<{ success: boolean; nextStepIndex?: number; completed?: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })

    // Get flow instance
    const instance = await payload.findByID({
      collection: 'flow-instances',
      id: instanceId,
    })

    if (!instance || instance.status !== 'active') {
      return { success: false, error: 'Instance not found or not active' }
    }

    // Get flow
    const flow = await payload.findByID({
      collection: 'automation-flows',
      id: instance.flow,
    })

    if (!flow) {
      return { success: false, error: 'Flow not found' }
    }

    // Get step
    const step = flow.steps[stepIndex]
    if (!step) {
      // No more steps - complete flow
      await completeFlow(instanceId)
      return { success: true, completed: true }
    }

    console.log(`[Flow Executor] Executing step ${stepIndex}: ${step.name} (${step.type})`)

    // Execute step action
    let nextStep = stepIndex + 1
    let error: string | undefined

    try {
      switch (step.type) {
        case 'send_email':
          await executeSendEmail(instance, step)
          break

        case 'wait':
          await executeWait(instance, step, stepIndex)
          return { success: true, nextStepIndex: nextStep }

        case 'add_to_list':
          await executeAddToList(instance, step)
          break

        case 'remove_from_list':
          await executeRemoveFromList(instance, step)
          break

        case 'add_tag':
          await executeAddTag(instance, step)
          break

        case 'remove_tag':
          await executeRemoveTag(instance, step)
          break

        case 'condition':
          nextStep = await executeCondition(instance, step, stepIndex)
          break

        case 'webhook':
          await executeWebhook(instance, step)
          break

        case 'exit':
          await exitFlow(instanceId, step.exitReason || 'Exit step reached')
          return { success: true, completed: true }

        default:
          console.warn(`[Flow Executor] Unknown step type: ${step.type}`)
      }
    } catch (err: any) {
      error = err.message
      console.error(`[Flow Executor] Step execution error:`, err)
    }

    // Record step in history
    await payload.update({
      collection: 'flow-instances',
      id: instanceId,
      data: {
        stepHistory: [
          ...(instance.stepHistory || []),
          {
            stepIndex,
            stepName: step.name,
            stepType: step.type,
            executedAt: new Date(),
            success: !error,
            error,
          },
        ],
      },
    })

    if (error) {
      // Mark instance as failed
      await payload.update({
        collection: 'flow-instances',
        id: instanceId,
        data: {
          status: 'failed',
          lastError: error,
        },
      })
      return { success: false, error }
    }

    // Move to next step
    if (nextStep < flow.steps.length) {
      await moveToNextStep(instanceId, nextStep, flow.steps[nextStep]?.name)
      await queueStepExecution(instanceId, nextStep)
      return { success: true, nextStepIndex: nextStep }
    } else {
      // Flow complete
      await completeFlow(instanceId)
      return { success: true, completed: true }
    }
  } catch (error: any) {
    console.error('[Flow Executor] Error executing step:', error)
    return { success: false, error: error.message }
  }
}

// ═══════════════════════════════════════════════════════════
// STEP ACTIONS
// ═══════════════════════════════════════════════════════════

async function executeSendEmail(instance: any, step: any) {
  const payload = await getPayload({ config })

  const template = await payload.findByID({
    collection: 'email-templates',
    id: step.emailTemplate,
  })

  if (!template) throw new Error('Email template not found')

  const subscriber = await payload.findByID({
    collection: 'email-subscribers',
    id: instance.subscriber,
  })

  if (!subscriber) throw new Error('Subscriber not found')

  await listmonkClient.sendTransactionalEmail({
    subscriberId: subscriber.listmonkId,
    templateId: template.listmonkId,
    data: instance.entryEventData?.metadata || {},
  })

  console.log(`[Flow Executor] Email sent: ${template.name}`)
}

async function executeWait(instance: any, step: any, currentStepIndex: number) {
  const delayMs = delayToMilliseconds(step.waitDuration.value, step.waitDuration.unit)
  const scheduledAt = new Date(Date.now() + delayMs)

  const payload = await getPayload({ config })
  await payload.update({
    collection: 'flow-instances',
    id: instance.id,
    data: {
      nextStepScheduledAt: scheduledAt,
    },
  })

  console.log(`[Flow Executor] Wait scheduled for ${delayMs}ms (${step.waitDuration.value} ${step.waitDuration.unit})`)
}

async function executeAddToList(instance: any, step: any) {
  const payload = await getPayload({ config })

  const list = await payload.findByID({
    collection: 'email-lists',
    id: step.list,
  })

  const subscriber = await payload.findByID({
    collection: 'email-subscribers',
    id: instance.subscriber,
  })

  await listmonkClient.addSubscriberToList(subscriber.listmonkId, list.listmonkId)

  console.log(`[Flow Executor] Added to list: ${list.name}`)
}

async function executeRemoveFromList(instance: any, step: any) {
  const payload = await getPayload({ config })

  const list = await payload.findByID({
    collection: 'email-lists',
    id: step.list,
  })

  const subscriber = await payload.findByID({
    collection: 'email-subscribers',
    id: instance.subscriber,
  })

  await listmonkClient.removeSubscriberFromList(subscriber.listmonkId, list.listmonkId)

  console.log(`[Flow Executor] Removed from list: ${list.name}`)
}

async function executeAddTag(instance: any, step: any) {
  const payload = await getPayload({ config })

  const subscriber = await payload.findByID({
    collection: 'email-subscribers',
    id: instance.subscriber,
  })

  const currentTags = subscriber.attributes?.tags || []
  const updatedTags = [...new Set([...currentTags, step.tagName])]

  await listmonkClient.updateSubscriber(subscriber.listmonkId, {
    attribs: {
      ...subscriber.attributes,
      tags: updatedTags,
    },
  })

  console.log(`[Flow Executor] Added tag: ${step.tagName}`)
}

async function executeRemoveTag(instance: any, step: any) {
  const payload = await getPayload({ config })

  const subscriber = await payload.findByID({
    collection: 'email-subscribers',
    id: instance.subscriber,
  })

  const currentTags = subscriber.attributes?.tags || []
  const updatedTags = currentTags.filter((tag: string) => tag !== step.tagName)

  await listmonkClient.updateSubscriber(subscriber.listmonkId, {
    attribs: {
      ...subscriber.attributes,
      tags: updatedTags,
    },
  })

  console.log(`[Flow Executor] Removed tag: ${step.tagName}`)
}

async function executeCondition(instance: any, step: any, currentStepIndex: number): Promise<number> {
  const conditionPassed = evaluateCondition(step.condition, instance.entryEventData)

  const nextStep = conditionPassed
    ? (step.condition.ifTrue ? step.condition.ifTrue - 1 : currentStepIndex + 1)
    : (step.condition.ifFalse ? step.condition.ifFalse - 1 : currentStepIndex + 1)

  console.log(`[Flow Executor] Condition ${conditionPassed ? 'PASSED' : 'FAILED'}, going to step ${nextStep + 1}`)

  return nextStep
}

async function executeWebhook(instance: any, step: any) {
  const response = await fetch(step.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flowInstance: instance.id,
      subscriber: instance.subscriber,
      eventData: instance.entryEventData,
    }),
  })

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`)
  }

  console.log(`[Flow Executor] Webhook called: ${step.webhookUrl}`)
}

// ═══════════════════════════════════════════════════════════
// FLOW STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════

async function moveToNextStep(instanceId: string, stepIndex: number, stepName: string) {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'flow-instances',
    id: instanceId,
    data: {
      currentStep: stepIndex,
      currentStepName: stepName,
    },
  })
}

async function completeFlow(instanceId: string) {
  const payload = await getPayload({ config })

  const instance = await payload.findByID({
    collection: 'flow-instances',
    id: instanceId,
  })

  await payload.update({
    collection: 'flow-instances',
    id: instanceId,
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  })

  // Update flow stats
  const flow = await payload.findByID({
    collection: 'automation-flows',
    id: instance.flow,
  })

  await payload.update({
    collection: 'automation-flows',
    id: instance.flow,
    data: {
      stats: {
        ...flow.stats,
        activeInstances: Math.max(0, (flow.stats?.activeInstances || 0) - 1),
        completedInstances: (flow.stats?.completedInstances || 0) + 1,
      },
    },
  })

  console.log(`[Flow Executor] Flow completed: ${instanceId}`)
}

async function exitFlow(instanceId: string, reason: string) {
  const payload = await getPayload({ config })

  const instance = await payload.findByID({
    collection: 'flow-instances',
    id: instanceId,
  })

  await payload.update({
    collection: 'flow-instances',
    id: instanceId,
    data: {
      status: 'exited',
      completedAt: new Date(),
      exitReason: reason,
    },
  })

  // Update flow stats
  const flow = await payload.findByID({
    collection: 'automation-flows',
    id: instance.flow,
  })

  await payload.update({
    collection: 'automation-flows',
    id: instance.flow,
    data: {
      stats: {
        ...flow.stats,
        activeInstances: Math.max(0, (flow.stats?.activeInstances || 0) - 1),
        exitedInstances: (flow.stats?.exitedInstances || 0) + 1,
      },
    },
  })

  console.log(`[Flow Executor] Flow exited: ${instanceId}, reason: ${reason}`)
}

// ═══════════════════════════════════════════════════════════
// QUEUEING
// ═══════════════════════════════════════════════════════════

async function queueStepExecution(instanceId: string, stepIndex: number, delayMs: number = 0) {
  const queue = new Queue('email-flows', { connection: redis })

  await queue.add(
    'execute-flow-step',
    { instanceId, stepIndex },
    {
      delay: delayMs,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    }
  )

  console.log(`[Flow Executor] Queued step ${stepIndex} for instance ${instanceId}`)
}
