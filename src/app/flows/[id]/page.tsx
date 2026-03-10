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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Flow laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#ef4444', marginBottom: '0.75rem' }}>{error}</p>
          <button
            onClick={() => router.back()}
            style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
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
