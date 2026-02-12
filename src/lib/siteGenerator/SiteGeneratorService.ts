/**
 * Site Generator Service
 * Orchestrates the entire site generation process
 */

import type {
  WizardState,
  GeneratedSite,
  GeneratedPage,
  PageGenerationContext,
  BlockGenerationContext,
} from './types'
import { getAIClient } from '@/lib/ai/client'
import type OpenAI from 'openai'
import { PayloadService } from './PayloadService'

export class SiteGeneratorService {
  private ai: OpenAI
  private payloadService: PayloadService
  private onProgress?: (progress: number, message: string) => void

  constructor(onProgress?: (progress: number, message: string) => void) {
    this.ai = getAIClient()
    this.payloadService = new PayloadService()
    this.onProgress = onProgress
  }

  /**
   * Main orchestration method - generates complete site
   */
  async generateSite(wizardData: WizardState): Promise<GeneratedSite> {
    const pages: GeneratedPage[] = []
    let currentProgress = 0

    try {
      // Step 1: Generate business context (10%)
      this.reportProgress(10, 'Analyseren van bedrijfsinformatie...')
      const businessContext = await this.generateBusinessContext(wizardData)

      // Step 2: Generate pages based on selection
      const totalPages = wizardData.content.pages.length
      const progressPerPage = 60 / totalPages // 60% of total for page generation

      for (let i = 0; i < wizardData.content.pages.length; i++) {
        const pageType = wizardData.content.pages[i]
        currentProgress = 10 + (i * progressPerPage)

        this.reportProgress(
          Math.floor(currentProgress),
          `Genereren van ${pageType} pagina (${i + 1}/${totalPages})...`,
        )

        const page = await this.generatePage(pageType, wizardData, businessContext)
        pages.push(page)
      }

      // Step 3: Optimize SEO (70-85%)
      this.reportProgress(75, 'SEO optimalisatie...')
      await this.optimizeAllSEO(pages, wizardData)

      // Step 4: Generate images if needed (85-90%)
      this.reportProgress(85, 'Afbeeldingen voorbereiden...')
      // Image generation will be added later

      // Step 5: Save to Payload (90-100%)
      this.reportProgress(90, 'Opslaan in database...')
      const payloadResult = await this.payloadService.saveGeneratedSite(pages, wizardData)

      this.reportProgress(100, 'Site generatie voltooid!')

      return {
        jobId: `site-${Date.now()}`,
        status: 'completed',
        progress: 100,
        currentStep: 'Completed',
        pages: payloadResult.pages,
        previewUrl: payloadResult.previewUrl,
      }
    } catch (error) {
      console.error('[SiteGenerator] Error:', error)
      throw error
    }
  }

