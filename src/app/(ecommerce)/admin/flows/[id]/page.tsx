'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FlowBuilder } from '@/features/email-marketing/components/FlowBuilder'
import type { FlowData } from '@/features/email-marketing/components/FlowBuilder'

export default function FlowEditorPage() {
  const params = useParams()
  const router = useRouter()
  const flowId = params.id as string
  const isNew = flowId === 'new'

  const [flowData, setFlowData] = useState<FlowData | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) {
      setFlowData({
        name: 'Nieuwe flow',
        status: 'draft',
        entryTrigger: { eventType: 'subscriber.added' },
        steps: [],
      })
      return
    }

    const fetchFlow = async () => {
      try {
        const res = await fetch(`/api/automation-flows/${flowId}`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Flow niet gevonden')
        const data = await res.json()
        setFlowData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Laden mislukt')
      } finally {
        setLoading(false)
      }
    }

    fetchFlow()
  }, [flowId, isNew])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Flow laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-sm font-bold text-gray-600 hover:underline"
          >
            Terug
          </button>
        </div>
      </div>
    )
  }

  return (
    <FlowBuilder
      flowId={isNew ? undefined : flowId}
      initialData={flowData || undefined}
      onBack={() => router.push('/admin/collections/automation-flows')}
    />
  )
}
