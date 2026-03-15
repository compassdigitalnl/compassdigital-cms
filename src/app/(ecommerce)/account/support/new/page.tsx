'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon?: string
}

export default function NewTicketPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chatSessionId = searchParams.get('chatSessionId')

  const [form, setForm] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    description: '',
  })

  // Fetch categories
  useEffect(() => {
    fetch('/api/support/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.docs)
      })
      .catch(() => {})
  }, [])

  // Pre-fill from chatbot escalation
  useEffect(() => {
    if (chatSessionId) {
      setForm((prev) => ({
        ...prev,
        subject: 'Doorgestuurd vanuit chatbot',
      }))
    }
  }, [chatSessionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject.trim()) {
      setError('Vul een onderwerp in')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const body: Record<string, any> = {
        subject: form.subject,
        priority: form.priority,
      }
      if (form.category) body.category = form.category
      if (form.description.trim()) {
        // Send as lexical richText root
        body.description = {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: form.description, version: 1 }],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        }
      }
      if (chatSessionId) body.chatSessionId = chatSessionId

      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (data.success) {
        router.push(`/account/support/${data.doc.id}`)
      } else {
        setError(data.error || 'Er ging iets mis')
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return <div className="animate-pulse"><div className="h-8 bg-grey-light rounded w-48 mb-4" /><div className="h-64 bg-grey-light rounded" /></div>
  }

  if (!user) {
    router.push('/account/login')
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/account/support')}
          className="p-2 rounded-lg hover:bg-grey-light/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-grey-dark" />
        </button>
        <h1 className="text-2xl font-bold text-grey-dark">Nieuw ticket</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {chatSessionId && (
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
            Dit ticket wordt gekoppeld aan uw chatbot gesprek.
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-grey-dark mb-1.5">
            Onderwerp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Korte beschrijving van uw vraag of probleem"
            className="w-full px-4 py-2.5 rounded-lg border border-grey-light/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            required
          />
        </div>

        {/* Category + Priority row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-grey-dark mb-1.5">Categorie</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-grey-light/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Selecteer een categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-dark mb-1.5">Prioriteit</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-grey-light/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="low">Laag</option>
              <option value="normal">Normaal</option>
              <option value="high">Hoog</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-grey-dark mb-1.5">Beschrijving</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6}
            placeholder="Beschrijf uw vraag of probleem zo gedetailleerd mogelijk..."
            className="w-full px-4 py-2.5 rounded-lg border border-grey-light/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-60"
            style={{ background: 'var(--color-primary, #0066cc)' }}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Versturen...' : 'Ticket versturen'}
          </button>
        </div>
      </form>
    </div>
  )
}
