/**
 * Chatwoot Webhook Endpoint
 *
 * POST /api/chatbot/chatwoot/webhook
 *
 * Receives events from Chatwoot when a customer sends a message.
 * Processes it through our RAG chatbot and sends the response back.
 * Hands off to human agent when:
 * - User explicitly asks for a human
 * - AI confidence is low (short/uncertain answers)
 * - Conversation exceeds max bot turns without resolution
 */

import { NextRequest, NextResponse } from 'next/server'
import { RAGChatbotService, type ChatbotMessage } from '@/features/ai/lib/RAGChatbotService'
import {
  sendBotMessage,
  handoffToHuman,
  getConversationMessages,
  addConversationLabels,
  isChatwootConfigured,
  type ChatwootWebhookPayload,
} from '@/lib/integrations/chatwoot/ChatwootService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Phrases that trigger human handoff (Dutch + English)
const HANDOFF_PHRASES = [
  'medewerker',
  'mens',
  'echte persoon',
  'iemand spreken',
  'doorverbinden',
  'human',
  'agent',
  'real person',
  'speak to someone',
  'helpdesk',
  'klantenservice',
  'bellen',
  'telefonisch',
]

// Max bot turns before suggesting handoff
const MAX_BOT_TURNS = 8

// Low confidence indicators in AI responses
const LOW_CONFIDENCE_PHRASES = [
  'ik weet het niet zeker',
  'ik kan je daar niet mee helpen',
  'ik heb daar geen informatie over',
  'neem contact op',
  'i\'m not sure',
  'i don\'t have information',
]

function shouldHandoff(userMessage: string): boolean {
  const lower = userMessage.toLowerCase()
  return HANDOFF_PHRASES.some((phrase) => lower.includes(phrase))
}

function isLowConfidence(aiResponse: string): boolean {
  const lower = aiResponse.toLowerCase()
  return LOW_CONFIDENCE_PHRASES.some((phrase) => lower.includes(phrase))
}

function buildConversationHistory(
  messages: Array<{ content: string; message_type: string; sender?: { type: string } }>,
): ChatbotMessage[] {
  return messages
    .filter((m) => m.message_type !== 'activity' && m.content)
    .slice(-10) // Last 10 messages for context
    .map((m) => ({
      role: (m.message_type === 'incoming' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    }))
}

export async function POST(req: NextRequest) {
  try {
    if (!isChatwootConfigured()) {
      return NextResponse.json(
        { error: 'Chatwoot not configured' },
        { status: 503 },
      )
    }

    const payload: ChatwootWebhookPayload = await req.json()

    // Only process new incoming messages from customers
    if (payload.event !== 'message_created') {
      return NextResponse.json({ ok: true })
    }

    // Skip outgoing messages (from agents or bot itself)
    if (payload.message_type !== 'incoming') {
      return NextResponse.json({ ok: true })
    }

    // Skip messages from agents
    if (payload.sender?.type === 'user') {
      return NextResponse.json({ ok: true })
    }

    const conversationId = payload.conversation?.id
    const userMessage = payload.content

    if (!conversationId || !userMessage) {
      return NextResponse.json({ ok: true })
    }

    // Check if conversation is already handed off to human (status: open)
    if (payload.conversation?.status === 'open') {
      // Human agent is handling — don't interfere
      return NextResponse.json({ ok: true })
    }

    // ── Check for explicit handoff request ──
    if (shouldHandoff(userMessage)) {
      await sendBotMessage(
        conversationId,
        'Ik schakel je door naar een medewerker. Een moment geduld alsjeblieft — er is zo iemand voor je beschikbaar.',
      )
      await handoffToHuman(conversationId, `Klant vroeg om medewerker: "${userMessage}"`)
      await addConversationLabels(conversationId, ['handoff-requested'])
      return NextResponse.json({ ok: true, action: 'handoff' })
    }

    // ── Get conversation history for RAG context ──
    const chatwootMessages = await getConversationMessages(conversationId)
    const conversationHistory = buildConversationHistory(chatwootMessages)

    // Check if bot has exceeded max turns
    const botTurns = chatwootMessages.filter(
      (m) => m.message_type === 'outgoing' && !m.private,
    ).length
    if (botTurns >= MAX_BOT_TURNS) {
      await sendBotMessage(
        conversationId,
        'Ik merk dat ik je nog niet helemaal heb kunnen helpen. Wil je dat ik je doorschakel naar een medewerker?',
        {
          contentType: 'input_select',
          contentAttributes: {
            items: [
              { title: 'Ja, schakel door', value: 'handoff_yes' },
              { title: 'Nee, ga door', value: 'handoff_no' },
            ],
          },
        },
      )
      return NextResponse.json({ ok: true, action: 'suggest_handoff' })
    }

    // ── Process through RAG chatbot ──
    const chatbot = new RAGChatbotService()
    const response = await chatbot.chat(userMessage, conversationHistory)

    // ── Check AI confidence ──
    if (isLowConfidence(response.answer)) {
      // Send AI response but offer handoff
      await sendBotMessage(conversationId, response.answer)

      // Add sources if available
      if (response.sources && response.sources.length > 0) {
        const sourceLinks = response.sources
          .map((s) => `- [${s.title}](${s.url})`)
          .join('\n')
        await sendBotMessage(
          conversationId,
          `📚 Mogelijk relevante bronnen:\n${sourceLinks}`,
        )
      }

      await sendBotMessage(
        conversationId,
        'Wil je dat ik je doorschakel naar een medewerker voor meer hulp?',
        {
          contentType: 'input_select',
          contentAttributes: {
            items: [
              { title: 'Ja, schakel door', value: 'handoff_yes' },
              { title: 'Nee, bedankt', value: 'handoff_no' },
            ],
          },
        },
      )
      await addConversationLabels(conversationId, ['low-confidence'])
      return NextResponse.json({ ok: true, action: 'low_confidence' })
    }

    // ── Send AI response ──
    let messageContent = response.answer

    // Append sources as links
    if (response.sources && response.sources.length > 0) {
      const sourceLinks = response.sources
        .slice(0, 3)
        .map((s) => `[${s.title}](${s.url})`)
        .join(' · ')
      messageContent += `\n\n📚 ${sourceLinks}`
    }

    await sendBotMessage(conversationId, messageContent)
    await addConversationLabels(conversationId, ['ai-handled'])

    return NextResponse.json({
      ok: true,
      action: 'ai_response',
      model: response.model,
    })
  } catch (error) {
    console.error('[Chatwoot Webhook] Error:', error)

    // Try to send fallback message
    try {
      const payload: ChatwootWebhookPayload = await req
        .clone()
        .json()
        .catch(() => null) as ChatwootWebhookPayload
      if (payload?.conversation?.id) {
        await sendBotMessage(
          payload.conversation.id,
          'Sorry, er ging iets mis. Ik schakel je door naar een medewerker.',
        )
        await handoffToHuman(
          payload.conversation.id,
          `Bot error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    } catch {
      // Fallback failed, just log
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    )
  }
}

// GET for health check
export async function GET() {
  return NextResponse.json({
    service: 'chatwoot-webhook',
    configured: isChatwootConfigured(),
    status: 'ok',
  })
}
