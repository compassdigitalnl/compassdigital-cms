'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/branches/shared/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { Button } from '@/branches/shared/components/ui/button'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Input } from '@/branches/shared/components/ui/input'
import { Label } from '@/branches/shared/components/ui/label'
import { Badge } from '@/branches/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/branches/shared/components/ui/select'

export default function AIPlaygroundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 AI Content Playground
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Test alle AI-powered content tools op één plek
              </p>
            </div>
            <Badge variant="default" className="text-sm">
              7 Tools Beschikbaar
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="content-generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white p-1 rounded-lg shadow">
            <TabsTrigger value="content-generator">Content</TabsTrigger>
            <TabsTrigger value="seo-optimizer">SEO</TabsTrigger>
            <TabsTrigger value="content-analyzer">Analyse</TabsTrigger>
            <TabsTrigger value="translator">Vertalen</TabsTrigger>
            <TabsTrigger value="block-generator">Blocks</TabsTrigger>
            <TabsTrigger value="page-generator">Pagina's</TabsTrigger>
            <TabsTrigger value="multi-language">Multi-taal</TabsTrigger>
          </TabsList>

          {/* Content Generator Tab */}
          <TabsContent value="content-generator">
            <ContentGeneratorDemo />
          </TabsContent>

          {/* SEO Optimizer Tab */}
          <TabsContent value="seo-optimizer">
            <SEOOptimizerDemo />
          </TabsContent>

          {/* Content Analyzer Tab */}
          <TabsContent value="content-analyzer">
            <ContentAnalyzerDemo />
          </TabsContent>

          {/* Translator Tab */}
          <TabsContent value="translator">
            <TranslatorDemo />
          </TabsContent>

          {/* Block Generator Tab */}
          <TabsContent value="block-generator">
            <BlockGeneratorDemo />
          </TabsContent>

          {/* Page Generator Tab */}
          <TabsContent value="page-generator">
            <PageGeneratorDemo />
          </TabsContent>

          {/* Multi-language Tab */}
          <TabsContent value="multi-language">
            <MultiLanguageDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Content Generator Demo
