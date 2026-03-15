'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PushPermissionBannerProps } from './types'

const DISMISS_KEY = 'push-dismissed'
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 dagen

/**
 * Convert a base64-encoded VAPID public key to a Uint8Array
 * for use with PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

/**
 * PushPermissionBanner — Push notificatie toestemming.
 *
 * Toont een banner die de gebruiker vraagt om push notificaties
 * toe te staan. Verschijnt pas na een vertraging (standaard 30s)
 * om de gebruiker niet direct te onderbreken.
 *
 * Workflow:
 * 1. Gebruiker klikt "Ja, graag"
 * 2. Browser toont native Notification.requestPermission() dialoog
 * 3. Bij toestemming: push abonnement aanmaken via Service Worker
 * 4. Abonnement opslaan via POST /api/pwa/subscribe
 */
export function PushPermissionBanner({
  delayMs = 30000,
  className = '',
}: PushPermissionBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

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

  // Check of push notificaties beschikbaar zijn
  const isPushSupported = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
  }, [])

  useEffect(() => {
    // Niet tonen als push niet ondersteund wordt
    if (!isPushSupported()) return

    // Niet tonen als al toestemming is gegeven
    if (Notification.permission === 'granted') return

    // Niet tonen als de gebruiker het heeft geweigerd (browser-niveau)
    if (Notification.permission === 'denied') return

    // Niet tonen als eerder afgewezen via onze banner
    if (isDismissed()) return

    // Toon de banner na een vertraging
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs, isDismissed, isPushSupported])

  const handleAccept = async () => {
    setIsSubscribing(true)

    try {
      // Stap 1: Vraag notificatietoestemming
      const permission = await Notification.requestPermission()

      if (permission !== 'granted') {
        setIsVisible(false)
        return
      }

      // Stap 2: Haal de Service Worker registratie op
      const registration = await navigator.serviceWorker.ready

      // Stap 3: Maak een push abonnement aan
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.error('[PushPermissionBanner] NEXT_PUBLIC_VAPID_PUBLIC_KEY is niet geconfigureerd')
        setIsVisible(false)
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // Stap 4: Sla het abonnement op via de API
      const subscriptionJSON = subscription.toJSON()
      await fetch('/api/pwa/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscriptionJSON.endpoint,
          keys: {
            p256dh: subscriptionJSON.keys?.p256dh || '',
            auth: subscriptionJSON.keys?.auth || '',
          },
          userAgent: navigator.userAgent,
        }),
      })

      setIsVisible(false)
    } catch (error) {
      console.error('[PushPermissionBanner] Abonnement mislukt:', error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)

    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // localStorage niet beschikbaar
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg bg-white border border-grey-light rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-4 ${className}`}
      role="alert"
      aria-label="Push notificaties inschakelen"
    >
      <div className="flex items-start gap-3">
        {/* Bell icon */}
        <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy leading-snug">
            Wil je meldingen ontvangen over bestellingen en aanbiedingen?
          </p>
          <p className="text-xs text-grey-mid mt-1">
            Je kunt dit later altijd uitschakelen in je browserinstellingen.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAccept}
              disabled={isSubscribing}
              className="bg-primary text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              type="button"
            >
              {isSubscribing ? 'Bezig...' : 'Ja, graag'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-sm text-grey-mid hover:text-grey-dark transition-colors px-3 py-2"
              type="button"
            >
              Nee, bedankt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
