'use client'

import React, { useState } from 'react'
import { Heart, Share2, Link as LinkIcon, Check, Globe, Lock } from 'lucide-react'
import { AccountEmptyState, AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import { FavoriteCard } from '@/branches/ecommerce/b2c/components/account/favorites'
import type { FavoritesTemplateProps } from './types'

export default function FavoritesTemplate({
  favorites,
  onRemove,
  isLoading,
  shareEnabled = false,
  shareUrl,
  onToggleShare,
  isTogglingShare = false,
}: FavoritesTemplateProps) {
  const [copied, setCopied] = useState(false)

  if (isLoading) return <AccountLoadingSkeleton variant="page" />

  const fullShareUrl = shareUrl ? `${typeof window !== 'undefined' ? window.location.origin : ''}${shareUrl}` : null

  const handleCopyLink = async () => {
    if (!fullShareUrl) return
    try {
      await navigator.clipboard.writeText(fullShareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = fullShareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-navy">Favorieten</h1>
          <p className="text-sm lg:text-base text-grey-mid">Je opgeslagen producten en wishlist</p>
        </div>

        {/* Share Controls */}
        {favorites.length > 0 && onToggleShare && (
          <div className="flex flex-col sm:items-end gap-2">
            <button
              onClick={() => onToggleShare(!shareEnabled)}
              disabled={isTogglingShare}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                shareEnabled
                  ? 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                  : 'bg-grey-light text-grey-dark border border-grey-light hover:bg-grey-light'
              } ${isTogglingShare ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {shareEnabled ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isTogglingShare ? 'Bezig...' : shareEnabled ? 'Openbaar' : 'Prive'}
            </button>

            {shareEnabled && fullShareUrl && (
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-grey-light rounded-lg text-sm text-grey-dark hover:bg-grey-light transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green" />
                    <span className="text-green">Gekopieerd!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4" />
                    <span>Kopieer link</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="text-sm text-grey-dark">
          <strong>{favorites.length}</strong> {favorites.length === 1 ? 'product' : 'producten'} in je favorieten
          {shareEnabled && (
            <span className="ml-2 inline-flex items-center gap-1 text-teal">
              <Share2 className="w-3.5 h-3.5" />
              Gedeeld
            </span>
          )}
        </div>
      )}

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <FavoriteCard key={fav.id} favorite={fav} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <AccountEmptyState
          icon={Heart}
          title="Geen favorieten"
          description="Je hebt nog geen producten opgeslagen in je favorieten. Klik op het hartje bij een product om het toe te voegen."
          actionLabel="Bekijk producten"
          actionHref="/shop"
        />
      )}
    </div>
  )
}
