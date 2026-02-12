/**
 * reCAPTCHA v3 Hook
 * Loads Google reCAPTCHA v3 and provides token generation
 */

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function useRecaptcha() {
  const [isReady, setIsReady] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    // Skip if no site key is configured
    if (!siteKey) {
      console.warn('[reCAPTCHA] Site key not configured - spam protection disabled')
      setIsReady(false)
      return
    }

    // Check if script is already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true)
      })
      return
    }

    // Load reCAPTCHA script
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true)
        })
      }
    }

    script.onerror = () => {
      console.error('[reCAPTCHA] Failed to load reCAPTCHA script')
      setIsReady(false)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup: remove script if component unmounts
      const scriptElement = document.querySelector(`script[src*="recaptcha"]`)
      if (scriptElement) {
        scriptElement.remove()
      }
    }
  }, [siteKey])

  /**
   * Execute reCAPTCHA and get a token for the specified action
   */
  const executeRecaptcha = async (action: string = 'submit'): Promise<string | null> => {
    if (!siteKey) {
      console.warn('[reCAPTCHA] Site key not configured - skipping verification')
      return null
    }

    if (!isReady || !window.grecaptcha) {
      console.warn('[reCAPTCHA] Not ready yet')
      return null
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action })
      return token
    } catch (error) {
      console.error('[reCAPTCHA] Error executing reCAPTCHA:', error)
      return null
    }
  }

  return {
    isReady,
    executeRecaptcha,
    isConfigured: !!siteKey,
  }
}
