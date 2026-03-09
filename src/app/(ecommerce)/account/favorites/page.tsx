'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import FavoritesTemplate from '@/branches/ecommerce/b2c/templates/account/AccountTemplate1/FavoritesTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'

export default function FavoritesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handleRemove = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit product uit je favorieten wilt verwijderen?')) return
    try {
      await fetch(`/api/account/favorites?id=${id}`, { method: 'DELETE', credentials: 'include' })
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      console.error('Error removing favorite:', err)
    }
  }

  return (
    <FavoritesTemplate
      favorites={favorites}
      onRemove={handleRemove}
      isLoading={authLoading || isLoading}
    />
  )
}
