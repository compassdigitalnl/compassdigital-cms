/**
 * Translation Service
 * AI-powered translation and multi-language content generation
 */

import { openai } from '../client'
import type {
  AIGenerationResult,
  ContentLanguage,
  TranslationResult,
  LanguageDetectionResult,
  MultiLanguageContent,
  TranslationOptions,
} from '../types'

class TranslationService {
  private model = process.env.AI_MODEL || 'gpt-4-turbo-preview'

  // Language configurations
  private readonly LANGUAGES = {
    nl: { name: 'Nederlands', nativeName: 'Nederlands' },
    en: { name: 'English', nativeName: 'English' },
    de: { name: 'German', nativeName: 'Deutsch' },
    fr: { name: 'French', nativeName: 'Français' },
    es: { name: 'Spanish', nativeName: 'Español' },
    it: { name: 'Italian', nativeName: 'Italiano' },
    pt: { name: 'Portuguese', nativeName: 'Português' },
  }

  /**
   * Translate content to target language
   */
  async translate(
    content: string,
    targetLanguage: ContentLanguage,
    options?: TranslationOptions
  ): Promise<AIGenerationResult<TranslationResult>> {
    try {
      const sourceLanguage = options?.sourceLanguage || 'auto'
      const tone = options?.tone || 'preserve'
      const formality = options?.formality || 'preserve'
      const preserveFormatting = options?.preserveFormatting ?? true

      const systemPrompt = `Je bent een professionele vertaler met expertise in ${this.LANGUAGES[targetLanguage]?.name || targetLanguage}.

Vertaal de gegeven tekst naar ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage}.

Regels:
1. Behoud de betekenis en context
2. ${tone === 'preserve' ? 'Behoud de originele toon' : `Pas de toon aan naar: ${tone}`}
3. ${formality === 'preserve' ? 'Behoud het formaliteitsniveau' : `Gebruik ${formality} formaliteit`}
4. ${preserveFormatting ? 'Behoud alle formatting (markdown, HTML tags, etc.)' : 'Focus op de tekst, formatting is niet belangrijk'}
5. Gebruik natuurlijke, native uitdrukkingen (geen letterlijke vertaling)
6. Pas waar nodig culturele referenties aan
7. Behoud merknamen, product namen en technische termen

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "translatedText": "De vertaalde tekst...",
  "detectedSourceLanguage": "nl",
  "confidence": 95,
  "notes": ["Opmerking over vertaling indien relevant"]
}`

      const userPrompt = sourceLanguage === 'auto'
        ? `Vertaal deze tekst naar ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage}:\n\n${content}`
        : `Vertaal deze ${this.LANGUAGES[sourceLanguage as ContentLanguage]?.nativeName || sourceLanguage} tekst naar ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage}:\n\n${content}`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const translation = JSON.parse(result) as TranslationResult

      return {
        success: true,
        data: translation,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Translation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed',
      }
    }
  }

  /**
   * Detect language of content
   */
  async detectLanguage(content: string): Promise<AIGenerationResult<LanguageDetectionResult>> {
    try {
      const systemPrompt = `Je bent een taaldetectie expert. Detecteer de taal van de gegeven tekst.

Analyseer:
1. Primaire taal
2. Secundaire talen (indien mixed-language content)
3. Confidence score (0-100)
4. Dialect/variant (indien relevant, bijv. British English, American English)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "primaryLanguage": "nl",
  "confidence": 98,
  "secondaryLanguages": [],
  "dialect": null,
  "notes": []
}`

      const userPrompt = `Detecteer de taal van deze tekst:\n\n${content.substring(0, 500)}` // First 500 chars is enough

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const detection = JSON.parse(result) as LanguageDetectionResult

      return {
        success: true,
        data: detection,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Language detection error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Language detection failed',
      }
    }
  }

  /**
   * Translate content to multiple languages at once
   */
  async translateMultiple(
    content: string,
    targetLanguages: ContentLanguage[],
    options?: TranslationOptions
  ): Promise<AIGenerationResult<MultiLanguageContent>> {
    try {
      // Translate to all target languages in parallel
      const translations = await Promise.all(
        targetLanguages.map(lang => this.translate(content, lang, options))
      )

      // Check if any translation failed
      const failed = translations.filter(t => !t.success)
      if (failed.length > 0) {
        throw new Error(`Some translations failed: ${failed.map(f => f.error).join(', ')}`)
      }

      // Build multi-language content object
      const multiLangContent: MultiLanguageContent = {
        original: content,
        translations: {},
      }

      targetLanguages.forEach((lang, index) => {
        const translation = translations[index]
        if (translation.success && translation.data) {
          multiLangContent.translations[lang] = {
            text: translation.data.translatedText,
            confidence: translation.data.confidence,
          }
        }
      })

      const totalTokens = translations.reduce((sum, t) => sum + (t.tokensUsed || 0), 0)

      return {
        success: true,
        data: multiLangContent,
        tokensUsed: totalTokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Multiple translation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Multiple translation failed',
      }
    }
  }

