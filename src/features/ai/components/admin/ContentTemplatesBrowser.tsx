'use client'

import React, { useState } from 'react'

interface Template {
  id: string
  name: string
  description: string
  icon: string
  blocks: string[]
  pageType: string
}

const TEMPLATES: Template[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Overtuigende landingspagina met hero, features, testimonials en CTA',
    icon: 'rocket',
    blocks: ['hero', 'features', 'testimonials', 'pricing', 'faq', 'cta'],
    pageType: 'landing',
  },
  {
    id: 'about',
    name: 'Over Ons',
    description: 'Bedrijfspagina met team, geschiedenis en missie',
    icon: 'building',
    blocks: ['hero', 'content', 'team', 'stats', 'cta'],
    pageType: 'about',
  },
  {
    id: 'services',
    name: 'Diensten',
    description: 'Overzicht van diensten met beschrijvingen en pricing',
    icon: 'briefcase',
    blocks: ['hero', 'services', 'content', 'pricing', 'faq', 'cta'],
    pageType: 'services',
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Contactpagina met formulier, kaart en FAQ',
    icon: 'mail',
    blocks: ['hero', 'contactForm', 'map', 'faq'],
    pageType: 'contact',
  },
  {
    id: 'blog',
    name: 'Blog Overzicht',
    description: 'Blog landingspagina met featured posts en categorien',
    icon: 'newspaper',
    blocks: ['hero', 'content', 'blog-preview', 'newsletter', 'cta'],
    pageType: 'blog',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase van projecten en case studies',
    icon: 'image',
    blocks: ['hero', 'caseStudyGrid', 'testimonials', 'stats', 'cta'],
    pageType: 'custom',
  },
  {
    id: 'pricing',
    name: 'Prijzen',
    description: 'Prijspagina met pakketten, vergelijking en FAQ',
    icon: 'tag',
    blocks: ['hero', 'pricing', 'features', 'faq', 'cta'],
    pageType: 'custom',
  },
  {
    id: 'product',
    name: 'Product Showcase',
    description: 'Productpagina met hero, features en productgrid',
    icon: 'package',
    blocks: ['hero', 'features', 'twoColumn', 'testimonials', 'cta'],
    pageType: 'custom',
  },
]

const ICON_MAP: Record<string, string> = {
  rocket: '\u{1F680}',
  building: '\u{1F3E2}',
  briefcase: '\u{1F4BC}',
  mail: '\u{1F4E7}',
  newspaper: '\u{1F4F0}',
  image: '\u{1F5BC}',
  tag: '\u{1F3F7}',
  package: '\u{1F4E6}',
}

