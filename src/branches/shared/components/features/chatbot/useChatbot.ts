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
      } catch (err: any) {
        console.error('[Chatbot] Send message error:', err)
        setError(err.message || 'Er ging iets mis. Probeer het opnieuw.')

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

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    isAvailable,
    sessionId,
  }
}
