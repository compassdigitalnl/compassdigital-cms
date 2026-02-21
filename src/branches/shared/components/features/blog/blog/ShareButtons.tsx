'use client'
import React from 'react'
import { Icon } from '@/branches/shared/components/common/Icon'

interface ShareButtonsProps {
  title: string
  url: string
  className?: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, className = '' }) => {
  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    let shareUrl = ''

    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
        break
      case 'print':
        window.print()
        return
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link gekopieerd naar klembord!')
        })
        return
      default:
        return
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900">Delen:</span>

        <button
          onClick={() => handleShare('linkedin')}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all"
          title="Delen op LinkedIn"
          aria-label="Delen op LinkedIn"
        >
          <Icon name="Linkedin" size={17} />
        </button>

        <button
          onClick={() => handleShare('twitter')}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all"
          title="Delen op Twitter"
          aria-label="Delen op Twitter"
        >
          <Icon name="Twitter" size={17} />
        </button>

        <button
          onClick={() => handleShare('email')}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all"
          title="Delen via e-mail"
          aria-label="Delen via e-mail"
        >
          <Icon name="Mail" size={17} />
        </button>

        <button
          onClick={() => handleShare('copy')}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all"
          title="Link kopiëren"
          aria-label="Link kopiëren"
        >
          <Icon name="Link" size={17} />
        </button>

        <button
          onClick={() => handleShare('print')}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all"
          title="Printen"
          aria-label="Printen"
        >
          <Icon name="Printer" size={17} />
        </button>
      </div>
    </div>
  )
}
