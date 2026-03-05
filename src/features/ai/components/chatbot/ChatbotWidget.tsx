'use client'

/**
 * AI Chatbot Widget
 *
 * Floating chatbot with RAG (Retrieval Augmented Generation).
 * Features:
 * - Knowledge base integration via Meilisearch
 * - Configurable position, colors, messages
 * - Source attribution
 * - Rate limiting
 * - Mobile responsive
 */

import React, { useState, useEffect, useRef } from 'react'
import { useChatbot } from './useChatbot'
import type { ChatbotMessage, ChatbotSettings } from './types'
import './ChatbotWidget.scss'

interface ChatbotWidgetProps {
  settings: ChatbotSettings
}

export function ChatbotWidget({ settings }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    isAvailable,
  } = useChatbot()

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Don't render if disabled or not available
  if (!settings.enabled || !isAvailable) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isLoading) return

    await sendMessage(message)
    setMessage('')
  }

  const handleSuggestedQuestion = async (question: string) => {
    await sendMessage(question)
  }

  // Determine button position classes
  const positionClass = settings.position || 'bottom-right'

  // Button icon component
  const ButtonIcon = () => {
    switch (settings.buttonIcon) {
      case 'robot':
        return <span className="chatbot-icon">🤖</span>
      case 'lightbulb':
        return <span className="chatbot-icon">💡</span>
      case 'question':
        return <span className="chatbot-icon">❓</span>
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="chatbot-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        )
    }
  }

  return (
    <div className={`chatbot-widget ${positionClass}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-button"
          style={{ backgroundColor: settings.buttonColor || '#0ea5e9' }}
          aria-label="Open chatbot"
        >
          <ButtonIcon />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div
            className="chatbot-header"
            style={{ backgroundColor: settings.buttonColor || '#0ea5e9' }}
          >
            <h3>Chat Assistant</h3>
            <div className="chatbot-header-actions">
              {messages.length > 1 && (
                <button
                  onClick={resetConversation}
                  className="chatbot-reset"
                  title="Start nieuw gesprek"
                  aria-label="Reset conversation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-close"
                aria-label="Close chatbot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <p>{settings.welcomeMessage || 'Hallo! Hoe kan ik je helpen?'}</p>

                {/* Suggested Questions */}
                {settings.suggestedQuestions && settings.suggestedQuestions.length > 0 && (
                  <div className="chatbot-suggestions">
                    <p className="chatbot-suggestions-title">Veelgestelde vragen:</p>
                    {settings.suggestedQuestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(item.question)}
                        className="chatbot-suggestion"
                        disabled={isLoading}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message chatbot-message-${msg.role}`}
              >
                <div className="chatbot-message-content">
                  {msg.content}

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="chatbot-sources">
                      <p className="chatbot-sources-title">Bronnen:</p>
                      <ul>
                        {msg.sources.map((source, idx) => (
                          <li key={idx}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {source.title}
                            </a>
                            {source.excerpt && (
                              <p className="chatbot-source-excerpt">{source.excerpt}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Model & Cost Info (alleen voor assistant messages) */}
                {msg.role === 'assistant' && msg.model && (
                  <div className="chatbot-message-meta">
                    <span className="chatbot-model">
                      {msg.model.includes('groq') && '⚡ Groq'}
                      {msg.model.includes('gpt-4') && '🤖 GPT-4'}
                      {msg.model.includes('gpt-3.5') && '💡 GPT-3.5'}
                      {msg.model.includes('ollama') && '🏠 Ollama'}
                    </span>
                    {msg.cost !== undefined && msg.cost > 0 && (
                      <span className="chatbot-cost">€{msg.cost.toFixed(4)}</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message chatbot-message-assistant">
                <div className="chatbot-message-content">
                  <div className="chatbot-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="chatbot-error">
                <p>❌ {error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={settings.placeholder || 'Typ je vraag...'}
              className="chatbot-input"
              disabled={isLoading}
              maxLength={1000}
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={isLoading || !message.trim()}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>

          {/* Footer */}
          <div className="chatbot-footer">
            <p>
              Powered by AI •{' '}
              {messages.length > 0 && `${messages.filter((m) => m.role === 'user').length} berichten`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