  /**
   * Generate content directly in target language
   */
  async generateInLanguage(
    prompt: string,
    targetLanguage: ContentLanguage,
    options?: {
      tone?: string
      context?: string
      maxTokens?: number
    }
  ): Promise<AIGenerationResult<string>> {
    try {
      const tone = options?.tone || 'professional'
      const maxTokens = options?.maxTokens || 1000

      const systemPrompt = `Je bent een expert content writer die perfect ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage} schrijft.

Schrijf natuurlijke, native ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage} content die klinkt alsof deze origineel in die taal is geschreven (NIET vertaald).

Tone: ${tone}
Taal: ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage}

Gebruik:
- Native uitdrukkingen en idiomen
- Cultureel relevante voorbeelden
- Natuurlijke zinsbouw
- Juiste spelling en grammatica voor deze taal`

      const userPrompt = options?.context
        ? `Context: ${options.context}\n\nSchrijf in ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage}: ${prompt}`
        : `Schrijf in ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage}: ${prompt}`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      return {
        success: true,
        data: content.trim(),
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Generate in language error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content generation failed',
      }
    }
  }

  /**
   * Localize content for specific region/culture
   */
  async localize(
    content: string,
    targetLanguage: ContentLanguage,
    options?: {
      region?: string
      culturalAdaptation?: 'minimal' | 'moderate' | 'extensive'
    }
  ): Promise<AIGenerationResult<TranslationResult>> {
    try {
      const region = options?.region || 'general'
      const adaptation = options?.culturalAdaptation || 'moderate'

      const systemPrompt = `Je bent een localisatie expert voor ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage} (${region}).

Lokaliseer de content voor de doelgroep in ${region}:

Level of cultural adaptation: ${adaptation}
- minimal: Alleen vertalen, minimale aanpassingen
- moderate: Aanpassen van culturele referenties waar nodig
- extensive: Complete herinterpretatie voor lokale context

Pas aan:
1. ${adaptation === 'extensive' ? 'Culturele referenties en voorbeelden' : adaptation === 'moderate' ? 'Duidelijk ongepaste culturele referenties' : 'Alleen taal'}
2. ${adaptation !== 'minimal' ? 'Datums, tijden, valuta formaten' : 'Taal'}
3. ${adaptation === 'extensive' ? 'Humor en idiomen' : 'Taal'}
4. ${adaptation !== 'minimal' ? 'Meet-eenheden' : 'Taal'}
5. Regionale spelling en terminologie

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "translatedText": "Gelokaliseerde tekst...",
  "detectedSourceLanguage": "en",
  "confidence": 95,
  "notes": ["Aangepast: culturele referentie naar lokale context"]
}`

      const userPrompt = `Lokaliseer deze content voor ${this.LANGUAGES[targetLanguage]?.nativeName || targetLanguage} in ${region}:\n\n${content}`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const localization = JSON.parse(result) as TranslationResult

      return {
        success: true,
        data: localization,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Localization error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Localization failed',
      }
    }
  }

  /**
   * Compare translations quality
   */
  async compareTranslations(
    original: string,
    translations: Array<{ language: ContentLanguage; text: string }>
  ): Promise<AIGenerationResult<Array<{ language: ContentLanguage; score: number; issues: string[] }>>> {
    try {
      const systemPrompt = `Je bent een vertaal-kwaliteit expert. Beoordeel de kwaliteit van vertalingen.

Beoordeel op:
1. Accuraatheid (betekenis correct overgebracht)
2. Natuurlijkheid (klinkt als native content)
3. Tone consistency (juiste toon)
4. Grammatica en spelling
5. Culturele gepastheid

Score: 0-100 per vertaling

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "evaluations": [
    {
      "language": "de",
      "score": 85,
      "issues": ["Kleine grammaticafout in zin 3", "Iets te formeel voor context"]
    }
  ]
}`

      const translationsText = translations
        .map(t => `[${t.language.toUpperCase()}]\n${t.text}`)
        .join('\n\n---\n\n')

      const userPrompt = `Origineel:\n${original}\n\n---\n\nVertalingen:\n${translationsText}\n\nBeoordeel elke vertaling.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const evaluation = JSON.parse(result)

      return {
        success: true,
        data: evaluation.evaluations,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Translation comparison error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Translation comparison failed',
      }
    }
  }

  /**
   * Get supported languages list
   */
  getSupportedLanguages(): Array<{ code: ContentLanguage; name: string; nativeName: string }> {
    return Object.entries(this.LANGUAGES).map(([code, info]) => ({
      code: code as ContentLanguage,
      name: info.name,
      nativeName: info.nativeName,
    }))
  }
}

// Export singleton instance
export const translationService = new TranslationService()