export function ContentTemplatesBrowser() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [pagePurpose, setPagePurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [createdPageId, setCreatedPageId] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'configure' | 'result'>('select')

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setPagePurpose(template.description)
    setStep('configure')
    setError('')
    setResult(null)
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ai/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePurpose: pagePurpose || selectedTemplate.description,
          pageType: selectedTemplate.pageType,
          businessInfo: {
            name: businessName || undefined,
            industry: industry || undefined,
            targetAudience: targetAudience || undefined,
          },
          preferences: {
            includeHero: selectedTemplate.blocks.includes('hero'),
            includePricing: selectedTemplate.blocks.includes('pricing'),
            includeFAQ: selectedTemplate.blocks.includes('faq'),
            includeTestimonials: selectedTemplate.blocks.includes('testimonials'),
            includeContactForm: selectedTemplate.blocks.includes('contactForm'),
            maxBlocks: selectedTemplate.blocks.length,
          },
          language: 'nl',
        }),
      })

      const data = await res.json()

      if (data.success && data.pageStructure) {
        setResult(data.pageStructure)
        setStep('result')
      } else {
        setError(data.error || 'Pagina generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'result') setStep('configure')
    else if (step === 'configure') {
      setStep('select')
      setSelectedTemplate(null)
    }
  }

  const handleCopyJSON = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    }
  }

  const handleCreatePage = async () => {
    if (!result) return
    setCreating(true)
    setError('')

    try {
      // Convert AI blocks to Payload block format
      const layout = (result.blocks || []).map((block: any) => ({
        blockType: block.type,
        ...block.data,
      }))

      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: result.title,
          slug: result.slug,
          status: 'draft',
          layout,
        }),
      })

      const data = await res.json()

      if (data.doc?.id) {
        setCreatedPageId(data.doc.id)
      } else if (data.id) {
        setCreatedPageId(data.id)
      } else {
        setError(data.errors?.[0]?.message || 'Pagina aanmaken mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout bij aanmaken')
    } finally {
      setCreating(false)
    }
  }

  const cardStyle = (isSelected: boolean) => ({
    padding: '1.25rem',
    border: isSelected ? '2px solid #1a1a2e' : '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    cursor: 'pointer' as const,
    backgroundColor: isSelected ? '#f5f3ff' : '#fff',
    transition: 'all 0.15s',
  })

  const inputStyle = {
    width: '100%',
    padding: '0.625rem',
    fontSize: '0.85rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontFamily: 'inherit',
  }

  const btnStyle = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => ({
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: variant === 'primary' ? '#fff' : '#374151',
    backgroundColor: variant === 'primary' ? '#1a1a2e' : variant === 'secondary' ? '#f3f4f6' : 'transparent',
    border: variant === 'outline' ? '1px solid #d1d5db' : 'none',
    borderRadius: '0.375rem',
    cursor: loading ? 'not-allowed' as const : 'pointer' as const,
    opacity: loading ? 0.6 : 1,
  })

  return (
    <div>
      {/* Navigation */}
      {step !== 'select' && (
        <button
          type="button"
          onClick={handleBack}
          style={{ ...btnStyle('outline'), marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          &larr; Terug
        </button>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', color: '#991b1b', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Step 1: Select Template */}
      {step === 'select' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              style={cardStyle(selectedTemplate?.id === template.id)}
              onClick={() => handleSelectTemplate(template)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectTemplate(template)}
              role="button"
              tabIndex={0}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {ICON_MAP[template.icon] || ''}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                {template.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                {template.description}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {template.blocks.map((block) => (
                  <span
                    key={block}
                    style={{
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.7rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '9999px',
                      color: '#6b7280',
                    }}
                  >
                    {block}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 'configure' && selectedTemplate && (
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{ICON_MAP[selectedTemplate.icon]}</span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedTemplate.name}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{selectedTemplate.description}</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Bedrijfsnaam (optioneel)
            </label>
            <input
              style={inputStyle}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Bijv: Plastimed"
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Branche / Industrie (optioneel)
            </label>
            <input
              style={inputStyle}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Bijv: Medische hulpmiddelen"
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Doelgroep (optioneel)
            </label>
            <input
              style={inputStyle}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Bijv: Zorgprofessionals en ziekenhuizen"
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Extra omschrijving
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const }}
              value={pagePurpose}
              onChange={(e) => setPagePurpose(e.target.value)}
              placeholder="Beschrijf het doel van de pagina..."
              disabled={loading}
            />
          </div>

          <button type="button" style={btnStyle('primary')} onClick={handleGenerate} disabled={loading}>
            {loading ? 'Pagina wordt gegenereerd met AI...' : 'Genereer Pagina met AI'}
          </button>

          {loading && (
            <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
              Dit kan 15-30 seconden duren — er worden meerdere blocks gegenereerd...
            </div>
          )}
        </div>
      )}

      {/* Step 3: Result */}
      {step === 'result' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              {result.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Slug: /{result.slug}
            </div>
            {result.metaDescription && (
              <div style={{ fontSize: '0.8rem', color: '#374151', fontStyle: 'italic' }}>
                {result.metaDescription}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Gegenereerde blocks ({result.blocks?.length || 0})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.blocks?.map((block: any, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                    }}>
                      {block.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Block {i + 1}</span>
                  </div>
                  <pre style={{
                    fontSize: '0.75rem',
                    color: '#374151',
                    backgroundColor: '#f9fafb',
                    padding: '0.75rem',
                    borderRadius: '0.25rem',
                    overflow: 'auto',
                    maxHeight: '200px',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}>
                    {JSON.stringify(block.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {createdPageId ? (
            <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem' }}>
                Pagina succesvol aangemaakt als concept!
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={`/admin/collections/pages/${createdPageId}`}
                  style={{
                    ...btnStyle('primary'),
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Open pagina in editor
                </a>
                <button
                  type="button"
                  style={btnStyle('outline')}
                  onClick={() => {
                    setStep('select')
                    setSelectedTemplate(null)
                    setResult(null)
                    setCreatedPageId(null)
                  }}
                >
                  Nieuwe template kiezen
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                style={{ ...btnStyle('primary'), opacity: creating ? 0.6 : 1 }}
                onClick={handleCreatePage}
                disabled={creating}
              >
                {creating ? 'Pagina wordt aangemaakt...' : 'Aanmaken als concept pagina'}
              </button>
              <button type="button" style={btnStyle('secondary')} onClick={handleCopyJSON}>
                Kopieer als JSON
              </button>
              <button type="button" style={btnStyle('outline')} onClick={() => { setStep('configure'); setResult(null) }}>
                Opnieuw genereren
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
