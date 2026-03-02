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
      systemPrompt: settingsDoc.systemPrompt || undefined,
      trainingContext: settingsDoc.trainingContext || undefined,
      knowledgeBaseIntegration: settingsDoc.knowledgeBaseIntegration ? {
        enabled: settingsDoc.knowledgeBaseIntegration.enabled ?? true,
        maxResults: settingsDoc.knowledgeBaseIntegration.maxResults ?? 3,
        includeSourceLinks: settingsDoc.knowledgeBaseIntegration.includeSourceLinks ?? true,
        searchCollections: (settingsDoc.knowledgeBaseIntegration.searchCollections || ['blog-posts', 'pages']) as string[],
      } : {
        enabled: true,
        maxResults: 3,
        includeSourceLinks: true,
        searchCollections: ['blog-posts', 'pages'],
      },
      rateLimiting: settingsDoc.rateLimiting ? {
        enabled: settingsDoc.rateLimiting.enabled ?? false,
        maxMessagesPerHour: settingsDoc.rateLimiting.maxMessagesPerHour ?? 20,
        maxMessagesPerDay: settingsDoc.rateLimiting.maxMessagesPerDay ?? 100,
        cooldownSeconds: settingsDoc.rateLimiting.cooldownSeconds ?? 3,
        blockedIPs: settingsDoc.rateLimiting.blockedIPs,
      } as any : undefined,
      moderation: settingsDoc.moderation ? {
        enabled: settingsDoc.moderation.enabled ?? false,
        blockedKeywords: settingsDoc.moderation.blockedKeywords,
      } as any : undefined,
      fallback: settingsDoc.fallback ? {
        enableFallback: settingsDoc.fallback.enableFallback ?? true,
        fallbackMessage: settingsDoc.fallback.fallbackMessage ?? 'Sorry, ik kan je vraag niet beantwoorden.',
        contactEmail: settingsDoc.fallback.contactEmail,
      } as any : undefined,
      analytics: settingsDoc.analytics ? {
        enableLogging: settingsDoc.analytics.enableLogging ?? true,
        enableAnalytics: settingsDoc.analytics.enableAnalytics ?? true,
        retentionDays: settingsDoc.analytics.retentionDays ?? 30,
      } as any : undefined,
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
