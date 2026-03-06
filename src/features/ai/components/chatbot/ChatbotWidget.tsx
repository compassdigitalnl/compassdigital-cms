'use client'

/**
 * AI Chatbot Widget
 *
 * Floating chatbot with RAG (Retrieval Augmented Generation).
 * Features:
 * - Guided conversation flows (multi-step intake)
 * - Knowledge base integration via Meilisearch
 * - Configurable position, colors, messages
 * - Source attribution
 * - Rate limiting
 * - Mobile responsive
 */

import React, { useState, useEffect, useRef } from 'react'
import { useChatbot } from './useChatbot'
import type { ChatbotMessage, ChatbotSettings, ConversationFlow } from './types'
import './ChatbotWidget.scss'

const FLOW_ICONS: Record<string, string> = {
  'shopping-bag': '\uD83D\uDECD\uFE0F',
  package: '\uD83D\uDCE6',
  search: '\uD83D\uDD0D',
  wrench: '\uD83D\uDD27',
  message: '\uD83D\uDCAC',
  heart: '\u2764\uFE0F',
  help: '\u2753',
  truck: '\uD83D\uDE9A',
  receipt: '\uD83E\uDDFE',
  star: '\u2B50',
}

interface FlowState {
  step: 'categories' | 'suboptions' | 'input'
  flowIndex: number
  subIndex: number
  context: string
  inputLabel: string
  inputPlaceholder: string
}

const INITIAL_FLOW_STATE: FlowState = {
  step: 'categories',
  flowIndex: -1,
  subIndex: -1,
  context: '',
  inputLabel: '',
  inputPlaceholder: '',
}

interface ChatbotWidgetProps {
  settings: ChatbotSettings
}

