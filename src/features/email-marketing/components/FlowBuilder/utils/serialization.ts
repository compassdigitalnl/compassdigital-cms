/**
 * Serialization utilities for converting between React Flow's node/edge graph
 * and the AutomationFlows steps[] schema.
 *
 * The existing schema uses sequential steps with condition nodes
 * that can jump to specific indices via ifTrue/ifFalse.
 * React Flow uses positioned nodes with explicit edge connections.
 */

import type { Node, Edge } from '@xyflow/react'

export interface FlowStep {
  name: string
  type: string
  // send_email
  emailTemplate?: string | { id: string }
  // wait
  waitDuration?: { value: number; unit: string }
  // add_to_list / remove_from_list
  list?: string | { id: string }
  // add_tag / remove_tag
  tagName?: string
  // condition
  condition?: {
    field: string
    operator: string
    value: string
    ifTrue?: number
    ifFalse?: number
  }
  // webhook
  webhookUrl?: string
  // exit
  exitReason?: string
  // React Flow position (stored but not used by executor)
  _position?: { x: number; y: number }
}

export interface FlowData {
  name: string
  description?: string
  status: string
  entryTrigger: {
    eventType: string
    customEventName?: string
  }
  entryConditions?: Array<{ field: string; operator: string; value: string }>
  exitConditions?: Array<{ eventType: string; customEventName?: string }>
  steps: FlowStep[]
  settings?: {
    allowReentry?: boolean
    maxEntriesPerUser?: number
  }
}

const NODE_SPACING_X = 300
const NODE_SPACING_Y = 150
const START_X = 100
const START_Y = 80

/**
 * Convert AutomationFlows steps[] → React Flow nodes + edges
 */
