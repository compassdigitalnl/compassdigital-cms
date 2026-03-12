'use client'

import React, { useState } from 'react'

type AITab = 'generate' | 'improve' | 'seo' | 'translate' | 'image'

const TONES = [
  { value: 'professional', label: 'Professioneel' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Vriendelijk' },
  { value: 'persuasive', label: 'Overtuigend' },
  { value: 'formal', label: 'Formeel' },
  { value: 'enthusiastic', label: 'Enthousiast' },
]

const LANGUAGES = [
  { value: 'nl', label: 'Nederlands' },
  { value: 'en', label: 'Engels' },
  { value: 'de', label: 'Duits' },
  { value: 'fr', label: 'Frans' },
  { value: 'es', label: 'Spaans' },
]

export function AIStudioBrowser() {
  const [activeTab, setActiveTab] = useState<AITab>('generate')

  // Generate tab state
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [language, setLanguage] = useState('nl')
  const [generatedContent, setGeneratedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Improve tab state
  const [improveContent, setImproveContent] = useState('')
  const [improveType, setImproveType] = useState('clarity')
  const [improvedContent, setImprovedContent] = useState('')

  // SEO tab state
  const [seoContent, setSeoContent] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)

  // Translate tab state
  const [translateContent, setTranslateContent] = useState('')
  const [targetLang, setTargetLang] = useState('en')
  const [translatedContent, setTranslatedContent] = useState('')

  // Image tab state
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageType, setImageType] = useState('custom')
  const [imageSize, setImageSize] = useState('1024x1024')
  const [imageResult, setImageResult] = useState<{ url: string; revisedPrompt?: string } | null>(null)
  const [savedMedia, setSavedMedia] = useState<{ id: string; url: string; filename: string } | null>(null)
  const [savingImage, setSavingImage] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone, language, maxTokens: 1000, temperature: 0.7 }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedContent(data.content)
      } else {
        setError(data.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleImprove = async () => {
    if (!improveContent.trim()) return
    setLoading(true)
    setError('')
    try {
      const promptMap: Record<string, string> = {
        clarity: 'Verbeter deze tekst voor meer duidelijkheid en leesbaarheid',
        brevity: 'Maak deze tekst korter en bondiger',
        engagement: 'Maak deze tekst aantrekkelijker en boeiender',
        seo: 'Optimaliseer deze tekst voor SEO',
        grammar: 'Corrigeer grammatica, spelling en interpunctie',
      }
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${promptMap[improveType]}:\n\n${improveContent}`,
          tone: 'professional',
          language,
          maxTokens: 2000,
        }),
      })
      const data = await res.json()
      if (data.success) setImprovedContent(data.content)
      else setError(data.error || 'Verbetering mislukt')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleSEO = async () => {
    if (!seoContent.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: seoContent, title: seoTitle }),
      })
      const data = await res.json()
      if (data.success) setSeoAnalysis(data.analysis)
      else setError(data.error || 'SEO analyse mislukt')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async () => {
    if (!translateContent.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: translateContent, targetLanguage: targetLang }),
      })
      const data = await res.json()
      if (data.success && data.translation) {
        setTranslatedContent(data.translation.translatedText || data.translation)
      } else {
        setError(data.error || 'Vertaling mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return
    setLoading(true)
    setError('')
    setImageResult(null)
    setSavedMedia(null)
    try {
      const body: any = { type: imageType, size: imageSize }
      if (imageType === 'custom') {
        body.prompt = imagePrompt
      } else {
        body.description = imagePrompt
        if (imageType === 'featured') body.title = imagePrompt.split('.')[0]
      }

      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success && data.image) {
        setImageResult(data.image)
      } else {
        setError(data.error || 'Afbeelding generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToMedia = async () => {
    if (!imageResult?.url) return
    setSavingImage(true)
    setError('')
    try {
      const res = await fetch('/api/ai/save-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          imageUrl: imageResult.url,
          alt: imagePrompt.slice(0, 120),
          filename: `ai-${imageType}-${Date.now()}`,
        }),
      })
      const data = await res.json()
      if (data.success && data.media) {
        setSavedMedia(data.media)
      } else {
        setError(data.error || 'Opslaan in media mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setSavingImage(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabStyle = (tab: AITab) => ({
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: activeTab === tab ? 700 : 500,
    color: activeTab === tab ? '#fff' : '#374151',
    backgroundColor: activeTab === tab ? '#1a1a2e' : '#f3f4f6',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer' as const,
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  }

  const selectStyle = {
    ...inputStyle,
    backgroundColor: '#fff',
  }

  const btnStyle = (variant: 'primary' | 'secondary' = 'primary') => ({
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: variant === 'primary' ? '#fff' : '#374151',
    backgroundColor: variant === 'primary' ? '#1a1a2e' : '#f3f4f6',
    border: variant === 'primary' ? 'none' : '1px solid #d1d5db',
    borderRadius: '0.375rem',
    cursor: loading ? 'not-allowed' as const : 'pointer' as const,
    opacity: loading ? 0.6 : 1,
  })

  const resultBoxStyle = {
    padding: '1rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.375rem',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
  }

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button type="button" style={tabStyle('generate')} onClick={() => setActiveTab('generate')}>
          Content Genereren
        </button>
        <button type="button" style={tabStyle('improve')} onClick={() => setActiveTab('improve')}>
          Tekst Verbeteren
        </button>
        <button type="button" style={tabStyle('seo')} onClick={() => setActiveTab('seo')}>
          SEO Analyse
        </button>
        <button type="button" style={tabStyle('translate')} onClick={() => setActiveTab('translate')}>
          Vertalen
        </button>
        <button type="button" style={tabStyle('image')} onClick={() => setActiveTab('image')}>
          Afbeeldingen
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', color: '#991b1b', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Wat wil je genereren?</label>
            <textarea
              style={textareaStyle}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Bijv: Schrijf een professionele 'Over Ons' tekst voor een medisch leverancier die al 25 jaar actief is..."
              disabled={loading}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Toon</label>
              <select style={selectStyle} value={tone} onChange={(e) => setTone(e.target.value)} disabled={loading}>
                {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Taal</label>
              <select style={selectStyle} value={language} onChange={(e) => setLanguage(e.target.value)} disabled={loading}>
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
          <button type="button" style={btnStyle('primary')} onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? 'Genereren...' : 'Genereer Content'}
          </button>
          {generatedContent && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Resultaat</label>
                <button type="button" style={btnStyle('secondary')} onClick={() => handleCopy(generatedContent)}>
                  {copied ? 'Gekopieerd!' : 'Kopieer'}
                </button>
              </div>
              <div style={resultBoxStyle}>{generatedContent}</div>
            </div>
          )}
        </div>
      )}

      {/* Improve Tab */}
      {activeTab === 'improve' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Plak je tekst hier</label>
            <textarea
              style={textareaStyle}
              value={improveContent}
              onChange={(e) => setImproveContent(e.target.value)}
              placeholder="Plak hier de tekst die je wilt verbeteren..."
              disabled={loading}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Type verbetering</label>
            <select style={selectStyle} value={improveType} onChange={(e) => setImproveType(e.target.value)} disabled={loading}>
              <option value="clarity">Duidelijker maken</option>
              <option value="brevity">Korter en bondiger</option>
              <option value="engagement">Boeiender maken</option>
              <option value="seo">SEO optimaliseren</option>
              <option value="grammar">Grammatica corrigeren</option>
            </select>
          </div>
          <button type="button" style={btnStyle('primary')} onClick={handleImprove} disabled={loading || !improveContent.trim()}>
            {loading ? 'Verbeteren...' : 'Verbeter Tekst'}
          </button>
          {improvedContent && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Verbeterde tekst</label>
                <button type="button" style={btnStyle('secondary')} onClick={() => handleCopy(improvedContent)}>
                  {copied ? 'Gekopieerd!' : 'Kopieer'}
                </button>
              </div>
              <div style={resultBoxStyle}>{improvedContent}</div>
            </div>
          )}
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pagina titel (optioneel)</label>
            <input style={inputStyle} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Bijv: Over Plastimed" disabled={loading} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Content om te analyseren</label>
            <textarea
              style={{ ...textareaStyle, minHeight: '180px' }}
              value={seoContent}
              onChange={(e) => setSeoContent(e.target.value)}
              placeholder="Plak hier de pagina content..."
              disabled={loading}
            />
          </div>
          <button type="button" style={btnStyle('primary')} onClick={handleSEO} disabled={loading || !seoContent.trim()}>
            {loading ? 'Analyseren...' : 'Analyseer SEO'}
          </button>
          {seoAnalysis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                  backgroundColor: seoAnalysis.score >= 80 ? '#22c55e' : seoAnalysis.score >= 60 ? '#f59e0b' : '#ef4444',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.1rem',
                }}>
                  {seoAnalysis.score}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>SEO Score</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {seoAnalysis.score >= 80 ? 'Uitstekend' : seoAnalysis.score >= 60 ? 'Kan beter' : 'Heeft aandacht nodig'}
                  </div>
                </div>
              </div>
              {seoAnalysis.issues?.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Gevonden issues</label>
                  {seoAnalysis.issues.map((issue: any, i: number) => (
                    <div key={i} style={{
                      padding: '0.5rem 0.75rem', marginBottom: '0.375rem', fontSize: '0.8rem',
                      borderLeft: `3px solid ${issue.severity === 'critical' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6'}`,
                      backgroundColor: issue.severity === 'critical' ? '#fef2f2' : issue.severity === 'warning' ? '#fffbeb' : '#eff6ff',
                      borderRadius: '0 0.25rem 0.25rem 0',
                    }}>
                      <div style={{ fontWeight: 600 }}>{issue.issue}</div>
                      <div style={{ color: '#6b7280', marginTop: '0.125rem' }}>{issue.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
              {seoAnalysis.suggestions?.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Suggesties</label>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#374151' }}>
                    {seoAnalysis.suggestions.map((s: string, i: number) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Translate Tab */}
      {activeTab === 'translate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Tekst om te vertalen</label>
            <textarea
              style={textareaStyle}
              value={translateContent}
              onChange={(e) => setTranslateContent(e.target.value)}
              placeholder="Plak hier de tekst die je wilt vertalen..."
              disabled={loading}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Doeltaal</label>
            <select style={selectStyle} value={targetLang} onChange={(e) => setTargetLang(e.target.value)} disabled={loading}>
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <button type="button" style={btnStyle('primary')} onClick={handleTranslate} disabled={loading || !translateContent.trim()}>
            {loading ? 'Vertalen...' : 'Vertaal'}
          </button>
          {translatedContent && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Vertaling</label>
                <button type="button" style={btnStyle('secondary')} onClick={() => handleCopy(translatedContent)}>
                  {copied ? 'Gekopieerd!' : 'Kopieer'}
                </button>
              </div>
              <div style={resultBoxStyle}>{translatedContent}</div>
            </div>
          )}
        </div>
      )}

      {/* Image Tab */}
      {activeTab === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Beschrijf de afbeelding</label>
            <textarea
              style={textareaStyle}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Bijv: Een professionele hero-afbeelding voor een medisch leverancier, met schone blauwe tinten en medische apparatuur..."
              disabled={loading}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Type</label>
              <select style={selectStyle} value={imageType} onChange={(e) => setImageType(e.target.value)} disabled={loading}>
                <option value="custom">Vrij</option>
                <option value="hero">Hero Afbeelding</option>
                <option value="featured">Featured / Blog</option>
                <option value="service-icon">Service Icon</option>
                <option value="team-photo">Team Foto</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Formaat</label>
              <select style={selectStyle} value={imageSize} onChange={(e) => setImageSize(e.target.value)} disabled={loading}>
                <option value="1024x1024">1024x1024 (Vierkant)</option>
                <option value="1792x1024">1792x1024 (Landscape)</option>
                <option value="1024x1792">1024x1792 (Portrait)</option>
              </select>
            </div>
          </div>
          <button type="button" style={btnStyle('primary')} onClick={handleGenerateImage} disabled={loading || !imagePrompt.trim()}>
            {loading ? 'Afbeelding genereren...' : 'Genereer Afbeelding'}
          </button>
          {loading && activeTab === 'image' && (
            <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
              DALL-E genereert je afbeelding, dit kan 10-30 seconden duren...
            </div>
          )}
          {imageResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <img
                  src={imageResult.url}
                  alt={imagePrompt}
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                />
              </div>
              {imageResult.revisedPrompt && (
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                  DALL-E prompt: {imageResult.revisedPrompt}
                </div>
              )}
              {savedMedia ? (
                <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#166534', marginBottom: '0.375rem' }}>
                    Opgeslagen in Media bibliotheek!
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#374151' }}>
                    Bestand: {savedMedia.filename}
                  </div>
                  <a
                    href={`/admin/collections/media/${savedMedia.id}`}
                    style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'underline', marginTop: '0.25rem', display: 'inline-block' }}
                  >
                    Bekijk in Media collectie
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    style={{ ...btnStyle('primary'), opacity: savingImage ? 0.6 : 1 }}
                    onClick={handleSaveToMedia}
                    disabled={savingImage}
                  >
                    {savingImage ? 'Opslaan...' : 'Opslaan in Media'}
                  </button>
                  <button type="button" style={btnStyle('secondary')} onClick={() => handleCopy(imageResult.url)}>
                    Kopieer URL
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
