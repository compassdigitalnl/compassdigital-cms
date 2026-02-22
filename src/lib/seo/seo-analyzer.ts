/**
 * SEO Analyzer - Yoast-like SEO score calculation
 *
 * Analyzes content and provides actionable SEO feedback
 * Score: 0-100 (0-49 = poor, 50-79 = good, 80-100 = excellent)
 */

export interface SEOAnalysisResult {
  score: number // 0-100
  status: 'poor' | 'good' | 'excellent'
  checks: SEOCheck[]
  recommendations: string[]
}

export interface SEOCheck {
  id: string
  label: string
  status: 'pass' | 'warning' | 'fail'
  score: number // Points earned (max varies per check)
  maxScore: number
  message: string
  priority: 'high' | 'medium' | 'low'
}

export interface AnalyzeOptions {
  title?: string
  metaDescription?: string
  slug?: string
  content?: any // Lexical/rich text content
  focusKeyword?: string
  blocks?: any[] // Page layout blocks
}

// ─── Helper: Extract Plain Text from Lexical/Rich Text ──────
function extractPlainText(content: any): string {
  if (!content) return ''

  if (typeof content === 'string') return content

  // Lexical format
  if (content.root?.children) {
    let text = ''
    const traverse = (node: any) => {
      if (node.text) text += node.text + ' '
      if (node.children) node.children.forEach(traverse)
    }
    traverse(content.root)
    return text.trim()
  }

  return ''
}

// ─── Helper: Count Words ─────────────────────────────────────
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

// ─── Helper: Extract Headings ────────────────────────────────
function extractHeadings(content: any): string[] {
  const headings: string[] = []

  if (!content?.root?.children) return headings

  const traverse = (node: any) => {
    if (node.type?.startsWith('heading')) {
      const text = extractPlainText(node)
      if (text) headings.push(text)
    }
    if (node.children) node.children.forEach(traverse)
  }

  traverse(content.root)
  return headings
}

// ─── Helper: Keyword Density ─────────────────────────────────
function calculateKeywordDensity(text: string, keyword: string): number {
  if (!keyword) return 0

  const words = text.toLowerCase().split(/\s+/)
  const keywordWords = keyword.toLowerCase().split(/\s+/)

  let count = 0
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const phrase = words.slice(i, i + keywordWords.length).join(' ')
    if (phrase === keywordWords.join(' ')) count++
  }

  return (count / words.length) * 100
}

// ─── Helper: Count Images ────────────────────────────────────
function countImages(blocks: any[]): { total: number; withAlt: number } {
  if (!blocks) return { total: 0, withAlt: 0 }

  let total = 0
  let withAlt = 0

  const traverse = (items: any[]) => {
    items.forEach(block => {
      if (block.blockType === 'mediaBlock' || block.blockType === 'hero') {
        if (block.media || block.image) {
          total++
          const img = block.media || block.image
          if (img?.alt) withAlt++
        }
      }

      // Traverse nested blocks (only if they're arrays, not strings like "centered" or "grid-4")
      if (Array.isArray(block.layout)) traverse(block.layout)
      if (Array.isArray(block.columns)) traverse(block.columns)
    })
  }

  traverse(blocks)
  return { total, withAlt }
}

// ─── Helper: Count Links ─────────────────────────────────────
function countLinks(content: any): { internal: number; external: number } {
  let internal = 0
  let external = 0

  if (!content?.root?.children) return { internal, external }

  const traverse = (node: any) => {
    if (node.type === 'link') {
      const url = node.url || ''
      if (url.startsWith('/') || url.startsWith('#')) {
        internal++
      } else if (url.startsWith('http')) {
        external++
      }
    }
    if (node.children) node.children.forEach(traverse)
  }

  traverse(content.root)
  return { internal, external }
}

