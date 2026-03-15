'use client'

import { useCallback, useRef, useState, type DragEvent } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodeTypes } from './nodes'
import { createStepNode } from './utils/serialization'

interface FlowCanvasProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
}

let nodeIdCounter = 0

function generateNodeId(): string {
  nodeIdCounter += 1
  return `step-new-${Date.now()}-${nodeIdCounter}`
}

function FlowCanvasInner({
  initialNodes,
  initialEdges,
  onNodesChange: onNodesChangeCallback,
  onEdgesChange: onEdgesChangeCallback,
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Notify parent of changes
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes)
      // Defer callback to next tick to get updated state
      setTimeout(() => {
        onNodesChangeCallback?.(nodes)
      }, 0)
    },
    [onNodesChange, onNodesChangeCallback, nodes],
  )

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes)
      setTimeout(() => {
        onEdgesChangeCallback?.(edges)
      }, 0)
    },
    [onEdgesChange, onEdgesChangeCallback, edges],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.sourceHandle || 'default'}-${connection.target}`,
        type: 'smoothstep',
      }
      setEdges((eds) => addEdge(edge, eds))
      setTimeout(() => {
        onEdgesChangeCallback?.(edges)
      }, 0)
    },
    [setEdges, onEdgesChangeCallback, edges],
  )

  // Drop handler for sidebar drag-and-drop
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = createStepNode(type, position, generateNodeId())
      setNodes((nds) => [...nds, newNode])
    },
    [screenToFlowPosition, setNodes],
  )

  // Delete selected nodes on Backspace/Delete
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        setNodes((nds) => nds.filter((n) => !n.selected || n.id === 'trigger'))
        setEdges((eds) => eds.filter((e) => !e.selected))
      }
    },
    [setNodes, setEdges],
  )

  return (
    <div
      ref={reactFlowWrapper}
      className="flex-1 h-full"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2, stroke: '#94a3b8' },
        }}
        deleteKeyCode={['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-white !border !border-grey-light !rounded-lg !shadow-sm"
        />
        <MiniMap
          className="!bg-grey-light !border !border-grey-light !rounded-lg"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              triggerNode: '#0a1628',
              emailNode: '#3b82f6',
              waitNode: '#f59e0b',
              conditionNode: '#a855f7',
              listNode: '#06b6d4',
              tagNode: '#10b981',
              webhookNode: '#6366f1',
              exitNode: '#ef4444',
            }
            return colors[node.type || ''] || '#94a3b8'
          }}
          maskColor="rgba(0,0,0,0.05)"
        />
      </ReactFlow>
    </div>
  )
}

export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
