'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Node, Edge } from '@xyflow/react'

import { FlowCanvas } from './FlowCanvas'
import { FlowSidebar } from './FlowSidebar'
import { FlowToolbar } from './FlowToolbar'
import { stepsToGraph, graphToSteps, type FlowData, type FlowStep } from './utils/serialization'

interface FlowBuilderProps {
  flowId?: string
  initialData?: FlowData
  apiBase?: string
  onBack?: () => void
}

export function FlowBuilder({
  flowId,
  initialData,
  apiBase = '',
  onBack,
}: FlowBuilderProps) {
  const [flowName, setFlowName] = useState(initialData?.name || 'Nieuwe flow')
  const [flowStatus, setFlowStatus] = useState(initialData?.status || 'draft')
  const [entryTrigger, setEntryTrigger] = useState(
    initialData?.entryTrigger || { eventType: 'subscriber.added' },
  )
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Convert steps to graph
  const initial = stepsToGraph(initialData?.steps || [])

  // Keep a ref to the current trigger node data
  const triggerNodeData = { ...entryTrigger, label: 'Trigger' }
  const initialNodesWithTrigger = initial.nodes.map((n) =>
    n.id === 'trigger' ? { ...n, data: triggerNodeData } : n,
  )

  // If no steps, add the trigger node
  if (initialNodesWithTrigger.length === 0) {
    initialNodesWithTrigger.push({
      id: 'trigger',
      type: 'triggerNode',
      position: { x: 100, y: 80 },
      data: triggerNodeData,
    })
  }

  const nodesRef = useRef<Node[]>(initialNodesWithTrigger)
  const edgesRef = useRef<Edge[]>(initial.edges)

  const handleNodesChange = useCallback((nodes: Node[]) => {
    nodesRef.current = nodes
    setHasChanges(true)
  }, [])

  const handleEdgesChange = useCallback((edges: Edge[]) => {
    edgesRef.current = edges
    setHasChanges(true)
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const steps = graphToSteps(nodesRef.current, edgesRef.current)

      const flowData: Partial<FlowData> = {
        name: flowName,
        status: flowStatus,
        entryTrigger,
        steps,
      }

      const url = flowId
        ? `${apiBase}/api/automation-flows/${flowId}`
        : `${apiBase}/api/automation-flows`

      const res = await fetch(url, {
        method: flowId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(flowData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.errors?.[0]?.message || 'Opslaan mislukt')
      }

      setHasChanges(false)
      setSaveMessage('Opgeslagen!')
      setTimeout(() => setSaveMessage(''), 2000)
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Opslaan mislukt')
    } finally {
      setIsSaving(false)
    }
  }, [flowId, flowName, flowStatus, entryTrigger, apiBase])

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      setFlowStatus(newStatus)
      setHasChanges(true)
    },
    [],
  )

  const handleBack = useCallback(() => {
    if (hasChanges) {
      if (!window.confirm('Je hebt niet-opgeslagen wijzigingen. Weet je zeker dat je terug wilt?')) {
        return
      }
    }
    onBack?.()
  }, [hasChanges, onBack])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toolbar */}
      <FlowToolbar
        flowName={flowName}
        status={flowStatus}
        isSaving={isSaving}
        hasChanges={hasChanges}
        onSave={handleSave}
        onStatusChange={handleStatusChange}
        onNameChange={(name) => { setFlowName(name); setHasChanges(true) }}
        onBack={handleBack}
      />

      {/* Save feedback */}
      {saveMessage && (
        <div
          className="px-4 py-1.5 text-xs font-medium text-center"
          style={{
            background: saveMessage === 'Opgeslagen!' ? '#ecfdf5' : '#fef2f2',
            color: saveMessage === 'Opgeslagen!' ? '#059669' : '#dc2626',
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* Main area: Sidebar + Canvas */}
      <div className="flex flex-1 overflow-hidden">
        <FlowSidebar />
        <FlowCanvas
          initialNodes={initialNodesWithTrigger}
          initialEdges={initial.edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
        />
      </div>
    </div>
  )
}
