/**
 * AI Review Moderation Service
 *
 * Uses Groq (Llama 3.3 70B) for fast, free review moderation.
 * Analyzes reviews for: sentiment, toxicity, relevance, fake detection.
 * Returns a moderation score (0-100) and recommended action.
 *
 * Auto-approve: score >= 70
 * Manual review: score 30-69
 * Auto-reject: score < 30
 */

import { GroqClient } from './GroqClient'
import type { ChatMessage } from './GroqClient'

export interface ModerationResult {
  score: number // 0-100 overall quality score
  sentiment: 'positive' | 'neutral' | 'negative'
  toxicity: number // 0-100
  isFake: boolean
  topics: string[]
  summary: string
  action: 'approve' | 'review' | 'reject'
}

interface ReviewInput {
  title?: string
  comment: string
  rating: number
  authorName: string
  productName?: string
}

const SYSTEM_PROMPT = `Je bent een AI-moderator voor productreviews op een Nederlandse e-commerce website.
Analyseer de review en geef een JSON-object terug met exact deze velden:

{
  "score": <0-100 kwaliteitsscore>,
  "sentiment": "<positive|neutral|negative>",
  "toxicity": <0-100 toxiciteitsscore>,
  "isFake": <true|false>,
  "topics": ["<onderwerp1>", "<onderwerp2>"],
  "summary": "<korte samenvatting in het Nederlands>"
}

Scoringsregels:
- score 80-100: Duidelijke, nuttige review met relevante details
- score 60-79: Acceptabele review, weinig detail
- score 40-59: Twijfelachtig, mogelijk irrelevant of kort
- score 20-39: Waarschijnlijk spam, ongerelateerd, of verdacht
- score 0-19: Duidelijk spam, beledigend, of fake

Toxiciteitsregels:
- 0-20: Veilig en constructief
- 21-50: Licht negatief maar acceptabel
- 51-80: Beledigend of ongepast taalgebruik
- 81-100: Zeer toxisch, haatdragend of bedreigend

Fake-detectie: Markeer als fake bij:
- Generieke tekst zonder productspecifieke details
- Overdreven positief/negatief zonder onderbouwing
- Kopieer-plak patronen of onnatuurlijk taalgebruik

Topics: Extraheer maximaal 5 relevante onderwerpen zoals: kwaliteit, levering, prijs, verpakking, klantenservice, gebruiksgemak, uiterlijk, duurzaamheid.

BELANGRIJK: Geef ALLEEN het JSON-object terug, geen andere tekst.`

export class ReviewModerator {
  private groq: GroqClient | null = null

  private getClient(): GroqClient {
    if (!this.groq) {
      this.groq = new GroqClient()
    }
    return this.groq
  }

  /**
   * Check if AI moderation is available (Groq API key configured)
   */
  isAvailable(): boolean {
    return !!process.env.GROQ_API_KEY
  }

  /**
   * Moderate a review using AI
   */
  async moderate(review: ReviewInput): Promise<ModerationResult> {
    if (!this.isAvailable()) {
      // Fallback: no AI, return neutral result for manual review
      return {
        score: 50,
        sentiment: 'neutral',
        toxicity: 0,
        isFake: false,
        topics: [],
        summary: 'AI-moderatie niet beschikbaar (geen GROQ_API_KEY)',
        action: 'review',
      }
    }

    const client = this.getClient()

    const userMessage = this.buildUserMessage(review)

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ]

    try {
      const response = await client.chat(messages, {
        temperature: 0.1, // Low temperature for consistent moderation
        maxTokens: 300,
        model: 'llama-3.3-70b-versatile',
      })

      const parsed = this.parseResponse(response.content)
      return {
        ...parsed,
        action: this.determineAction(parsed.score, parsed.toxicity),
      }
    } catch (error) {
      console.error('[ReviewModerator] AI moderation failed:', error)
      // Fallback on error: queue for manual review
      return {
        score: 50,
        sentiment: 'neutral',
        toxicity: 0,
        isFake: false,
        topics: [],
        summary: `AI-moderatie mislukt: ${error instanceof Error ? error.message : 'onbekende fout'}`,
        action: 'review',
      }
    }
  }

  /**
   * Build the user message for the AI
   */
  private buildUserMessage(review: ReviewInput): string {
    const parts: string[] = []

    if (review.productName) {
      parts.push(`Product: ${review.productName}`)
    }
    parts.push(`Beoordeling: ${review.rating}/5 sterren`)
    parts.push(`Auteur: ${review.authorName}`)
    if (review.title) {
      parts.push(`Titel: ${review.title}`)
    }
    parts.push(`Review: ${review.comment}`)

    return parts.join('\n')
  }

  /**
   * Parse the AI response JSON
   */
  private parseResponse(content: string): Omit<ModerationResult, 'action'> {
    try {
      // Extract JSON from response (handle potential markdown wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])

      return {
        score: Math.min(100, Math.max(0, Number(parsed.score) || 50)),
        sentiment: ['positive', 'neutral', 'negative'].includes(parsed.sentiment)
          ? parsed.sentiment
          : 'neutral',
        toxicity: Math.min(100, Math.max(0, Number(parsed.toxicity) || 0)),
        isFake: Boolean(parsed.isFake),
        topics: Array.isArray(parsed.topics) ? parsed.topics.slice(0, 5) : [],
        summary: String(parsed.summary || ''),
      }
    } catch (error) {
      console.error('[ReviewModerator] Failed to parse AI response:', content)
      return {
        score: 50,
        sentiment: 'neutral',
        toxicity: 0,
        isFake: false,
        topics: [],
        summary: 'AI-response kon niet worden geparsed',
      }
    }
  }

  /**
   * Determine action based on score and toxicity
   */
  private determineAction(score: number, toxicity: number): 'approve' | 'review' | 'reject' {
    // High toxicity always requires manual review or rejection
    if (toxicity >= 70) return 'reject'
    if (toxicity >= 40) return 'review'

    // Score-based action
    if (score >= 70) return 'approve'
    if (score >= 30) return 'review'
    return 'reject'
  }
}

// Singleton instance
let _moderator: ReviewModerator | null = null

export function getReviewModerator(): ReviewModerator {
  if (!_moderator) {
    _moderator = new ReviewModerator()
  }
  return _moderator
}
