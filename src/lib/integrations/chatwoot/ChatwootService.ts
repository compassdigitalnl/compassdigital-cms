/**
 * Chatwoot API Service — Self-hosted Live Chat Integration
 *
 * Connects our RAG chatbot to Chatwoot for:
 * - AI-first responses (RAG handles first line)
 * - Human handoff when AI can't resolve or user requests it
 * - Conversation history & agent inbox
 *
 * Chatwoot runs locally via Docker at http://127.0.0.1:3000
 *
 * @see https://developers.chatwoot.com/api-reference
 */

const CHATWOOT_BASE_URL =
  process.env.CHATWOOT_BASE_URL || 'http://127.0.0.1:3000'
const CHATWOOT_BOT_TOKEN = process.env.CHATWOOT_BOT_TOKEN || ''
const CHATWOOT_USER_TOKEN = process.env.CHATWOOT_USER_TOKEN || ''
const CHATWOOT_ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID || '1'

interface ChatwootMessage {
  id: number
  content: string
  message_type: 'incoming' | 'outgoing' | 'activity'
  content_type: 'text' | 'input_select' | 'cards' | 'form'
  private: boolean
  conversation_id: number
  sender?: {
    id: number
    name: string
    email?: string
    type: 'contact' | 'user'
  }
  created_at: number
}

interface ChatwootConversation {
  id: number
  inbox_id: number
  status: 'open' | 'resolved' | 'pending' | 'snoozed'
  contact: {
    id: number
    name: string
    email?: string
  }
  messages: ChatwootMessage[]
  custom_attributes?: Record<string, unknown>
}

export interface ChatwootWebhookPayload {
  event: string
  id?: number
  content?: string
  message_type?: string
  content_type?: string
  conversation?: ChatwootConversation
  sender?: {
    id: number
    name: string
    email?: string
    type: string
  }
  account?: {
    id: number
  }
}

/**
 * Check if Chatwoot integration is configured
 */
export function isChatwootConfigured(): boolean {
  return !!(CHATWOOT_BOT_TOKEN && CHATWOOT_BASE_URL)
}

/**
 * Send a message to a Chatwoot conversation as the bot
 */
export async function sendBotMessage(
  conversationId: number,
  content: string,
  options?: {
    private?: boolean
    contentType?: 'text' | 'input_select'
    contentAttributes?: Record<string, unknown>
  },
): Promise<ChatwootMessage | null> {
  const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/messages`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_access_token: CHATWOOT_BOT_TOKEN,
      },
      body: JSON.stringify({
        content,
        message_type: 'outgoing',
        private: options?.private ?? false,
        content_type: options?.contentType ?? 'text',
        content_attributes: options?.contentAttributes ?? {},
      }),
    })

    if (!response.ok) {
      console.error(
        `[Chatwoot] Failed to send message: ${response.status} ${response.statusText}`,
      )
      return null
    }

    return (await response.json()) as ChatwootMessage
  } catch (error) {
    console.error('[Chatwoot] Error sending message:', error)
    return null
  }
}

/**
 * Hand off conversation to a human agent
 *
 * Sets status to 'open' so it appears in the agent inbox.
 * Optionally adds a private note for the agent with context.
 */
export async function handoffToHuman(
  conversationId: number,
  reason: string,
): Promise<boolean> {
  const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/toggle_status`

  try {
    // Toggle conversation to 'open' (visible in agent inbox)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_access_token: CHATWOOT_USER_TOKEN,
      },
      body: JSON.stringify({ status: 'open' }),
    })

    if (!response.ok) {
      console.error(
        `[Chatwoot] Failed to toggle status: ${response.status}`,
      )
      return false
    }

    // Add private note for the agent
    await sendBotMessage(conversationId, `🔄 **Doorgeschakeld naar medewerker**\n\nReden: ${reason}`, {
      private: true,
    })

    return true
  } catch (error) {
    console.error('[Chatwoot] Error handing off:', error)
    return false
  }
}

/**
 * Get conversation messages (for building RAG context)
 */
export async function getConversationMessages(
  conversationId: number,
): Promise<ChatwootMessage[]> {
  const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/messages`

  try {
    const response = await fetch(url, {
      headers: {
        api_access_token: CHATWOOT_USER_TOKEN,
      },
    })

    if (!response.ok) return []

    const data = (await response.json()) as { payload: ChatwootMessage[] }
    return data.payload || []
  } catch {
    return []
  }
}

/**
 * Add labels to a conversation (for tracking/filtering)
 */
export async function addConversationLabels(
  conversationId: number,
  labels: string[],
): Promise<void> {
  const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/labels`

  try {
    // Get existing labels first
    const getResp = await fetch(url, {
      headers: { api_access_token: CHATWOOT_USER_TOKEN },
    })
    const existing =
      getResp.ok ? ((await getResp.json()) as { payload: string[] }).payload : []

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_access_token: CHATWOOT_USER_TOKEN,
      },
      body: JSON.stringify({ labels: [...new Set([...existing, ...labels])] }),
    })
  } catch {
    // Labels are non-critical, ignore errors
  }
}