export function ChatbotWidget({ settings }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [flowState, setFlowState] = useState<FlowState>(INITIAL_FLOW_STATE)
  const [flowInput, setFlowInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation: _resetConversation,
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

  const flows = settings.conversationFlows
  const hasFlows = flows && flows.length > 0

  const resetConversation = () => {
    _resetConversation()
    setFlowState(INITIAL_FLOW_STATE)
    setFlowInput('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return
    await sendMessage(message)
    setMessage('')
  }

  // Flow: user clicks a top-level category
  const handleFlowCategory = async (flow: ConversationFlow, index: number) => {
    if (flow.type === 'direct') {
      const msg = flow.directMessage || flow.label
      await sendMessage(msg)
    } else if (flow.type === 'submenu') {
      setFlowState({
        ...INITIAL_FLOW_STATE,
        step: 'suboptions',
        flowIndex: index,
        context: flow.contextPrefix || '',
      })
    } else if (flow.type === 'input') {
      setFlowState({
        ...INITIAL_FLOW_STATE,
        step: 'input',
        flowIndex: index,
        context: flow.contextPrefix || flow.label,
        inputLabel: flow.inputLabel || 'Voer details in',
        inputPlaceholder: flow.inputPlaceholder || '',
      })
    }
  }

  // Flow: user clicks a sub-option
  const handleSubOption = async (flowIndex: number, subIndex: number) => {
    const flow = flows![flowIndex]
    const sub = flow.subOptions![subIndex]
    const prefix = flow.contextPrefix ? `${flow.contextPrefix} ` : ''

    if (sub.type === 'direct') {
      const msg = prefix + (sub.directMessage || sub.label)
      await sendMessage(msg)
    } else if (sub.type === 'input') {
      setFlowState({
        step: 'input',
        flowIndex,
        subIndex,
        context: prefix + sub.label,
        inputLabel: sub.inputLabel || 'Voer details in',
        inputPlaceholder: sub.inputPlaceholder || '',
      })
    }
  }

  // Flow: user submits input (e.g. order number)
  const handleFlowInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let msg = flowState.context
    if (flowInput.trim()) {
      msg += ` (${flowInput.trim()})`
    }
    setFlowInput('')
    await sendMessage(msg)
  }

  // Flow: user skips input
  const handleFlowInputSkip = async () => {
    await sendMessage(flowState.context)
    setFlowInput('')
  }

  // Determine button position classes
  const positionClass = settings.position || 'bottom-right'

  // Button icon component
  const ButtonIcon = () => {
    switch (settings.buttonIcon) {
      case 'robot':
        return <span className="chatbot-icon">{'\uD83E\uDD16'}</span>
      case 'lightbulb':
        return <span className="chatbot-icon">{'\uD83D\uDCA1'}</span>
      case 'question':
        return <span className="chatbot-icon">{'\u2753'}</span>
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

  // Render message content with optional avatar
  const renderMessageContent = (msg: ChatbotMessage) => {
    const content = (
      <div className="chatbot-message-content">
        {msg.content}
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
    )

    if (msg.role === 'assistant' && settings.avatarImage?.url) {
      return (
        <div className="chatbot-message-row">
          <img
            src={settings.avatarImage.url}
            alt={settings.avatarImage.alt || 'Assistant'}
            className="chatbot-msg-avatar"
          />
          {content}
        </div>
      )
    }

    return content
  }

  // Render welcome screen with flows or legacy suggested questions
  const renderWelcome = () => {
    // Flow: input collection step
    if (hasFlows && flowState.step === 'input') {
      return (
        <div className="chatbot-welcome chatbot-flow-input">
          <button
            className="chatbot-flow-back"
            onClick={() => {
              setFlowInput('')
              if (flowState.subIndex >= 0) {
                setFlowState({ ...flowState, step: 'suboptions', subIndex: -1 })
              } else {
                setFlowState(INITIAL_FLOW_STATE)
              }
            }}
          >
            &larr; Terug
          </button>
          <p className="chatbot-flow-input-label">{flowState.inputLabel}</p>
          <form onSubmit={handleFlowInputSubmit} className="chatbot-flow-input-form">
            <input
              type="text"
              value={flowInput}
              onChange={(e) => setFlowInput(e.target.value)}
              placeholder={flowState.inputPlaceholder}
              className="chatbot-input"
              autoFocus
            />
            <button type="submit" className="chatbot-flow-submit" disabled={isLoading}>
              Verstuur
            </button>
          </form>
          <button
            className="chatbot-flow-skip"
            onClick={handleFlowInputSkip}
            disabled={isLoading}
          >
            Overslaan
          </button>
        </div>
      )
    }

    // Flow: sub-options step
    if (hasFlows && flowState.step === 'suboptions' && flowState.flowIndex >= 0) {
      const flow = flows![flowState.flowIndex]
      const subs = flow.subOptions || []
      return (
        <div className="chatbot-welcome">
          <button
            className="chatbot-flow-back"
            onClick={() => setFlowState(INITIAL_FLOW_STATE)}
          >
            &larr; Terug
          </button>
          <p className="chatbot-flow-subtitle">
            {flow.label}
          </p>
          <div className="chatbot-flows">
            {subs.map((sub, idx) => (
              <button
                key={idx}
                className="chatbot-flow-btn"
                onClick={() => handleSubOption(flowState.flowIndex, idx)}
                disabled={isLoading}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )
    }

    // Flow: top-level categories
    if (hasFlows) {
      return (
        <div className="chatbot-welcome">
          <p>{settings.welcomeMessage || 'Welkom! Waar kunnen we je mee helpen?'}</p>
          <div className="chatbot-flows">
            {flows!.map((flow, idx) => (
              <button
                key={idx}
                className="chatbot-flow-btn"
                onClick={() => handleFlowCategory(flow, idx)}
                disabled={isLoading}
              >
                {flow.icon && (
                  <span className="chatbot-flow-icon">
                    {FLOW_ICONS[flow.icon] || ''}
                  </span>
                )}
                {flow.label}
              </button>
            ))}
          </div>
        </div>
      )
    }

    // Legacy: simple suggested questions
    return (
      <div className="chatbot-welcome">
        <p>{settings.welcomeMessage || 'Hallo! Hoe kan ik je helpen?'}</p>
        {settings.suggestedQuestions && settings.suggestedQuestions.length > 0 && (
          <div className="chatbot-suggestions">
            <p className="chatbot-suggestions-title">Veelgestelde vragen:</p>
            {settings.suggestedQuestions.map((item, index) => (
              <button
                key={index}
                onClick={() => sendMessage(item.question)}
                className="chatbot-suggestion"
                disabled={isLoading}
              >
                {item.question}
              </button>
            ))}
          </div>
        )}
      </div>
    )
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
            <div className="chatbot-header-info">
              {settings.avatarImage?.url && (
                <img
                  src={settings.avatarImage.url}
                  alt={settings.avatarImage.alt || 'Chat assistant'}
                  className="chatbot-avatar"
                />
              )}
              <h3>Chat Assistant</h3>
            </div>
            <div className="chatbot-header-actions">
              {messages.length > 0 && (
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
            {messages.length === 0 && renderWelcome()}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message chatbot-message-${msg.role}`}
              >
                {renderMessageContent(msg)}
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message chatbot-message-assistant">
                {settings.avatarImage?.url ? (
                  <div className="chatbot-message-row">
                    <img
                      src={settings.avatarImage.url}
                      alt={settings.avatarImage.alt || 'Assistant'}
                      className="chatbot-msg-avatar"
                    />
                    <div className="chatbot-message-content">
                      <div className="chatbot-loading">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="chatbot-message-content">
                    <div className="chatbot-loading">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="chatbot-error">
                <p>{error}</p>
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
