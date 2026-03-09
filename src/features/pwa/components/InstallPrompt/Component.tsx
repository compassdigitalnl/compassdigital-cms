'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { InstallPromptProps } from './types'

/**
 * BeforeInstallPromptEvent is not yet in the standard TS lib types.
 * We declare it here for type safety.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

const DISMISS_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 dagen

/**
 * InstallPrompt — "Voeg toe aan startscherm" banner.
 *
 * Luistert naar het 'beforeinstallprompt' event van de browser en toont
 * een banner onderaan het scherm om de PWA te installeren.
 *
 * - Verbergt automatisch als de app al in standalone-modus draait
 * - Onthoudt afwijzing voor 7 dagen via localStorage
 * - Volledig Nederlandse teksten
 */
export function InstallPrompt({ appName = 'deze app', className = '' }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null)

  // Check of de banner eerder is afgewezen
  const isDismissed = useCallback((): boolean => {
    if (typeof window === 'undefined') return true
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY)
      if (!dismissed) return false
      const dismissedAt = parseInt(dismissed, 10)
      if (isNaN(dismissedAt)) return false
      return Date.now() - dismissedAt < DISMISS_DURATION_MS
    } catch {
      return false
    }
  }, [])

  // Check of de app al geinstalleerd is (standalone modus)
  const isStandalone = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  }, [])

  useEffect(() => {
    // Niet tonen als al geinstalleerd of eerder afgewezen
    if (isStandalone() || isDismissed()) return

    const handleBeforeInstallPrompt = (e: Event) => {
      // Voorkom dat de browser zijn eigen prompt toont
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      promptRef.current = event
      setDeferredPrompt(event)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Verberg de banner als de app succesvol geinstalleerd is
    const handleAppInstalled = () => {
      setIsVisible(false)
      setDeferredPrompt(null)
      promptRef.current = null
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isDismissed, isStandalone])

  const handleInstall = async () => {
    const prompt = promptRef.current
    if (!prompt) return

    setIsInstalling(true)

    try {
      await prompt.prompt()
      const choiceResult = await prompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false)
      }
    } catch (error) {
      console.error('[InstallPrompt] Installatie mislukt:', error)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
      promptRef.current = null
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setDeferredPrompt(null)
    promptRef.current = null

    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // localStorage niet beschikbaar
    }
  }

  if (!isVisible || !deferredPrompt) return null

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg bg-primary text-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 ${className}`}
      role="alert"
      aria-label="App installeren"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">
          Installeer {appName} voor snellere toegang
        </p>
        <p className="text-xs opacity-80 mt-0.5">
          Voeg toe aan je startscherm
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1"
          type="button"
        >
          Niet nu
        </button>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-white text-primary font-semibold text-sm px-4 py-2 rounded-md hover:bg-white/90 transition-colors disabled:opacity-50"
          type="button"
        >
          {isInstalling ? 'Bezig...' : 'Installeren'}
        </button>
      </div>
    </div>
  )
}