function ContentGeneratorDemo() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [language, setLanguage] = useState('nl')
  const [maxTokens, setMaxTokens] = useState(500)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone, language, maxTokens }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.content)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>✍️ Content Generator</CardTitle>
        <CardDescription>
          Genereer tekst met AI - voor blogs, product beschrijvingen, social media, etc.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Prompt</Label>
          <Textarea
            placeholder="Bijvoorbeeld: Schrijf een professionele introductie voor een webdevelopment bedrijf..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Taal</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Max Woorden</Label>
            <Input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={loading || !prompt} className="w-full">
          {loading ? 'Genereren...' : 'Genereer Content'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Label className="mb-2 block">Resultaat:</Label>
            <p className="whitespace-pre-wrap text-sm">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// SEO Optimizer Demo
function SEOOptimizerDemo() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title,
          targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.analysis)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 SEO Optimizer</CardTitle>
        <CardDescription>
          Analyseer content op SEO en krijg een score + verbeteringen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Titel</Label>
          <Input
            placeholder="Pagina titel..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label>Content</Label>
          <Textarea
            placeholder="Plak hier de content die je wilt analyseren..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
        </div>

        <div>
          <Label>Target Keywords (komma gescheiden)</Label>
          <Input
            placeholder="seo, optimalisatie, content"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <Button onClick={handleAnalyze} disabled={loading || !content} className="w-full">
          {loading ? 'Analyseren...' : 'Analyseer SEO'}
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">SEO Score</p>
                <p className="text-3xl font-bold">{result.score}/100</p>
              </div>
              <Badge variant={result.score >= 70 ? 'default' : 'destructive'}>
                {result.score >= 80 ? 'Uitstekend' : result.score >= 70 ? 'Goed' : 'Kan beter'}
              </Badge>
            </div>

            {result.issues && result.issues.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Label className="mb-2 block">Issues ({result.issues.length}):</Label>
                <ul className="space-y-2 text-sm">
                  {result.issues.slice(0, 5).map((issue: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-600">⚠</span>
                      <span>{issue.issue || issue.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Label className="mb-2 block">Suggesties:</Label>
                <ul className="space-y-1 text-sm">
                  {result.suggestions.slice(0, 5).map((suggestion: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Content Analyzer Demo
function ContentAnalyzerDemo() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, language: 'nl', includeGrammarCheck: true }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.analysis)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Content Analyzer</CardTitle>
        <CardDescription>
          Analyseer content kwaliteit - leesbaarheid, toon, grammatica, structuur, sentiment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Content om te analyseren</Label>
          <Textarea
            placeholder="Plak hier de content die je wilt analyseren..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        <Button onClick={handleAnalyze} disabled={loading || !content} className="w-full">
          {loading ? 'Analyseren...' : 'Analyseer Content'}
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            {/* Overall Score */}
            <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Overall Kwaliteit</p>
                <p className="text-3xl font-bold">{result.overallScore}/100</p>
                <p className="text-xs text-gray-500 mt-1">{result.summary}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-gray-600">Leesbaarheid</p>
                <p className="text-xl font-bold">{result.readability?.score}/100</p>
                <p className="text-xs text-gray-500">{result.readability?.level}</p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-gray-600">Toon Consistentie</p>
                <p className="text-xl font-bold">{result.tone?.consistency?.score}/100</p>
                <p className="text-xs text-gray-500">{result.tone?.primaryTone}</p>
              </div>

              {result.grammar && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-gray-600">Grammatica</p>
                  <p className="text-xl font-bold">{result.grammar.overallScore}/100</p>
                  <p className="text-xs text-gray-500">{result.grammar.totalIssues} issues</p>
                </div>
              )}

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
                <p className="text-xs text-gray-600">Sentiment</p>
                <p className="text-xl font-bold capitalize">{result.sentiment?.overall}</p>
                <p className="text-xs text-gray-500">Score: {result.sentiment?.score}</p>
              </div>
            </div>

            {/* Top Improvements */}
            {result.improvements && result.improvements.length > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <Label className="mb-2 block">Top Verbeteringen:</Label>
                <ul className="space-y-2 text-sm">
                  {result.improvements.slice(0, 3).map((imp: any, i: number) => (
                    <li key={i} className="pb-2 border-b border-orange-100 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={imp.priority === 'high' ? 'destructive' : 'default'}>
                          {imp.priority}
                        </Badge>
                        <Badge variant="outline">{imp.category}</Badge>
                      </div>
                      <p className="font-medium">{imp.issue}</p>
                      <p className="text-gray-600">{imp.suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Translator Demo
function TranslatorDemo() {
  const [content, setContent] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTranslate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetLanguage }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.translation)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌍 Translator</CardTitle>
        <CardDescription>
          Vertaal content naar andere talen met AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Content om te vertalen</Label>
          <Textarea
            placeholder="Plak hier de tekst die je wilt vertalen..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>

        <div>
          <Label>Naar welke taal?</Label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
              <SelectItem value="it">🇮🇹 Italiano</SelectItem>
              <SelectItem value="pt">🇵🇹 Português</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleTranslate} disabled={loading || !content} className="w-full">
          {loading ? 'Vertalen...' : 'Vertaal'}
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Badge>Gedetecteerd: {result.detectedSourceLanguage.toUpperCase()}</Badge>
              <Badge variant={result.confidence >= 90 ? 'default' : 'secondary'}>
                Betrouwbaarheid: {result.confidence}%
              </Badge>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <Label className="mb-2 block">Vertaling:</Label>
              <p className="whitespace-pre-wrap text-sm">{result.translatedText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Block Generator Demo
function BlockGeneratorDemo() {
  const [blockType, setBlockType] = useState('hero')
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType,
          mode: 'smart',
          businessInfo: {
            name: companyName,
            industry,
            targetAudience: 'Professionals',
          },
        }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.block)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🧩 Block Generator</CardTitle>
        <CardDescription>
          Genereer complete content blocks (Hero, Services, FAQ, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Block Type</Label>
          <Select value={blockType} onValueChange={setBlockType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">Hero Section</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
              <SelectItem value="testimonials">Testimonials</SelectItem>
              <SelectItem value="cta">Call-to-Action</SelectItem>
              <SelectItem value="content">Content Section</SelectItem>
              <SelectItem value="pricing">Pricing</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Bedrijfsnaam</Label>
          <Input
            placeholder="Bijvoorbeeld: WebDev Pro"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div>
          <Label>Industrie</Label>
          <Input
            placeholder="Bijvoorbeeld: Technology, Healthcare, etc."
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading || !companyName} className="w-full">
          {loading ? 'Genereren...' : `Genereer ${blockType} Block`}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="mb-2 block">Gegenereerd Block (JSON):</Label>
            <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Page Generator Demo
function PageGeneratorDemo() {
  const [pageType, setPageType] = useState('landing')
  const [purpose, setPurpose] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-page-from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: pageType,
          pagePurpose: purpose,
          businessInfo: {
            name: companyName,
            industry: 'Technology',
          },
        }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.page)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📄 Page Generator</CardTitle>
        <CardDescription>
          Genereer complete pagina's met meerdere blocks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Pagina Type</Label>
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landing">Landing Page</SelectItem>
              <SelectItem value="about">About Page</SelectItem>
              <SelectItem value="services">Services Page</SelectItem>
              <SelectItem value="contact">Contact Page</SelectItem>
              <SelectItem value="blog">Blog Post</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Bedrijfsnaam</Label>
          <Input
            placeholder="Bijvoorbeeld: WebDev Pro"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div>
          <Label>Pagina Doel/Beschrijving</Label>
          <Textarea
            placeholder="Bijvoorbeeld: Landing page voor een AI-powered website builder SaaS product..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading || !companyName || !purpose} className="w-full">
          {loading ? 'Genereren...' : `Genereer ${pageType} Page`}
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Label className="mb-2 block">Pagina Metadata:</Label>
              <div className="text-sm space-y-1">
                <p><strong>Titel:</strong> {result.metadata?.title}</p>
                <p><strong>Slug:</strong> {result.metadata?.slug}</p>
                <p><strong>Beschrijving:</strong> {result.metadata?.metaDescription}</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <Label className="mb-2 block">Blocks ({result.blocks?.length}):</Label>
              <ul className="text-sm space-y-1">
                {result.blocks?.map((block: any, i: number) => (
                  <li key={i}>• {block.blockType}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Label className="mb-2 block">Volledige Data (JSON):</Label>
              <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Multi-language Demo
function MultiLanguageDemo() {
  const [content, setContent] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en', 'de'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const languages = [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ]

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    )
  }

  const handleTranslate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/translate-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetLanguages: selectedLanguages }),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.multiLangContent)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌐 Multi-language Translator</CardTitle>
        <CardDescription>
          Vertaal content naar meerdere talen tegelijk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Content om te vertalen</Label>
          <Textarea
            placeholder="Plak hier de tekst die je wilt vertalen..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>

        <div>
          <Label className="mb-3 block">Selecteer talen ({selectedLanguages.length} geselecteerd):</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedLanguages.includes(lang.code)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang.code)}
                    onChange={() => toggleLanguage(lang.code)}
                    className="cursor-pointer"
                  />
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleTranslate} disabled={loading || !content || selectedLanguages.length === 0} className="w-full">
          {loading ? 'Vertalen...' : `Vertaal naar ${selectedLanguages.length} talen`}
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Label className="mb-2 block">Origineel:</Label>
              <p className="text-sm whitespace-pre-wrap">{result.original}</p>
            </div>

            {Object.entries(result.translations || {}).map(([langCode, translation]: [string, any]) => {
              const lang = languages.find(l => l.code === langCode)
              return (
                <div key={langCode} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{lang?.flag}</span>
                    <Label>{lang?.name}</Label>
                    <Badge variant={translation.confidence >= 90 ? 'default' : 'secondary'}>
                      {translation.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{translation.text}</p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
