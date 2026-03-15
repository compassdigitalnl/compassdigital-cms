'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { Headset, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  status: string
  priority: string
  category?: { name: string } | null
  createdAt: string
  updatedAt: string
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

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-grey',
  normal: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600 font-semibold',
}

export default function SupportTicketsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)

  const fetchTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/support/tickets?${params}`)
      const data = await res.json()
      if (data.success) {
        setTickets(data.docs)
        setTotalPages(data.totalPages)
        setTotalDocs(data.totalDocs)
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => {
    if (!authLoading && user) fetchTickets()
  }, [authLoading, user, fetchTickets])

  if (authLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-grey-light rounded w-48" /><div className="h-64 bg-grey-light rounded" /></div>
  }

  if (!user) {
    router.push('/account/login')
    return null
  }

  const statusTabs = ['all', 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-grey-dark flex items-center gap-2">
            <Headset className="w-6 h-6" />
            Support
          </h1>
          <p className="text-grey mt-1">{totalDocs} ticket{totalDocs !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => router.push('/account/support/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition-colors"
          style={{ background: 'var(--color-primary, #0066cc)' }}
        >
          <Plus className="w-4 h-4" />
          Nieuw ticket
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'text-white'
                  : 'bg-grey-light/50 text-grey-dark hover:bg-grey-light'
              }`}
              style={statusFilter === s ? { background: 'var(--color-primary, #0066cc)' } : undefined}
            >
              {s === 'all' ? 'Alle' : STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Zoek op ticketnummer of onderwerp..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-grey-light/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tickets list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-5 bg-grey-light rounded w-24" />
                <div className="h-5 bg-grey-light rounded flex-1" />
                <div className="h-5 bg-grey-light rounded w-20" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <Headset className="w-12 h-12 text-grey-light mx-auto mb-4" />
            <p className="text-grey-dark font-medium">Geen tickets gevonden</p>
            <p className="text-grey text-sm mt-1">Maak een nieuw ticket aan als u hulp nodig heeft.</p>
          </div>
        ) : (
          <div className="divide-y divide-grey-light/40">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => router.push(`/account/support/${ticket.id}`)}
                className="w-full text-left px-5 py-4 hover:bg-grey-light/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-grey">{ticket.ticketNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[ticket.status] || 'bg-grey-light text-grey-dark'}`}>
                        {STATUS_LABELS[ticket.status] || ticket.status}
                      </span>
                      <span className={`text-xs ${PRIORITY_COLORS[ticket.priority] || ''}`}>
                        {ticket.priority === 'urgent' ? 'Urgent' : ticket.priority === 'high' ? 'Hoog' : ''}
                      </span>
                    </div>
                    <p className="font-medium text-grey-dark truncate">{ticket.subject}</p>
                    {ticket.category && (
                      <p className="text-xs text-grey mt-0.5">{typeof ticket.category === 'object' ? ticket.category.name : ''}</p>
                    )}
                  </div>
                  <div className="text-xs text-grey whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-grey-light/40">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 text-sm text-grey hover:text-grey-dark disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Vorige
            </button>
            <span className="text-sm text-grey">Pagina {page} van {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 text-sm text-grey hover:text-grey-dark disabled:opacity-40"
            >
              Volgende <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
