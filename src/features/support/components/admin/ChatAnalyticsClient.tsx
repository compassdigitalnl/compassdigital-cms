'use client'

import React, { useState, useEffect } from 'react'

interface Conversation {
  id: string
  sessionId: string
  customer?: { firstName?: string; lastName?: string; email?: string } | null
  status: string
  messages?: Array<{ role: string; content: string; timestamp?: number }>
  metadata?: { model?: string; tokensUsed?: number; pageUrl?: string }
  rating?: number
  createdAt: string
}

export function ChatAnalyticsClient() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stats, setStats] = useState({ total: 0, escalated: 0, avgMessages: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/chat-conversations?limit=50&sort=-createdAt&depth=1')
        const data = await res.json()
        if (data.docs) {
          setConversations(data.docs)
          const escalated = data.docs.filter((c: any) => c.status === 'escalated').length
          const totalMessages = data.docs.reduce((sum: number, c: any) => sum + (c.messages?.length || 0), 0)
          setStats({
            total: data.totalDocs || data.docs.length,
            escalated,
            avgMessages: data.docs.length > 0 ? Math.round(totalMessages / data.docs.length) : 0,
          })
        }
      } catch (err) {
        console.error('[ChatAnalytics] Failed to load:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const selected = conversations.find((c) => c.id === selectedId)

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Laden...</div>
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Totaal gesprekken" value={stats.total} color="#3b82f6" />
        <StatCard label="Geëscaleerd" value={stats.escalated} color="#f59e0b" />
        <StatCard label="Escalatie %" value={stats.total > 0 ? `${Math.round((stats.escalated / stats.total) * 100)}%` : '-'} color="#8b5cf6" />
        <StatCard label="Gem. berichten" value={stats.avgMessages} color="#10b981" />
      </div>

      {/* Conversations list + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 1fr' : '1fr', gap: '1rem' }}>
        {/* List */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', maxHeight: '600px', overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Geen gesprekken</div>
          ) : (
            conversations.map((c) => {
              const customerName = c.customer
                ? [c.customer.firstName, c.customer.lastName].filter(Boolean).join(' ') || c.customer.email || 'Anoniem'
                : 'Anoniem'
              const msgCount = c.messages?.length || 0

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: c.id === selectedId ? '#f0f9ff' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>{customerName}</span>
                    <span style={{
                      fontSize: '0.7rem', padding: '0.125rem 0.5rem', borderRadius: '999px',
                      background: c.status === 'escalated' ? '#fef3c7' : c.status === 'ended' ? '#f3f4f6' : '#dbeafe',
                      color: c.status === 'escalated' ? '#92400e' : c.status === 'ended' ? '#6b7280' : '#1e40af',
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    {msgCount} berichten &middot; {new Date(c.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', maxHeight: '600px', overflowY: 'auto' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sessie: {selected.sessionId.slice(0, 20)}...</div>
              {selected.metadata?.pageUrl && (
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{selected.metadata.pageUrl}</div>
              )}
            </div>
            <div style={{ padding: '0.5rem' }}>
              {selected.messages?.map((msg, i) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', margin: '0.25rem 0', borderRadius: '8px', background: msg.role === 'user' ? '#dbeafe' : '#f3f4f6', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.7rem', color: msg.role === 'user' ? '#1e40af' : '#374151', marginBottom: '0.125rem' }}>
                    {msg.role === 'user' ? 'Bezoeker' : 'AI'}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
    </div>
  )
}
