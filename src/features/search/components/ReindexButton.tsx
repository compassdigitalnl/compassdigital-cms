'use client'

import React, { useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

export const ReindexButton: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    if (loading) {
      toast.info('Reindex is al bezig...')
      return
    }

    setLoading(true)

    try {
      toast.promise(
        fetch('/api/meilisearch/reindex', {
          method: 'POST',
          credentials: 'include',
        }).then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Reindex mislukt')
          return data
        }),
        {
          loading: 'Bezig met reindexen...',
          success: 'Reindex voltooid!',
          error: 'Reindex mislukt. Controleer server logs.',
        },
      )
    } catch (err) {
      console.error('Reindex error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="btn btn--style-secondary btn--size-medium"
        style={{
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Bezig...' : 'Reindex Nu'}
      </button>
      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
        Herindexeer alle ingeschakelde collections in Meilisearch (products, blog posts, pages).
      </p>
    </div>
  )
}
