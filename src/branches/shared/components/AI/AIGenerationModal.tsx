'use client'

/**
 * AI Generation Modal
 * Modal for AI content generation with preview and edit
 */

import React, { useState } from 'react'
import { X, Copy, Check, RefreshCw } from 'lucide-react'

interface AIGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (content: string) => void
  title: string
  prompt?: string
  generatedContent?: string
  loading?: boolean
  error?: string
  onRegenerate?: () => void
}

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  title,
  prompt = '',
  generatedContent = '',
  loading = false,
  error = '',
  onRegenerate,
}) => {
  const [editedContent, setEditedContent] = useState(generatedContent)
  const [copied, setCopied] = useState(false)

  React.useEffect(() => {
    setEditedContent(generatedContent)
  }, [generatedContent])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAccept = () => {
    onAccept(editedContent)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Prompt Display */}
          {prompt && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-1">Prompt:</p>
              <p className="text-sm text-purple-700">{prompt}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto" />
                <p className="text-gray-600">AI is aan het genereren...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-900 mb-1">Error:</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Generated Content */}
          {!loading && !error && generatedContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Gegenereerde content:
                </label>
                <div className="flex gap-2">
                  {onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <RefreshCw size={14} />
                      Regenereer
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Gekopieerd!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Kopieer
                      </>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y font-mono text-sm"
                placeholder="Gegenereerde content verschijnt hier..."
              />
              <p className="text-xs text-gray-500">
                Je kunt de content bewerken voordat je deze accepteert
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuleer
          </button>
          <button
            onClick={handleAccept}
            disabled={!editedContent || loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accepteer & Gebruik
          </button>
        </div>
      </div>
    </div>
  )
}
