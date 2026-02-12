/**
 * AI Prompt Engineering
 * Centralized prompts for consistent AI generation
 */

import type { ContentTone, ContentLanguage } from './types'

interface PromptContext {
  businessName?: string
  industry?: string
  targetAudience?: string
  brandVoice?: string
}

/**
 * System prompts for different AI tasks
 */
export const SYSTEM_PROMPTS = {
  contentWriter: `You are a professional content writer specializing in creating engaging, SEO-optimized content for business websites. You write clear, persuasive copy that converts visitors into customers.`,

  seoExpert: `You are an SEO expert who analyzes content and provides actionable recommendations to improve search engine rankings and readability.`,

  blockSuggester: `You are a UX expert who suggests optimal page layouts and content blocks based on best practices and conversion optimization principles.`,

  imageDescriptor: `You are a creative director who writes detailed, specific image generation prompts that result in professional, brand-aligned visuals.`,
} as const

/**
 * Generate content prompt with context
 */
export function buildContentPrompt(
  userPrompt: string,
  tone: ContentTone = 'professional',
  language: ContentLanguage = 'nl',
  context?: PromptContext,
): string {
  const toneInstructions = {
    professional: 'professional and authoritative',
    casual: 'casual and conversational',
    friendly: 'friendly and approachable',
    formal: 'formal and sophisticated',
    enthusiastic: 'enthusiastic and energetic',
    persuasive: 'persuasive and compelling',
  }

  const languageNames = {
    nl: 'Dutch',
    en: 'English',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
  }

  let prompt = `Write content in ${languageNames[language]} with a ${toneInstructions[tone]} tone.\n\n`

  if (context) {
    if (context.businessName) {
      prompt += `Business: ${context.businessName}\n`
    }
    if (context.industry) {
      prompt += `Industry: ${context.industry}\n`
    }
    if (context.targetAudience) {
      prompt += `Target audience: ${context.targetAudience}\n`
    }
    if (context.brandVoice) {
      prompt += `Brand voice: ${context.brandVoice}\n`
    }
    prompt += `\n`
  }

  prompt += `Task: ${userPrompt}\n\n`
  prompt += `Requirements:\n`
  prompt += `- Write clear, concise content\n`
  prompt += `- Use active voice\n`
  prompt += `- Include relevant keywords naturally\n`
  prompt += `- Make it scannable with good structure\n`
  prompt += `- Focus on benefits, not just features\n`
  prompt += `- End with a clear call-to-action when appropriate\n`

  return prompt
}

/**
 * Generate image generation prompt
 */
export function buildImagePrompt(
  description: string,
  style: 'modern' | 'minimalist' | 'professional' | 'creative' | 'corporate' = 'professional',
  colors?: string[],
): string {
  const styleDescriptions = {
    modern: 'modern, clean, contemporary design with bold colors and geometric shapes',
    minimalist: 'minimalist, simple, clean design with lots of white space',
    professional:
      'professional, business-appropriate, polished design with corporate aesthetics',
    creative: 'creative, artistic, unique design with bold visual elements',
    corporate: 'corporate, sophisticated, trustworthy design with muted colors',
  }

  let prompt = `Create a ${styleDescriptions[style]}. `
  prompt += description
  prompt += `. High quality, professional photography or illustration.`

  if (colors && colors.length > 0) {
    prompt += ` Color palette: ${colors.join(', ')}.`
  }

  prompt += ` No text or typography in the image.`

  return prompt
}

/**
 * Generate SEO analysis prompt
 */
export function buildSEOPrompt(content: string, targetKeywords?: string[]): string {
  let prompt = `Analyze the following content for SEO optimization:\n\n`
  prompt += `${content}\n\n`

  if (targetKeywords && targetKeywords.length > 0) {
    prompt += `Target keywords: ${targetKeywords.join(', ')}\n\n`
  }

  prompt += `Provide:\n`
  prompt += `1. SEO score (0-100)\n`
  prompt += `2. Issues found (warnings, errors)\n`
  prompt += `3. Specific suggestions for improvement\n`
  prompt += `4. Keyword usage analysis\n`
  prompt += `5. Readability assessment\n\n`
  prompt += `Format response as JSON.`

  return prompt
}

/**
 * Generate block suggestion prompt
 */
export function buildBlockSuggestionPrompt(
  currentBlocks: string[],
  pageType: string,
  industry?: string,
): string {
  let prompt = `Suggest the next best content block for a ${pageType} page`

  if (industry) {
    prompt += ` in the ${industry} industry`
  }

  prompt += `.\n\n`
  prompt += `Current blocks on page:\n`
  currentBlocks.forEach((block, idx) => {
    prompt += `${idx + 1}. ${block}\n`
  })

  prompt += `\nAvailable block types:\n`
  prompt += `- hero: Hero section with title, subtitle, and CTA buttons\n`
  prompt += `- services: Service offerings in grid layout\n`
  prompt += `- stats: Key statistics and achievements\n`
  prompt += `- testimonials: Customer reviews and ratings\n`
  prompt += `- caseGrid: Portfolio/project showcase\n`
  prompt += `- faq: Frequently asked questions\n`
  prompt += `- cta: Call-to-action section\n`
  prompt += `- content: Rich text content block\n`
  prompt += `- twoColumn: Two-column layout (text + image)\n`

  prompt += `\nSuggest 1-3 blocks that would enhance this page. Format response as JSON array.`

  return prompt
}

/**
 * Generate complete page prompt
 */
export function buildCompletePagePrompt(
  pageType: string,
  businessInfo: PromptContext,
  additionalInfo?: string,
): string {
  let prompt = `Generate a complete ${pageType} page structure with all content.\n\n`

  prompt += `Business Information:\n`
  if (businessInfo.businessName) prompt += `- Name: ${businessInfo.businessName}\n`
  if (businessInfo.industry) prompt += `- Industry: ${businessInfo.industry}\n`
  if (businessInfo.targetAudience) prompt += `- Audience: ${businessInfo.targetAudience}\n`
  if (businessInfo.brandVoice) prompt += `- Voice: ${businessInfo.brandVoice}\n`

  if (additionalInfo) {
    prompt += `\nAdditional context: ${additionalInfo}\n`
  }

  prompt += `\nGenerate:\n`
  prompt += `1. Page title and meta description\n`
  prompt += `2. Recommended blocks in order\n`
  prompt += `3. Content for each block\n`
  prompt += `4. CTA text and links\n`
  prompt += `5. Image descriptions for each visual element\n\n`
  prompt += `Format response as JSON with structured data.`

  return prompt
}

/**
 * Generate FAQ prompt
 */
export function buildFAQPrompt(topic: string, count: number = 5, language: ContentLanguage = 'nl'): string {
  const languageNames = {
    nl: 'Dutch',
    en: 'English',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
  }

  let prompt = `Generate ${count} frequently asked questions and detailed answers about "${topic}" in ${languageNames[language]}.\n\n`
  prompt += `Requirements:\n`
  prompt += `- Questions should be common customer concerns\n`
  prompt += `- Answers should be helpful and detailed (2-3 sentences)\n`
  prompt += `- Use clear, simple language\n`
  prompt += `- Include actionable information\n\n`
  prompt += `Format as JSON array with question and answer fields.`

  return prompt
}
