'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import FavoritesTemplate from '@/branches/ecommerce/b2c/templates/account/AccountTemplate1/FavoritesTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import type { FavoriteProduct } from '@/branches/ecommerce/b2c/templates/account/AccountTemplate1/FavoritesTemplate/types'

export default function FavoritesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shareEnabled, setShareEnabled] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isTogglingShare, setIsTogglingShare] = useState(false)

  const fetchFavorites = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/account/favorites', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setFavorites(data.docs || [])
      }
    } catch (err) {
      console.error('Error fetching favorites:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const fetchShareStatus = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch('/api/account/favorites/share', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setShareEnabled(data.enabled || false)
        setShareUrl(data.shareUrl || null)
      }
    } catch (err) {
      console.error('Error fetching share status:', err)
    }
  }, [user])

  useEffect(() => {
    fetchFavorites()
    fetchShareStatus()
  }, [fetchFavorites, fetchShareStatus])

  const handleRemove = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit product uit je favorieten wilt verwijderen?')) return
    try {
      await fetch(`/api/account/favorites?id=${id}`, { method: 'DELETE', credentials: 'include' })
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      console.error('Error removing favorite:', err)
    }
  }

  const handleToggleShare = async (enabled: boolean) => {
    setIsTogglingShare(true)
    try {
      const res = await fetch('/api/account/favorites/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled }),
      })
      if (res.ok) {
        const data = await res.json()
        setShareEnabled(data.enabled)
        setShareUrl(data.shareUrl)
      }
    } catch (err) {
      console.error('Error toggling share:', err)
    } finally {
      setIsTogglingShare(false)
    }
  }

  return (
    <FavoritesTemplate
      favorites={favorites}
      onRemove={handleRemove}
      isLoading={authLoading || isLoading}
      shareEnabled={shareEnabled}
      shareUrl={shareUrl}
      onToggleShare={handleToggleShare}
      isTogglingShare={isTogglingShare}
    />
  )
}
