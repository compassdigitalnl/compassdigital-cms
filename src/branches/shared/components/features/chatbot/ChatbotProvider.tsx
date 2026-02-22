/**
 * Chatbot Provider Component
 *
 * Fetches chatbot settings from Payload CMS and renders ChatbotWidget.
 * Add this to RootLayout to enable chatbot on all pages.
 *
 * Usage:
 * ```tsx
 * import { ChatbotProvider } from '@/branches/shared/components/features/chatbot'
 *
 * export default async function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ChatbotProvider />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { ChatbotWidget } from './ChatbotWidget'
import type { ChatbotSettings } from './types'

export async function ChatbotProvider() {
  // Check feature flag
  if (!isFeatureEnabled('chatbot')) {
    return null
  }

  try {
    // Fetch settings from Payload
    const payload = await getPayload({ config })
    const settingsDoc = await payload.findGlobal({
      slug: 'chatbot-settings',
      depth: 0,
    })

    // Map Payload settings to component props
    const settings: ChatbotSettings = {
      enabled: settingsDoc.enabled ?? true,
      model: settingsDoc.model || 'groq',
      temperature: settingsDoc.temperature ?? 0.7,
      maxTokens: settingsDoc.maxTokens ?? 500,
      contextWindow: settingsDoc.contextWindow ?? 5,
      position: settingsDoc.position || 'bottom-right',
      buttonColor: settingsDoc.buttonColor || '#0ea5e9',
      buttonIcon: settingsDoc.buttonIcon || 'chat',
      welcomeMessage: settingsDoc.welcomeMessage || 'Hallo! Hoe kan ik je helpen?',
      placeholder: settingsDoc.placeholder || 'Typ je vraag...',
      suggestedQuestions: settingsDoc.suggestedQuestions || [],
      systemPrompt: settingsDoc.systemPrompt,
      trainingContext: settingsDoc.trainingContext,
      knowledgeBaseIntegration: settingsDoc.knowledgeBaseIntegration || {
        enabled: true,
        maxResults: 3,
        includeSourceLinks: true,
        searchCollections: ['blog-posts', 'pages'],
      },
      rateLimiting: settingsDoc.rateLimiting,
      moderation: settingsDoc.moderation,
      fallback: settingsDoc.fallback,
      analytics: settingsDoc.analytics,
    }

    // Don't render if disabled in settings
    if (!settings.enabled) {
      return null
    }

    return <ChatbotWidget settings={settings} />
  } catch (error) {
    console.error('[ChatbotProvider] Failed to load settings:', error)
    return null
  }
}