export function stepsToGraph(steps: FlowStep[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Add trigger node (virtual, not a real step)
  nodes.push({
    id: 'trigger',
    type: 'triggerNode',
    position: { x: START_X, y: START_Y },
    data: { label: 'Trigger' },
  })

  steps.forEach((step, index) => {
    const nodeId = `step-${index}`
    const position = step._position || {
      x: START_X,
      y: START_Y + (index + 1) * NODE_SPACING_Y,
    }

    nodes.push({
      id: nodeId,
      type: stepTypeToNodeType(step.type),
      position,
      data: {
        ...step,
        stepIndex: index,
        label: step.name || step.type,
      },
    })

    // Edge from previous node
    if (index === 0) {
      edges.push({
        id: `trigger-to-${nodeId}`,
        source: 'trigger',
        target: nodeId,
        type: 'smoothstep',
        animated: true,
      })
    }

    // Standard sequential connection to next step
    if (step.type === 'condition' && step.condition) {
      const trueTarget = step.condition.ifTrue
        ? `step-${step.condition.ifTrue - 1}` // 1-indexed → 0-indexed
        : index + 1 < steps.length ? `step-${index + 1}` : null
      const falseTarget = step.condition.ifFalse
        ? `step-${step.condition.ifFalse - 1}`
        : index + 1 < steps.length ? `step-${index + 1}` : null

      if (trueTarget) {
        edges.push({
          id: `${nodeId}-true`,
          source: nodeId,
          sourceHandle: 'true',
          target: trueTarget,
          type: 'smoothstep',
          label: 'Ja',
          style: { stroke: '#22c55e' },
        })
      }
      if (falseTarget && falseTarget !== trueTarget) {
        edges.push({
          id: `${nodeId}-false`,
          source: nodeId,
          sourceHandle: 'false',
          target: falseTarget,
          type: 'smoothstep',
          label: 'Nee',
          style: { stroke: '#ef4444' },
        })
      }
    } else if (step.type !== 'exit' && index + 1 < steps.length) {
      edges.push({
        id: `${nodeId}-to-step-${index + 1}`,
        source: nodeId,
        target: `step-${index + 1}`,
        type: 'smoothstep',
      })
    }
  })

  return { nodes, edges }
}

/**
 * Convert React Flow nodes + edges → AutomationFlows steps[]
 * Preserves node positions for layout persistence.
 */
export function graphToSteps(nodes: Node[], edges: Edge[]): FlowStep[] {
  // Filter out the trigger node and sort by Y position (top to bottom)
  const stepNodes = nodes
    .filter((n) => n.id !== 'trigger')
    .sort((a, b) => a.position.y - b.position.y)

  // Build index map (node id → new step index)
  const indexMap = new Map<string, number>()
  stepNodes.forEach((node, index) => {
    indexMap.set(node.id, index)
  })

  return stepNodes.map((node) => {
    const data = node.data as any
    const step: FlowStep = {
      name: data.name || data.label || node.type || '',
      type: nodeTypeToStepType(node.type || ''),
      _position: { x: node.position.x, y: node.position.y },
    }

    // Copy type-specific fields
    switch (step.type) {
      case 'send_email':
        if (data.emailTemplate) step.emailTemplate = data.emailTemplate
        break
      case 'wait':
        step.waitDuration = data.waitDuration || { value: 1, unit: 'days' }
        break
      case 'add_to_list':
      case 'remove_from_list':
        if (data.list) step.list = data.list
        break
      case 'add_tag':
      case 'remove_tag':
        if (data.tagName) step.tagName = data.tagName
        break
      case 'condition':
        step.condition = {
          field: data.condition?.field || '',
          operator: data.condition?.operator || 'equals',
          value: data.condition?.value || '',
        }
        // Resolve ifTrue/ifFalse from edges
        const trueEdge = edges.find((e) => e.source === node.id && e.sourceHandle === 'true')
        const falseEdge = edges.find((e) => e.source === node.id && e.sourceHandle === 'false')
        if (trueEdge) {
          const trueIndex = indexMap.get(trueEdge.target)
          if (trueIndex !== undefined) step.condition.ifTrue = trueIndex + 1 // 0-indexed → 1-indexed
        }
        if (falseEdge) {
          const falseIndex = indexMap.get(falseEdge.target)
          if (falseIndex !== undefined) step.condition.ifFalse = falseIndex + 1
        }
        break
      case 'webhook':
        if (data.webhookUrl) step.webhookUrl = data.webhookUrl
        break
      case 'exit':
        if (data.exitReason) step.exitReason = data.exitReason
        break
    }

    return step
  })
}

function stepTypeToNodeType(stepType: string): string {
  const map: Record<string, string> = {
    send_email: 'emailNode',
    wait: 'waitNode',
    add_to_list: 'listNode',
    remove_from_list: 'listNode',
    add_tag: 'tagNode',
    remove_tag: 'tagNode',
    condition: 'conditionNode',
    webhook: 'webhookNode',
    exit: 'exitNode',
  }
  return map[stepType] || 'emailNode'
}

function nodeTypeToStepType(nodeType: string): string {
  const map: Record<string, string> = {
    emailNode: 'send_email',
    waitNode: 'wait',
    listNode: 'add_to_list',
    tagNode: 'add_tag',
    conditionNode: 'condition',
    webhookNode: 'webhook',
    exitNode: 'exit',
  }
  return map[nodeType] || 'send_email'
}

/**
 * Create a new step node at the given position
 */
export function createStepNode(
  type: string,
  position: { x: number; y: number },
  id: string,
): Node {
  const defaults: Record<string, any> = {
    send_email: { name: 'E-mail versturen', emailTemplate: null },
    wait: { name: 'Wachten', waitDuration: { value: 1, unit: 'days' } },
    add_to_list: { name: 'Aan lijst toevoegen', list: null },
    remove_from_list: { name: 'Van lijst verwijderen', list: null },
    add_tag: { name: 'Tag toevoegen', tagName: '' },
    remove_tag: { name: 'Tag verwijderen', tagName: '' },
    condition: { name: 'Voorwaarde', condition: { field: '', operator: 'equals', value: '' } },
    webhook: { name: 'Webhook', webhookUrl: '' },
    exit: { name: 'Einde', exitReason: '' },
  }

  return {
    id,
    type: stepTypeToNodeType(type),
    position,
    data: {
      ...defaults[type],
      type,
      label: defaults[type]?.name || type,
    },
  }
}
