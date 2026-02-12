'use client'

/**
 * AI Field Wrapper
 * Wraps Payload fields with AI generation capability
 */

import React, { useState } from 'react'
import { AIButton } from './AIButton'
import { AIGenerationModal } from './AIGenerationModal'

interface AIFieldWrapperProps {
  fieldName: string
  fieldLabel: string
  currentValue?: string
  onGenerate: (prompt: string) => Promise<{ success: boolean; content?: string; error?: string }>
  onValueChange: (value: string) => void
  promptPlaceholder?: string
  children: React.ReactNode
}

export const AIFieldWrapper: React.FC<AIFieldWrapperProps> = ({
  fieldName,
  fieldLabel,
  currentValue = '',
  onGenerate,
  onValueChange,
  promptPlaceholder = 'Beschrijf wat je wilt genereren...',
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Voer een prompt in')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedContent('')

    try {
      const result = await onGenerate(prompt)

      if (result.success && result.content) {
        setGeneratedContent(result.content)
      } else {
        setError(result.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setPrompt(currentValue || '')
    setGeneratedContent('')
    setError('')
    setIsModalOpen(true)
  }

  const handleAccept = (content: string) => {
    onValueChange(content)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{fieldLabel}</label>
        <AIButton onClick={handleOpenModal} size="sm" variant="secondary">
          AI Genereren
        </AIButton>
      </div>

      {children}

      <AIGenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAccept}
        title={`AI Genereren: ${fieldLabel}`}
        prompt={prompt}
        generatedContent={generatedContent}
        loading={loading}
        error={error}
        onRegenerate={handleGenerate}
      />
    </div>
  )
}
