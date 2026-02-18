'use client'

import React, { useState, useEffect } from 'react'
import { WizardState, GeneratedSite } from '@/lib/siteGenerator/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Check, X, Rocket, ExternalLink, AlertCircle } from 'lucide-react'

interface Props {
  wizardData: WizardState
}

export function WizardStep5Generate({ wizardData }: Props) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [adminUrl, setAdminUrl] = useState<string | null>(null)
  const [cmsConfigSummary, setCmsConfigSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startGeneration = async () => {
    setStatus('generating')
    setProgress(0)
    setError(null)

    try {
      // Generate a unique connection ID for SSE
      const connectionId = `wizard-${Date.now()}-${Math.random().toString(36).substring(7)}`

      // Start listening to SSE updates
      const eventSource = new EventSource(`/api/ai/stream/${connectionId}`)

      // Wait for SSE connection to be established
      await new Promise<void>((resolve) => {
        eventSource.onopen = () => {
          console.log('✅ SSE connection established')
          resolve()
        }

        eventSource.onmessage = (event) => {
          const update = JSON.parse(event.data)
          console.log('📨 SSE message received:', update.type, update.progress)

          if (update.type === 'connected') {
            // Initial connection message, ignore
            return
          }

          if (update.type === 'progress') {
            setProgress(update.progress || 0)
            setCurrentStep(update.message || '')
          } else if (update.type === 'complete') {
            setStatus('completed')
            setProgress(100)
            setPreviewUrl(update.data?.deploymentUrl || update.data?.previewUrl || null)
            setAdminUrl(update.data?.adminUrl || null)
            setCmsConfigSummary(update.data?.cmsConfig?.summary || null)
            eventSource.close()
          } else if (update.type === 'error') {
            setStatus('failed')
            setError(update.error || 'Er is een fout opgetreden')
            eventSource.close()
          }
        }

        eventSource.onerror = (error) => {
          console.error('❌ SSE connection error:', error)
          eventSource.close()
        }

        // Timeout fallback
        setTimeout(() => resolve(), 2000)
      })

      // STEP 1: Start the provisioning job (AI + Ploi deployment)
      // This will create the client record automatically as part of provisioning
      setCurrentStep('Provisioning starten...')
      console.log('🚀 Starting provisioning with connectionId:', connectionId)
      const response = await fetch('/api/wizard/provision-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wizardData,
          sseConnectionId: connectionId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || data.message || 'Site provisioning failed')
      }
    } catch (err: any) {
      setStatus('failed')
      setError(err.message || 'Er is een fout opgetreden')
    }
  }

  const progressSteps = [
    { min: 0, max: 4, label: 'CMS-configuratie bepalen...' },
    { min: 4, max: 10, label: 'Client record aanmaken...' },
    { min: 10, max: 25, label: 'Database provisioning (Railway)...' },
    { min: 25, max: 45, label: 'Ploi site aanmaken...' },
    { min: 45, max: 60, label: 'Repository deployen...' },
    { min: 60, max: 70, label: 'Omgevingsvariabelen instellen...' },
    { min: 70, max: 80, label: 'DNS configureren (Cloudflare)...' },
    { min: 80, max: 90, label: 'SSL certificaat activeren...' },
    { min: 90, max: 99, label: 'CMS online brengen...' },
    { min: 99, max: 100, label: 'Voltooien...' },
  ]

  const getCurrentProgressLabel = () => {
    if (currentStep) return currentStep
    const step = progressSteps.find((s) => progress >= s.min && progress < s.max)
    return step?.label || 'Verwerken...'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🚀 CMS Provisionen & Deployen</h2>
        <p className="mt-1 text-sm text-gray-600">
          Klaar om uw gepersonaliseerde CMS live te zetten? Dit duurt ongeveer 5-10 minuten.
        </p>
      </div>

      {/* Summary */}
      {status === 'idle' && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">📋 Samenvatting</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrijf:</span>
                <span className="font-medium">{wizardData.companyInfo.name}</span>
              </div>
              {wizardData.siteGoal?.primaryType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Site type:</span>
                  <span className="font-medium capitalize">
                    {wizardData.siteGoal.primaryType}
                    {wizardData.siteGoal.websiteSubType && ` — ${wizardData.siteGoal.websiteSubType}`}
                    {wizardData.siteGoal.shopModel && ` — ${wizardData.siteGoal.shopModel}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Industrie:</span>
                <span className="font-medium">{wizardData.companyInfo.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taal:</span>
                <span className="font-medium">{wizardData.content.language.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Design stijl:</span>
                <span className="font-medium capitalize">{wizardData.design?.style}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Pagina's:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {wizardData.content.pages.map((page) => (
                    <Badge key={page} variant="secondary" className="text-xs">
                      {page}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Features:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {Object.entries(wizardData.features)
                    .filter(([_, enabled]) => enabled)
                    .map(([key]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}
                      </Badge>
                    ))}
                  {(wizardData.extraFeatures ?? []).map((f) => (
                    <Badge key={f} variant="outline" className="text-xs border-purple-300 text-purple-700">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      {status === 'generating' && (
        <Card className="border-2 border-blue-600">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Uw website wordt gegenereerd...</h3>
                  <p className="text-sm text-gray-600">{getCurrentProgressLabel()}</p>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {progress}%
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 transition-all duration-500 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && (
                    <span className="text-xs text-white font-semibold">{progress}%</span>
                  )}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-gray-600">
                  ⏱️ Geschatte tijd: 5-10 minuten (database + Ploi deployment + DNS)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion */}
      {status === 'completed' && (
        <Card className="border-2 border-green-600 bg-green-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-green-900">
                    CMS succesvol geprovisioned! 🎉
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {cmsConfigSummary || 'Uw CMS is live en volledig geconfigureerd op Ploi'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {previewUrl && (
                  <Button asChild className="flex-1" size="lg">
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Bekijk Live Website
                    </a>
                  </Button>
                )}
                {adminUrl && (
                  <Button asChild variant="outline" size="lg" className="flex-1">
                    <a href={adminUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open CMS Admin
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {status === 'failed' && (
        <Card className="border-2 border-red-600 bg-red-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <X className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-red-900">Er is een fout opgetreden</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>

              <Button onClick={startGeneration} variant="destructive" size="lg" className="w-full">
                Opnieuw proberen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Button */}
      {status === 'idle' && (
        <div className="space-y-4">
          <Button
            onClick={startGeneration}
            size="lg"
            className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Rocket className="w-5 h-5 mr-2" />
            CMS Provisionen & Deployen
          </Button>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Let op:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Dit proces kan 5-10 minuten duren (database + deployment + DNS)</li>
                <li>Sluit deze pagina niet tijdens het provisioning</li>
                <li>Uw CMS wordt automatisch gedeployed via Ploi</li>
                <li>Na deployment heeft u direct toegang tot de admin-omgeving</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