  /**
   * Generate business context summary using AI
   */
  private async generateBusinessContext(wizardData: WizardState): Promise<string> {
    const { companyInfo, design, content } = wizardData

    const servicesInfo = companyInfo.services && companyInfo.services.length > 0
      ? `\n- Services: ${companyInfo.services.map(s => `${s.name} (${s.description})`).join(', ')}`
      : ''

    const prompt = `
Analyze the following business information and create a concise business context summary that will be used to generate website content.

Company Information:
- Name: ${companyInfo.name}
- Type: ${companyInfo.businessType}
- Industry: ${companyInfo.industry}
- Target Audience: ${companyInfo.targetAudience}
- Core Values: ${companyInfo.coreValues.join(', ')}
- USPs: ${companyInfo.usps.join(', ')}${servicesInfo}

Content Preferences:
- Language: ${content.language}
- Tone: ${content.tone}
- Design Style: ${design.style}

Create a 2-3 paragraph business context summary that captures the essence of this company, their market position, unique value propositions, and target audience. This will be used as context for generating all website content.
    `.trim()

    const response = await this.ai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst creating context summaries for website generation.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0]?.message?.content || ''
  }

  /**
   * Generate a complete page with all blocks
   */
  private async generatePage(
    pageType: string,
    wizardData: WizardState,
    businessContext: string,
  ): Promise<GeneratedPage> {
    const context: PageGenerationContext = {
      companyInfo: wizardData.companyInfo,
      design: wizardData.design,
      content: wizardData.content,
      features: wizardData.features,
      pageType,
    }

    // Get page structure based on type
    const structure = this.getPageStructure(pageType, wizardData)

    // Generate metadata
    const metadata = await this.generatePageMetadata(pageType, wizardData, businessContext)

    // Generate blocks
    const blocks = []
    for (const blockType of structure.blocks) {
      const block = await this.generateBlock(blockType, context, businessContext)
      blocks.push(block)
    }

    return {
      id: `page-${pageType}-${Date.now()}`,
      title: metadata.title,
      slug: pageType, // Use pageType directly as slug ('home', 'about', etc.)
      blocks,
      meta: metadata,
    }
  }

  /**
   * Get page structure (which blocks to include)
   */
  private getPageStructure(
    pageType: string,
    wizardData: WizardState,
  ): { blocks: string[] } {
    const structures: Record<string, string[]> = {
      home: ['hero', 'features', 'about-preview', 'testimonials', 'cta'],
      about: ['hero', 'story', 'values', 'team', 'cta'],
      services: ['hero', 'services-grid', 'why-choose-us', 'cta'],
      portfolio: ['hero', 'portfolio-grid', 'cta'],
      testimonials: ['hero', 'testimonials-list', 'cta'],
      pricing: ['hero', 'pricing', 'faq', 'cta'],
      blog: ['hero', 'blog-grid'],
      contact: ['hero', 'contact-info', 'contact-form', 'map', 'cta'],
    }

    let blocks = structures[pageType] || ['hero', 'content', 'cta']

    // Filter based on enabled features
    if (!wizardData.features.testimonials) {
      blocks = blocks.filter((b) => b !== 'testimonials')
    }
    if (!wizardData.features.contactForm) {
      blocks = blocks.filter((b) => b !== 'contact-form')
    }
    if (!wizardData.features.maps) {
      blocks = blocks.filter((b) => b !== 'map')
    }

    return { blocks }
  }

  /**
   * Generate page metadata (title, description, keywords)
   */
  private async generatePageMetadata(
    pageType: string,
    wizardData: WizardState,
    businessContext: string,
  ): Promise<{ title: string; description: string; keywords: string[] }> {
    const prompt = `
Generate SEO-optimized metadata for a ${pageType} page.

Business Context:
${businessContext}

Company: ${wizardData.companyInfo.name}
Industry: ${wizardData.companyInfo.industry}
Language: ${wizardData.content.language}

Generate:
1. Page title (50-60 characters, include company name)
2. Meta description (150-160 characters, compelling and keyword-rich)
3. Keywords (5-8 relevant keywords)

Respond in JSON format:
{
  "title": "...",
  "description": "...",
  "keywords": ["...", "..."]
}
    `.trim()

    const response = await this.ai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')
    return {
      title: result.title || `${pageType} - ${wizardData.companyInfo.name}`,
      description: result.description || '',
      keywords: result.keywords || [],
    }
  }

  /**
   * Generate a single block with content
   */
  private async generateBlock(
    blockType: string,
    context: PageGenerationContext,
    businessContext: string,
  ): Promise<any> {
    const prompt = this.getBlockPrompt(blockType, context, businessContext)

    const response = await this.ai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert copywriter and conversion specialist with 10+ years of experience creating high-converting website content in ${context.content.language}.

CORE PRINCIPLES:
- Write with clarity and impact - every word must earn its place
- Focus on benefits and transformations, not just features
- Use industry-specific terminology appropriately for ${context.companyInfo.industry}
- Maintain ${context.content.tone} tone while being engaging
- Include relevant keywords naturally for SEO
- Write in active voice with strong verbs
- Create emotional connection with the target audience
- Always provide concrete, specific information over generic statements

ALWAYS respond with valid, properly escaped JSON only. No explanations, no markdown, just the JSON object. Ensure all strings are properly escaped and no unterminated strings exist.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    const rawContent = response.choices[0]?.message?.content || '{}'

    // Try to parse JSON, with fallback for malformed responses
    let content
    try {
      content = JSON.parse(rawContent)
    } catch (error) {
      console.error(`[SiteGenerator] JSON parse error for ${blockType}:`, error)
      console.error(`[SiteGenerator] Raw content (first 500 chars):`, rawContent.substring(0, 500))

      // Return minimal valid block structure
      content = {
        error: 'Failed to parse AI response',
        blockType,
      }
    }

    return {
      blockType,
      blockName: blockType,
      ...content,
    }
  }

  /**
   * Get AI prompt for specific block type
   */
  private getBlockPrompt(
    blockType: string,
    context: PageGenerationContext,
    businessContext: string,
  ): string {
    const baseInfo = `
Business Context: ${businessContext}
Company: ${context.companyInfo.name}
Industry: ${context.companyInfo.industry}
Tone: ${context.content.tone}
Language: ${context.content.language}
    `.trim()

    // Check if user provided services
    const hasUserServices = context.companyInfo.services && context.companyInfo.services.length > 0
    const userServicesStr = hasUserServices
      ? context.companyInfo.services!.map((s, i) => `${i + 1}. ${s.name}: ${s.description}`).join('\n')
      : ''

    // Check if user provided testimonials
    const hasUserTestimonials = context.companyInfo.testimonials && context.companyInfo.testimonials.length > 0
    const userTestimonialsStr = hasUserTestimonials
      ? context.companyInfo.testimonials!.map((t, i) =>
          `${i + 1}. ${t.name}${t.role ? ` (${t.role})` : ''}${t.company ? ` - ${t.company}` : ''}: "${t.quote}"`
        ).join('\n')
      : ''

    // Check if user provided portfolio cases
    const hasUserPortfolio = context.companyInfo.portfolioCases && context.companyInfo.portfolioCases.length > 0
    const userPortfolioStr = hasUserPortfolio
      ? context.companyInfo.portfolioCases!.map((p, i) => `
${i + 1}. ${p.projectName} (Client: ${p.client})
   ${p.industry ? `Industry: ${p.industry}\n   ` : ''}Description: ${p.description}
   ${p.challenge ? `Challenge: ${p.challenge}\n   ` : ''}${p.solution ? `Solution: ${p.solution}\n   ` : ''}${p.results ? `Results: ${p.results}\n   ` : ''}${p.technologies?.length ? `Technologies: ${p.technologies.join(', ')}\n   ` : ''}${p.duration ? `Duration: ${p.duration}` : ''}
      `.trim()).join('\n\n')
      : ''

    // Check if user provided pricing packages
    const hasUserPricing = context.companyInfo.pricingPackages && context.companyInfo.pricingPackages.length > 0
    const userPricingStr = hasUserPricing
      ? context.companyInfo.pricingPackages!.map((p, i) => `
${i + 1}. ${p.name} - ${p.price}${p.currency ? ` ${p.currency}` : ''}${p.period ? ` ${p.period}` : ''}
   ${p.description ? `Description: ${p.description}\n   ` : ''}Features: ${p.features.join(', ')}
   ${p.highlighted ? `(This is the HIGHLIGHTED/POPULAR plan)` : ''}${p.badge ? `Badge: ${p.badge}\n   ` : ''}${p.ctaText ? `CTA: ${p.ctaText}` : ''}
      `.trim()).join('\n\n')
      : ''

    // Check if user provided contact info
    const hasContactInfo = context.companyInfo.contactInfo && context.companyInfo.contactInfo.email
    const contactInfoStr = hasContactInfo
      ? `
Email: ${context.companyInfo.contactInfo!.email}
${context.companyInfo.contactInfo!.phone ? `Phone: ${context.companyInfo.contactInfo!.phone}\n` : ''}${context.companyInfo.contactInfo!.openingHours ? `Opening Hours: ${context.companyInfo.contactInfo!.openingHours}\n` : ''}${context.companyInfo.contactInfo!.address ? `Address: ${context.companyInfo.contactInfo!.address.street || ''}, ${context.companyInfo.contactInfo!.address.postalCode || ''} ${context.companyInfo.contactInfo!.address.city || ''}, ${context.companyInfo.contactInfo!.address.country || ''}\n` : ''}${context.companyInfo.contactInfo!.socialMedia ? `Social Media: ${Object.entries(context.companyInfo.contactInfo!.socialMedia).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}` : ''}
      `.trim()
      : ''

    const prompts: Record<string, string> = {
      hero: `
${baseInfo}

Create a compelling, conversion-focused hero section for the ${context.pageType} page.

IMPORTANT GUIDELINES:
- Headline must be powerful, benefit-driven, and create immediate impact
- Use action verbs and emotional triggers
- Focus on the transformation/outcome, not just features
- Subheadline should clarify the unique value proposition
- Include relevant industry keywords naturally

Generate:
1. Headline (5-10 words, benefit-driven, emotionally engaging)
   - Use power words: Transform, Accelerate, Simplify, Revolutionize, etc.
   - Focus on customer outcome, not company offering
2. Subheadline (15-25 words, clarify value proposition with specificity)
   - Include concrete benefits or proof points
   - Address the target audience directly
3. Primary CTA (2-4 words, action-oriented, specific)
   - Examples: "Start Your Free Trial", "Get Custom Quote", "Schedule Demo"
   - NOT generic "Learn More" or "Click Here"
4. Secondary CTA (2-4 words, lower-commitment alternative)

Respond in JSON:
{
  "headline": "...",
  "subheadline": "...",
  "primaryCTA": "...",
  "secondaryCTA": "..."
}
      `,
      features: hasUserServices
        ? `
${baseInfo}

The user has provided the following services. Create a features section highlighting these services. For each service:
${userServicesStr}

For each service above, generate:
1. Professional title (3-5 words, based on service name)
2. Compelling description (30-40 words, expand on their brief description with professional copy, benefits, and SEO keywords)
3. Icon name (e.g., "star", "rocket", "shield", "code", "design", etc.)

Respond in JSON:
{
  "features": [
    {"title": "...", "description": "...", "icon": "..."},
    ...
  ]
}
      `
        : `
${baseInfo}
USPs: ${context.companyInfo.usps.join(', ')}

Create a features section with 3 key features/benefits. For each feature:
1. Title (3-5 words)
2. Description (20-30 words)
3. Icon name (e.g., "star", "rocket", "shield")

Respond in JSON:
{
  "features": [
    {"title": "...", "description": "...", "icon": "..."},
    {"title": "...", "description": "...", "icon": "..."},
    {"title": "...", "description": "...", "icon": "..."}
  ]
}
      `,
      'services-grid': hasUserServices
        ? `
${baseInfo}

The user has provided the following services. Create a professional services section with these services:
${userServicesStr}

For each service above, generate:
1. Professional title (2-5 words, based on service name)
2. Detailed description (40-60 words, expand on their brief description with professional copy, key benefits, and SEO-rich content)
3. Optional link (e.g., "/diensten/service-slug" or leave empty)

Respond in JSON:
{
  "heading": "Our Services",
  "intro": "Brief intro paragraph about services (20-30 words)",
  "services": [
    {"title": "...", "description": "...", "link": ""},
    ...
  ]
}
      `
        : `
${baseInfo}
USPs: ${context.companyInfo.usps.join(', ')}

Create a services section with 3-4 services based on the company's industry and USPs. For each service:
1. Title (2-5 words)
2. Description (30-40 words)
3. Link (optional)

Respond in JSON:
{
  "heading": "Our Services",
  "intro": "Brief intro paragraph (20-30 words)",
  "services": [
    {"title": "...", "description": "...", "link": ""},
    {"title": "...", "description": "...", "link": ""},
    {"title": "...", "description": "...", "link": ""}
  ]
}
      `,
      cta: `
${baseInfo}

Create a high-converting call-to-action section that drives immediate action.

CONVERSION PSYCHOLOGY PRINCIPLES:
- Create urgency without being pushy (limited time, exclusive access, etc.)
- Address objections preemptively
- Highlight the transformation/benefit, not the action
- Use specific numbers when possible (e.g., "Join 5,000+ companies")
- Make the next step crystal clear

Generate:
1. Headline (6-12 words, benefit-driven with urgency)
   - Examples: "Ready to Transform Your Business?", "Join 1,000+ Happy Customers Today"
   - Focus on the outcome they'll achieve
2. Description (20-35 words, remove friction and create urgency)
   - Address common objections (e.g., "No credit card required", "Free trial")
   - Include social proof if relevant
   - Create FOMO (Fear of Missing Out) subtly
3. Button text (2-5 words, specific action with value)
   - Examples: "Start Free Trial", "Get Your Custom Quote", "Book Strategy Call"
   - NOT generic: avoid "Click Here", "Learn More", "Submit"

Respond in JSON:
{
  "headline": "...",
  "description": "...",
  "buttonText": "..."
}
      `,
      testimonials: hasUserTestimonials
        ? `
${baseInfo}

The user has provided the following real testimonials from their customers:
${userTestimonialsStr}

Use these EXACT testimonials. Do not modify the quotes. Add missing information (rating, company) only if not provided. Generate:
1. Heading (e.g., "What Our Clients Say")
2. Intro text (20-30 words about customer satisfaction)
3. Use the testimonials exactly as provided, adding only:
   - Rating (1-5) if not provided
   - Company name if not provided (format: "Client of [Company Name]")

Respond in JSON:
{
  "heading": "...",
  "intro": "...",
  "testimonials": [
    {
      "name": "exact name from user",
      "role": "exact role from user or empty",
      "company": "exact company or generate if missing",
      "quote": "EXACT quote from user - do not change!",
      "rating": 5
    },
    ...
  ]
}
      `
        : `
${baseInfo}

Generate 3 realistic testimonials from satisfied customers. Make them sound authentic and specific to the ${context.companyInfo.industry} industry. Each testimonial should:
1. Have a realistic name
2. Include role/position
3. Include company name (format: "[Company Type] in [Location]" or similar)
4. Quote (30-50 words, specific and authentic)
5. Rating (4-5 stars)

Respond in JSON:
{
  "heading": "What Our Clients Say",
  "intro": "Brief intro about customer satisfaction (20-30 words)",
  "testimonials": [
    {
      "name": "...",
      "role": "...",
      "company": "...",
      "quote": "...",
      "rating": 5
    },
    {
      "name": "...",
      "role": "...",
      "company": "...",
      "quote": "...",
      "rating": 5
    },
    {
      "name": "...",
      "role": "...",
      "company": "...",
      "quote": "...",
      "rating": 4
    }
  ]
}
      `,
      'testimonials-list': hasUserTestimonials
        ? `
${baseInfo}

The user has provided the following real testimonials:
${userTestimonialsStr}

Use these EXACT testimonials without modification. Generate:
1. Heading
2. Intro text
3. Use testimonials exactly as provided

Respond in JSON format with heading, intro, and testimonials array.
      `
        : `
${baseInfo}

Generate 4-6 realistic testimonials for a testimonials page. Make them authentic and industry-specific.

Respond in JSON format with heading, intro, and testimonials array (same structure as 'testimonials' block).
      `,
      story: `
${baseInfo}

Create an engaging "About Us" story that builds trust and emotional connection.

STORYTELLING PRINCIPLES:
- Start with the "why" - the problem or mission that drives the company
- Include the journey - challenges overcome, milestones achieved
- Make it human - avoid corporate jargon, write like a person talking to another person
- Show values in action through specific examples
- End with future vision and invitation to join the journey

Generate:
1. Title (3-6 words, engaging and human)
2. Content array with 3-4 paragraphs covering:
   - Opening: The problem/need that inspired the company
   - Journey: Key milestones, challenges overcome, what makes them different
   - Values: How core values manifest in daily operations
   - Future: Vision and invitation to be part of the story

Each paragraph should be 40-60 words, conversational yet professional.

Respond in JSON:
{
  "title": "...",
  "content": [
    {"paragraph": "..."},
    {"paragraph": "..."},
    {"paragraph": "..."}
  ]
}
      `,
      'about-preview': `
${baseInfo}

Create a compelling preview/summary for the About section on the homepage.

This should be a teaser that makes visitors want to click through to the full About page.

Generate:
1. Title (4-7 words)
2. Content (60-80 words, engaging summary that captures company essence)
   - Focus on what makes them unique
   - Include a human element
   - End with subtle CTA to learn more

Respond in JSON:
{
  "title": "...",
  "content": "..."
}
      `,
      'why-choose-us': `
${baseInfo}
USPs: ${context.companyInfo.usps.join(', ')}

Create a "Why Choose Us" section that differentiates from competitors.

DIFFERENTIATION STRATEGY:
- Don't just list features - explain the unique benefit
- Use specific numbers/proof points when possible
- Address common pain points in the industry
- Show personality and values

Generate 3-4 compelling reasons with:
1. Title (3-5 words, benefit-focused)
2. Description (30-45 words, specific and credible)

Respond in JSON:
{
  "title": "Why Choose ${context.companyInfo.name}?",
  "introduction": "Brief intro paragraph (25-35 words)",
  "reasons": [
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."}
  ]
}
      `,
      pricing: hasUserPricing
        ? `
${baseInfo}

The user has provided the following pricing packages:
${userPricingStr}

Use these EXACT pricing packages. Create a professional pricing section with these packages.

For each package, generate:
1. Use the exact name, price, currency, period, description, and features provided
2. Maintain the highlighted status (mark as popular/recommended)
3. Use the exact CTA text if provided, otherwise suggest appropriate CTA
4. Add badge if provided
5. Professional presentation while keeping all user data intact

Respond in JSON:
{
  "heading": "Choose Your Plan" or appropriate heading,
  "intro": "Brief intro about pricing (20-30 words)",
  "plans": [
    {
      "name": "exact name from user",
      "price": "exact price from user",
      "currency": "exact currency or empty",
      "period": "exact period or empty",
      "description": "exact description or generate brief one if missing (20-30 words)",
      "features": ["exact features array from user"],
      "ctaText": "exact CTA or suggest if missing",
      "ctaLink": "/contact" or appropriate,
      "highlighted": true/false based on user input,
      "badge": "exact badge or empty"
    },
    ...
  ]
}
      `
        : `
${baseInfo}
Business Type: ${context.companyInfo.businessType}

Create a pricing section with 3 tiers that follows proven pricing psychology principles.

PRICING PSYCHOLOGY BEST PRACTICES:
- Use anchoring: highest price tier sets reference point
- Middle tier should be the "sweet spot" (most popular) - highlighted
- Include specific value metrics, not just features
- Create clear differentiation between tiers
- Use benefit-oriented names (not just "Basic, Standard, Premium")
- Price points should be strategic (e.g., €99 vs €100)
- Features should show progression, not just more quantity

Business Type Pricing Guidelines:
- B2B: Focus on ROI, scalability, support levels. Prices: €500-5000/month range
- B2C: Focus on value, simplicity, features. Prices: €10-100/month range
- Non-profit: Focus on impact, affordability. Prices: €25-250/month range
- E-commerce: Focus on sales volume, features. Prices: €50-500/month range

Generate 3 pricing tiers:
1. Entry tier: For those testing or with basic needs
2. Professional tier (HIGHLIGHTED): Most popular, best value - mark as highlighted:true
3. Enterprise tier: Premium offering with all features

For each tier generate:
- Name: Creative, benefit-oriented (3-5 words)
- Price: Strategic pricing (consider business type)
- Period: "/month", "/year", "one-time", etc.
- Description: Value proposition (15-25 words)
- Features: 4-6 specific features with clear value
- ctaText: Action-oriented CTA (2-4 words)

Respond in JSON:
{
  "heading": "Choose Your Plan",
  "intro": "Compelling intro about flexible pricing (20-30 words)",
  "plans": [
    {
      "name": "...",
      "price": "€...",
      "period": "/month",
      "description": "...",
      "features": [
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."}
      ],
      "ctaText": "Get Started",
      "ctaLink": "/contact",
      "highlighted": false
    },
    {
      "name": "...",
      "price": "€...",
      "period": "/month",
      "description": "...",
      "features": [
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."}
      ],
      "ctaText": "Start Free Trial",
      "ctaLink": "/contact",
      "highlighted": true
    },
    {
      "name": "...",
      "price": "€...",
      "period": "/month",
      "description": "...",
      "features": [
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."},
        {"feature": "..."}
      ],
      "ctaText": "Contact Sales",
      "ctaLink": "/contact",
      "highlighted": false
    }
  ]
}
      `,
      faq: `
${baseInfo}
Target Audience: ${context.companyInfo.targetAudience}
Services: ${context.companyInfo.services?.map(s => s.name).join(', ') || context.companyInfo.usps.join(', ')}

Create a comprehensive FAQ section with 6-8 high-quality questions and answers.

FAQ BEST PRACTICES:
- Questions should address real customer pain points, objections, and decision-making concerns
- Start with the most important/common questions first
- Cover different aspects: pricing, process, guarantees, timeline, qualifications
- Answers should be specific, helpful, and build trust
- Use the opportunity to reinforce USPs and address objections
- Include relevant keywords naturally for SEO
- Keep answers conversational yet professional (60-100 words each)

Question Categories to Cover (if relevant):
1. What you do / Core offering
2. How it works / Process
3. Pricing / Value / ROI
4. Timeline / Delivery
5. Qualifications / Experience / Track record
6. Guarantees / Support / What happens if...
7. How you're different / Why choose you
8. Getting started / Next steps

Generate 6-8 questions with detailed answers. Focus on providing genuine value and addressing real concerns from ${context.companyInfo.targetAudience}.

Respond in JSON:
{
  "heading": "Veelgestelde Vragen",
  "items": [
    {
      "question": "...",
      "answer": "..." (60-100 words, specific and helpful)
    },
    ...
  ]
}
      `,
      'portfolio-grid': hasUserPortfolio
        ? `
${baseInfo}

The user has provided the following real portfolio cases from their work:
${userPortfolioStr}

Use these EXACT portfolio cases. Create a professional portfolio section showcasing these projects.

For each project, generate:
1. Use the exact project name, client, and descriptions provided
2. Create a professional summary if description is brief (max 80 words)
3. Keep all challenges, solutions, results, technologies, and duration exactly as provided
4. Add a compelling tagline if not implicit (10-15 words)
5. Generate appropriate image URL if not provided (format: /images/portfolio/project-slug.jpg)

Respond in JSON:
{
  "heading": "Our Work",
  "intro": "Brief intro about portfolio/case studies (25-35 words)",
  "cases": [
    {
      "projectName": "exact name from user",
      "client": "exact client from user",
      "industry": "exact industry or infer if missing",
      "tagline": "compelling tagline (10-15 words)",
      "description": "professional summary based on user description (60-80 words)",
      "challenge": "exact challenge from user or empty",
      "solution": "exact solution from user or empty",
      "results": "exact results from user or empty",
      "technologies": ["array of technologies from user"],
      "duration": "exact duration from user or empty",
      "imageUrl": "generate if missing: /images/portfolio/project-slug.jpg"
    },
    ...
  ]
}
      `
        : `
${baseInfo}

Generate 3-4 realistic portfolio cases for the ${context.companyInfo.industry} industry. Make them authentic and industry-specific.

For each case, generate:
1. Project name (2-5 words)
2. Client (realistic company type and location)
3. Industry (specific)
4. Tagline (10-15 words, compelling)
5. Description (60-80 words, specific and credible)
6. Challenge (optional, 30-40 words)
7. Solution (optional, 30-40 words)
8. Results (optional, specific metrics if possible, 25-35 words)
9. Technologies/approaches (3-5 items)
10. Duration (e.g., "3 months", "6 weeks")
11. Image URL (/images/portfolio/project-slug.jpg)

Respond in JSON with heading, intro, and cases array.
      `,
      'contact-info': hasContactInfo
        ? `
${baseInfo}

The user has provided the following contact information:
${contactInfoStr}

Create a professional contact information section using this EXACT data.

Generate:
1. Heading (e.g., "Get In Touch", "Contact Us", "Reach Out")
2. Intro text (20-30 words, welcoming and encouraging contact)
3. Use the exact contact details provided:
   - Email (required): ${context.companyInfo.contactInfo!.email}
   - Phone: ${context.companyInfo.contactInfo!.phone || 'not provided'}
   - Address: ${context.companyInfo.contactInfo!.address ? `${context.companyInfo.contactInfo!.address.street || ''}, ${context.companyInfo.contactInfo!.address.postalCode || ''} ${context.companyInfo.contactInfo!.address.city || ''}, ${context.companyInfo.contactInfo!.address.country || ''}` : 'not provided'}
   - Opening hours: ${context.companyInfo.contactInfo!.openingHours || 'not provided'}
4. Social media links (use exact URLs provided, omit if not provided)
5. Optional: Brief response time message (e.g., "We typically respond within 24 hours")

Respond in JSON:
{
  "heading": "...",
  "intro": "...",
  "email": "${context.companyInfo.contactInfo!.email}",
  "phone": "${context.companyInfo.contactInfo!.phone || ''}",
  "address": {
    "street": "${context.companyInfo.contactInfo!.address?.street || ''}",
    "postalCode": "${context.companyInfo.contactInfo!.address?.postalCode || ''}",
    "city": "${context.companyInfo.contactInfo!.address?.city || ''}",
    "country": "${context.companyInfo.contactInfo!.address?.country || ''}"
  },
  "openingHours": "${context.companyInfo.contactInfo!.openingHours || ''}",
  "socialMedia": {
    "facebook": "${context.companyInfo.contactInfo!.socialMedia?.facebook || ''}",
    "twitter": "${context.companyInfo.contactInfo!.socialMedia?.twitter || ''}",
    "linkedin": "${context.companyInfo.contactInfo!.socialMedia?.linkedin || ''}",
    "instagram": "${context.companyInfo.contactInfo!.socialMedia?.instagram || ''}",
    "youtube": "${context.companyInfo.contactInfo!.socialMedia?.youtube || ''}"
  },
  "responseTime": "..."
}
      `
        : `
${baseInfo}

Generate generic contact information section placeholders.

Respond in JSON with heading, intro, email (placeholder), phone (optional), address (optional), openingHours, and socialMedia object.
      `,
      'contact-form': `
${baseInfo}

Create a professional contact form section with clear copy that encourages submissions.

Generate:
1. Heading (3-6 words, action-oriented)
2. Introduction (25-35 words, explain what happens after submission)
3. Success message (20-30 words, friendly confirmation)
4. Form fields will be determined by user config, just provide the copy

Respond in JSON:
{
  "heading": "...",
  "introduction": "...",
  "successMessage": "...",
  "privacyNote": "Brief note about data privacy (15-20 words)"
}
      `,
      'map': `
${baseInfo}

Create a professional heading for a map/location section.

${hasContactInfo && contactInfoStr ? `
The user has provided the following address:
${contactInfoStr}

Use this address information to create an appropriate heading.
` : ''}

Generate:
1. Heading (2-5 words, e.g., "Find Us", "Our Location", "Visit Us")
2. Optional introduction text (15-25 words, welcoming visitors)

Respond in JSON:
{
  "heading": "...",
  "introduction": "..."
}
      `,
    }

    return (
      prompts[blockType] ||
      `${baseInfo}\n\nCreate content for a ${blockType} block. Respond with JSON containing relevant fields.`
    )
  }

  /**
   * Optimize SEO for all pages
   */
  private async optimizeAllSEO(pages: GeneratedPage[], wizardData: WizardState): Promise<void> {
    // SEO optimization logic will be added
    // For now, this is a placeholder
    return Promise.resolve()
  }

  /**
   * Report progress to callback
   */
  private reportProgress(progress: number, message: string): void {
    if (this.onProgress) {
      this.onProgress(progress, message)
    }
  }
}
