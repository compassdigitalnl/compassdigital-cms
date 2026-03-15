'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { ArrowLeft, Send, Loader2, Star, X, Clock, User, Bot } from 'lucide-react'

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  status: string
  priority: string
  category?: { name: string } | null
  assignedTo?: { firstName?: string; lastName?: string } | null
  createdAt: string
  rating?: number
}

interface Message {
  id: string
  senderRole: 'customer' | 'agent' | 'system'
  sender?: { firstName?: string; lastName?: string; email?: string } | null
  message: any
  createdAt: string
  isInternal?: boolean
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In behandeling',
  waiting_customer: 'Wacht op u',
  waiting_agent: 'Wacht op agent',
  resolved: 'Opgelost',
  closed: 'Gesloten',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  waiting_customer: 'bg-orange-100 text-orange-800',
  waiting_agent: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-grey-light text-grey-dark',
}

function extractText(richText: any): string {
  if (!richText?.root?.children) return ''
  const extract = (nodes: any[]): string =>
    nodes.map((n) => n.text || (n.children ? extract(n.children) : '')).join('')
  return extract(richText.root.children)
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string
  const { user, isLoading: authLoading } = useAccountAuth()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingFeedback, setRatingFeedback] = useState('')
  const [isRating, setIsRating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`)
      const data = await res.json()
      if (data.success) {
        setTicket(data.doc)
        setMessages(data.messages || [])
      }
    } catch {
      // Silent
    } finally {
      setIsLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    if (!authLoading && user) fetchTicket()
  }, [authLoading, user, fetchTicket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendReply = async () => {
    if (!reply.trim() || isSending) return
    setIsSending(true)
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            root: {
              type: 'root',
              children: [{ type: 'paragraph', children: [{ type: 'text', text: reply.trim(), version: 1 }], version: 1 }],
              direction: 'ltr', format: '', indent: 0, version: 1,
            },
          },
        }),
      })
      if (res.ok) {
        setReply('')
        await fetchTicket()
      }
    } catch {
      // Silent
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = async () => {
    if (!confirm('Weet u zeker dat u dit ticket wilt sluiten?')) return
    try {
      await fetch(`/api/support/tickets/${ticketId}/close`, { method: 'POST' })
      await fetchTicket()
    } catch {
      // Silent
    }
  }

  const handleRate = async () => {
    if (ratingValue < 1) return
    setIsRating(true)
    try {
      await fetch(`/api/support/tickets/${ticketId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue, feedback: ratingFeedback }),
      })
      setShowRating(false)
      await fetchTicket()
    } catch {
      // Silent
    } finally {
      setIsRating(false)
    }
  }

  if (authLoading || isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-grey-light rounded w-48" /><div className="h-64 bg-grey-light rounded" /></div>
  }

  if (!user) { router.push('/account/login'); return null }
  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-grey-dark font-medium">Ticket niet gevonden</p>
        <button onClick={() => router.push('/account/support')} className="text-blue-600 mt-2">Terug naar overzicht</button>
      </div>
    )
  }

  const isClosed = ticket.status === 'closed'
  const isResolved = ticket.status === 'resolved'
  const canReply = !isClosed
  const canRate = (isResolved || isClosed) && !ticket.rating
  const agentName = ticket.assignedTo
    ? [ticket.assignedTo.firstName, ticket.assignedTo.lastName].filter(Boolean).join(' ') || 'Agent'
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => router.push('/account/support')} className="p-2 rounded-lg hover:bg-grey-light/50 mt-0.5">
          <ArrowLeft className="w-5 h-5 text-grey-dark" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-grey">{ticket.ticketNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[ticket.status] || ''}`}>
              {STATUS_LABELS[ticket.status] || ticket.status}
            </span>
          </div>
          <h1 className="text-xl font-bold text-grey-dark">{ticket.subject}</h1>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-grey">
            {ticket.category && <span>{typeof ticket.category === 'object' ? ticket.category.name : ''}</span>}
            {agentName && <span className="flex items-center gap-1"><User className="w-3 h-3" />{agentName}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(ticket.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {canRate && (
          <button onClick={() => setShowRating(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-medium hover:bg-yellow-100">
            <Star className="w-4 h-4" /> Beoordelen
          </button>
        )}
        {canReply && !isClosed && (
          <button onClick={handleClose} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-grey-light/50 text-grey-dark text-sm font-medium hover:bg-grey-light">
            <X className="w-4 h-4" /> Sluiten
          </button>
        )}
      </div>

      {/* Rating modal */}
      {showRating && (
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-yellow-200">
          <h3 className="font-semibold text-grey-dark mb-3">Hoe tevreden bent u?</h3>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => setRatingValue(v)}>
                <Star className={`w-8 h-8 ${v <= ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-grey-light'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={ratingFeedback}
            onChange={(e) => setRatingFeedback(e.target.value)}
            rows={3}
            placeholder="Optioneel: vertel ons hoe we u beter kunnen helpen"
            className="w-full px-4 py-2.5 rounded-lg border border-grey-light/60 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex gap-2">
            <button onClick={handleRate} disabled={ratingValue < 1 || isRating} className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60" style={{ background: 'var(--color-primary, #0066cc)' }}>
              {isRating ? 'Versturen...' : 'Beoordeling versturen'}
            </button>
            <button onClick={() => setShowRating(false)} className="px-4 py-2 rounded-lg bg-grey-light/50 text-grey-dark text-sm">
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-grey-light/30">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-grey text-sm">Nog geen berichten</div>
          ) : (
            messages.map((msg) => {
              const isCustomer = msg.senderRole === 'customer'
              const isSystem = msg.senderRole === 'system'
              const senderName = msg.sender
                ? [msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(' ') || msg.sender.email || 'Onbekend'
                : 'Systeem'

              return (
                <div key={msg.id} className={`px-5 py-4 ${isSystem ? 'bg-grey-light/20' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                      isCustomer ? 'bg-blue-500' : isSystem ? 'bg-grey' : 'bg-green-600'
                    }`}>
                      {isSystem ? <Bot className="w-4 h-4" /> : senderName[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-grey-dark">{senderName}</span>
                    <span className="text-xs text-grey">
                      {isCustomer ? '(u)' : isSystem ? '(systeem)' : '(agent)'}
                    </span>
                    <span className="text-xs text-grey ml-auto">
                      {new Date(msg.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="pl-9 text-sm text-grey-dark leading-relaxed whitespace-pre-wrap">
                    {typeof msg.message === 'string' ? msg.message : extractText(msg.message)}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply form */}
        {canReply && (
          <div className="p-4 border-t border-grey-light/40">
            <div className="flex gap-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={2}
                placeholder="Typ uw bericht..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-grey-light/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    handleSendReply()
                  }
                }}
              />
              <button
                onClick={handleSendReply}
                disabled={!reply.trim() || isSending}
                className="self-end px-4 py-2.5 rounded-lg text-white transition-colors disabled:opacity-40"
                style={{ background: 'var(--color-primary, #0066cc)' }}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-grey mt-1.5">Ctrl+Enter om te versturen</p>
          </div>
        )}

        {isClosed && (
          <div className="p-4 border-t border-grey-light/40 text-center text-sm text-grey">
            Dit ticket is gesloten.
          </div>
        )}
      </div>
    </div>
  )
}
