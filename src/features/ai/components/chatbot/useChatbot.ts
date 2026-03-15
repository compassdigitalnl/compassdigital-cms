/**
 * useChatbot Hook
 *
 * Custom React hook for chatbot state management and API integration.
 */

import { useState, useEffect, useCallback } from 'react'
import type {
  ChatbotMessage,
  ChatbotAPIResponse,
  ChatbotAvailability,
} from './types'

export function useChatbot() {
  const [messages, setMessages] = useState<ChatbotMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`)

  // Check if chatbot is available
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await fetch('/api/chatbot/chat')
        const data: ChatbotAvailability = await response.json()
        setIsAvailable(data.available)
      } catch (err) {
        console.error('[Chatbot] Availability check failed:', err)
        setIsAvailable(false)
      }
    }

    checkAvailability()
  }, [])

  // Send message to chatbot
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Add user message
      const userMessage: ChatbotMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        // Send to API
        const response = await fetch('/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content.trim(),
            conversationHistory: messages,
            sessionId,
          }),
        })

        const data: ChatbotAPIResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to get response')
        }

        if (data.success && data.data) {
          // Add assistant message
          const assistantMessage: ChatbotMessage = {
            role: 'assistant',
            content: data.data.answer,
            timestamp: data.data.timestamp,
            sources: data.data.sources,
            model: data.data.model,
            usage: data.data.usage,
            cost: data.data.cost,
          }

          setMessages((prev) => [...prev, assistantMessage])
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[Chatbot] Send message error:', err)
        setError(message || 'Er ging iets mis. Probeer het opnieuw.')

        // Add error message to chat
        const errorMessage: ChatbotMessage = {
          role: 'assistant',
          content: 'Sorry, ik kon geen antwoord genereren. Probeer het opnieuw of neem contact op met support.',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, sessionId],
  )

  // Reset conversation
  const resetConversation = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  // Save conversation to backend (fire-and-forget)
  const saveConversation = useCallback(async () => {
    if (messages.length === 0) return
    try {
      await fetch('/api/support/conversations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            sources: m.sources || null,
          })),
          metadata: {
            startedAt: messages[0]?.timestamp ? new Date(messages[0].timestamp).toISOString() : undefined,
            pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          },
        }),
      })
    } catch {
      // Non-critical, silent fail
    }
  }, [messages, sessionId])

  // Escalate conversation to a support ticket
  const escalateToTicket = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/support/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          subject: 'Doorgestuurd vanuit chatbot',
        }),
      })
      const data = await res.json()
      return data.success ? data.doc.id : null
    } catch {
      return null
    }
  }, [sessionId])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    isAvailable,
    sessionId,
    saveConversation,
    escalateToTicket,
  }
}