// ─── Main Analyzer ───────────────────────────────────────────
export function analyzeSEO(options: AnalyzeOptions): SEOAnalysisResult {
  const checks: SEOCheck[] = []
  const recommendations: string[] = []

  const {
    title = '',
    metaDescription = '',
    slug = '',
    content,
    focusKeyword = '',
    blocks = []
  } = options

  const plainText = extractPlainText(content)
  const wordCount = countWords(plainText)
  const headings = extractHeadings(content)
  const images = countImages(blocks)
  const links = countLinks(content)

  // ══════════════════════════════════════════════════════════
  // CHECK 1: Title Length (50-60 characters optimal)
  // ══════════════════════════════════════════════════════════
  const titleLength = title.length
  let titleCheck: SEOCheck

  if (titleLength === 0) {
    titleCheck = {
      id: 'title-length',
      label: 'Title Tag',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: '❌ Geen title ingesteld',
      priority: 'high'
    }
    recommendations.push('Voeg een title toe (50-60 karakters)')
  } else if (titleLength < 30) {
    titleCheck = {
      id: 'title-length',
      label: 'Title Tag',
      status: 'warning',
      score: 5,
      maxScore: 10,
      message: `⚠️ Title te kort (${titleLength} tekens, optimaal: 50-60)`,
      priority: 'high'
    }
    recommendations.push('Maak de title langer (50-60 karakters)')
  } else if (titleLength > 70) {
    titleCheck = {
      id: 'title-length',
      label: 'Title Tag',
      status: 'warning',
      score: 7,
      maxScore: 10,
      message: `⚠️ Title te lang (${titleLength} tekens, wordt afgekort in SERP)`,
      priority: 'medium'
    }
    recommendations.push('Kort de title in tot maximaal 60 karakters')
  } else {
    titleCheck = {
      id: 'title-length',
      label: 'Title Tag',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `✅ Perfecte title lengte (${titleLength} tekens)`,
      priority: 'high'
    }
  }
  checks.push(titleCheck)

  // ══════════════════════════════════════════════════════════
  // CHECK 2: Meta Description (150-160 characters optimal)
  // ══════════════════════════════════════════════════════════
  const descLength = metaDescription.length
  let descCheck: SEOCheck

  if (descLength === 0) {
    descCheck = {
      id: 'meta-description',
      label: 'Meta Description',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: '❌ Geen meta description ingesteld',
      priority: 'high'
    }
    recommendations.push('Voeg een meta description toe (150-160 karakters)')
  } else if (descLength < 120) {
    descCheck = {
      id: 'meta-description',
      label: 'Meta Description',
      status: 'warning',
      score: 5,
      maxScore: 10,
      message: `⚠️ Description te kort (${descLength} tekens, optimaal: 150-160)`,
      priority: 'medium'
    }
    recommendations.push('Maak de description langer (150-160 karakters)')
  } else if (descLength > 170) {
    descCheck = {
      id: 'meta-description',
      label: 'Meta Description',
      status: 'warning',
      score: 7,
      maxScore: 10,
      message: `⚠️ Description te lang (${descLength} tekens, wordt afgekort)`,
      priority: 'medium'
    }
    recommendations.push('Kort de description in tot maximaal 160 karakters')
  } else {
    descCheck = {
      id: 'meta-description',
      label: 'Meta Description',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `✅ Perfecte description lengte (${descLength} tekens)`,
      priority: 'high'
    }
  }
  checks.push(descCheck)

  // ══════════════════════════════════════════════════════════
  // CHECK 3: URL/Slug Structure
  // ══════════════════════════════════════════════════════════
  let slugCheck: SEOCheck

  if (!slug || slug === 'home') {
    slugCheck = {
      id: 'slug',
      label: 'URL Structure',
      status: 'pass',
      score: 5,
      maxScore: 5,
      message: '✅ Homepage URL',
      priority: 'low'
    }
  } else if (slug.length < 3) {
    slugCheck = {
      id: 'slug',
      label: 'URL Structure',
      status: 'warning',
      score: 2,
      maxScore: 5,
      message: '⚠️ Slug te kort (gebruik beschrijvende woorden)',
      priority: 'medium'
    }
    recommendations.push('Gebruik een langere, beschrijvende slug')
  } else if (slug.length > 50) {
    slugCheck = {
      id: 'slug',
      label: 'URL Structure',
      status: 'warning',
      score: 3,
      maxScore: 5,
      message: '⚠️ Slug te lang (hou het kort en bondig)',
      priority: 'low'
    }
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    slugCheck = {
      id: 'slug',
      label: 'URL Structure',
      status: 'warning',
      score: 3,
      maxScore: 5,
      message: '⚠️ Gebruik alleen lowercase letters, cijfers en koppeltekens',
      priority: 'medium'
    }
  } else {
    slugCheck = {
      id: 'slug',
      label: 'URL Structure',
      status: 'pass',
      score: 5,
      maxScore: 5,
      message: '✅ Goede URL structuur',
      priority: 'low'
    }
  }
  checks.push(slugCheck)

  // ══════════════════════════════════════════════════════════
  // CHECK 4: Content Length
  // ══════════════════════════════════════════════════════════
  let contentCheck: SEOCheck

  if (wordCount === 0) {
    contentCheck = {
      id: 'content-length',
      label: 'Content Length',
      status: 'fail',
      score: 0,
      maxScore: 15,
      message: '❌ Geen content aanwezig',
      priority: 'high'
    }
    recommendations.push('Voeg content toe (minimaal 300 woorden)')
  } else if (wordCount < 300) {
    contentCheck = {
      id: 'content-length',
      label: 'Content Length',
      status: 'warning',
      score: 7,
      maxScore: 15,
      message: `⚠️ Te weinig content (${wordCount} woorden, minimaal 300)`,
      priority: 'high'
    }
    recommendations.push(`Voeg meer content toe (nog ${300 - wordCount} woorden)`)
  } else if (wordCount < 500) {
    contentCheck = {
      id: 'content-length',
      label: 'Content Length',
      status: 'pass',
      score: 12,
      maxScore: 15,
      message: `✅ Goede content lengte (${wordCount} woorden)`,
      priority: 'medium'
    }
  } else {
    contentCheck = {
      id: 'content-length',
      label: 'Content Length',
      status: 'pass',
      score: 15,
      maxScore: 15,
      message: `✅ Uitstekende content lengte (${wordCount} woorden)`,
      priority: 'medium'
    }
  }
  checks.push(contentCheck)

  // ══════════════════════════════════════════════════════════
  // CHECK 5: Heading Structure
  // ══════════════════════════════════════════════════════════
  let headingCheck: SEOCheck

  if (headings.length === 0) {
    headingCheck = {
      id: 'headings',
      label: 'Heading Structure',
      status: 'warning',
      score: 3,
      maxScore: 10,
      message: '⚠️ Geen headings gevonden (gebruik H1, H2, H3)',
      priority: 'medium'
    }
    recommendations.push('Voeg headings toe voor betere leesbaarheid')
  } else if (headings.length < 3) {
    headingCheck = {
      id: 'headings',
      label: 'Heading Structure',
      status: 'warning',
      score: 6,
      maxScore: 10,
      message: `⚠️ Weinig headings (${headings.length}, gebruik meer structuur)`,
      priority: 'medium'
    }
    recommendations.push('Voeg meer headings toe (H2, H3) voor structuur')
  } else {
    headingCheck = {
      id: 'headings',
      label: 'Heading Structure',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `✅ Goede heading structuur (${headings.length} headings)`,
      priority: 'medium'
    }
  }
  checks.push(headingCheck)

  // ══════════════════════════════════════════════════════════
  // CHECK 6: Focus Keyword Usage
  // ══════════════════════════════════════════════════════════
  if (focusKeyword) {
    const keywordLower = focusKeyword.toLowerCase()
    const titleLower = title.toLowerCase()
    const descLower = metaDescription.toLowerCase()
    const textLower = plainText.toLowerCase()

    const inTitle = titleLower.includes(keywordLower)
    const inDesc = descLower.includes(keywordLower)
    const density = calculateKeywordDensity(plainText, focusKeyword)

    let keywordCheck: SEOCheck
    let keywordScore = 0
    const messages: string[] = []

    if (inTitle) {
      keywordScore += 5
      messages.push('✅ Keyword in title')
    } else {
      messages.push('❌ Keyword niet in title')
      recommendations.push(`Voeg "${focusKeyword}" toe aan de title`)
    }

    if (inDesc) {
      keywordScore += 3
      messages.push('✅ Keyword in description')
    } else {
      messages.push('❌ Keyword niet in description')
      recommendations.push(`Voeg "${focusKeyword}" toe aan de meta description`)
    }

    if (density > 0.5 && density < 2.5) {
      keywordScore += 7
      messages.push(`✅ Keyword density optimaal (${density.toFixed(1)}%)`)
    } else if (density === 0) {
      messages.push('❌ Keyword niet in content')
      recommendations.push(`Gebruik "${focusKeyword}" in de content (1-2%)`)
    } else if (density > 2.5) {
      keywordScore += 3
      messages.push(`⚠️ Te veel keyword herhaling (${density.toFixed(1)}%, max 2.5%)`)
      recommendations.push('Verminder keyword herhaling (keyword stuffing)')
    } else {
      keywordScore += 5
      messages.push(`⚠️ Lage keyword density (${density.toFixed(1)}%, optimaal 1-2%)`)
    }

    keywordCheck = {
      id: 'keyword-usage',
      label: 'Focus Keyword',
      status: keywordScore >= 12 ? 'pass' : keywordScore >= 7 ? 'warning' : 'fail',
      score: keywordScore,
      maxScore: 15,
      message: messages.join('\n'),
      priority: 'high'
    }

    checks.push(keywordCheck)
  }

  // ══════════════════════════════════════════════════════════
  // CHECK 7: Image Optimization
  // ══════════════════════════════════════════════════════════
  let imageCheck: SEOCheck

  if (images.total === 0) {
    imageCheck = {
      id: 'images',
      label: 'Images',
      status: 'warning',
      score: 3,
      maxScore: 10,
      message: '⚠️ Geen afbeeldingen (overweeg visuals toe te voegen)',
      priority: 'low'
    }
  } else if (images.withAlt === 0) {
    imageCheck = {
      id: 'images',
      label: 'Images',
      status: 'fail',
      score: 2,
      maxScore: 10,
      message: `❌ ${images.total} afbeelding(en) zonder alt text`,
      priority: 'high'
    }
    recommendations.push('Voeg alt text toe aan alle afbeeldingen')
  } else if (images.withAlt < images.total) {
    const missing = images.total - images.withAlt
    imageCheck = {
      id: 'images',
      label: 'Images',
      status: 'warning',
      score: 6,
      maxScore: 10,
      message: `⚠️ ${missing} van ${images.total} afbeeldingen missen alt text`,
      priority: 'medium'
    }
    recommendations.push(`Voeg alt text toe aan ${missing} afbeelding(en)`)
  } else {
    imageCheck = {
      id: 'images',
      label: 'Images',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `✅ Alle afbeeldingen hebben alt text (${images.total})`,
      priority: 'low'
    }
  }
  checks.push(imageCheck)

  // ══════════════════════════════════════════════════════════
  // CHECK 8: Internal Links
  // ══════════════════════════════════════════════════════════
  let linkCheck: SEOCheck

  if (links.internal === 0) {
    linkCheck = {
      id: 'links',
      label: 'Internal Links',
      status: 'warning',
      score: 5,
      maxScore: 10,
      message: '⚠️ Geen interne links (voeg links naar andere paginas toe)',
      priority: 'medium'
    }
    recommendations.push('Voeg interne links toe naar relevante paginas')
  } else if (links.internal < 2) {
    linkCheck = {
      id: 'links',
      label: 'Internal Links',
      status: 'warning',
      score: 7,
      maxScore: 10,
      message: `⚠️ Weinig interne links (${links.internal}, voeg er meer toe)`,
      priority: 'medium'
    }
    recommendations.push('Voeg meer interne links toe (minimaal 2-3)')
  } else {
    linkCheck = {
      id: 'links',
      label: 'Internal Links',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `✅ Goede interne linking (${links.internal} links)`,
      priority: 'low'
    }
  }
  checks.push(linkCheck)

  // ══════════════════════════════════════════════════════════
  // Calculate Final Score
  // ══════════════════════════════════════════════════════════
  const totalScore = checks.reduce((sum, check) => sum + check.score, 0)
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0)
  const score = Math.round((totalScore / maxScore) * 100)

  let status: 'poor' | 'good' | 'excellent'
  if (score < 50) status = 'poor'
  else if (score < 80) status = 'good'
  else status = 'excellent'

  return {
    score,
    status,
    checks,
    recommendations: recommendations.slice(0, 5) // Top 5 recommendations
  }
}
