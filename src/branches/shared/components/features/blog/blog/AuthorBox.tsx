'use client'
import React from 'react'
import type { User } from '@/payload-types'

interface AuthorBoxProps {
  author: User | string | null | undefined
  authorBio?: string | null
  className?: string
}

export const AuthorBox: React.FC<AuthorBoxProps> = ({ author, authorBio, className = '' }) => {
  if (!author || typeof author === 'string') {
    return null
  }

  const user = author as User

  // Get author initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const authorName = user.name || 'Auteur'
  const authorRole = user.role || 'Redacteur'
  const bio = authorBio || user.bio || 'Expert in medische supplies en zorgproducten.'

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-6 flex gap-4 items-center ${className}`}
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-extrabold text-lg">{getInitials(authorName)}</span>
      </div>

      {/* Author Info */}
      <div className="flex-1">
        <div className="font-extrabold text-sm text-gray-900">{authorName}</div>
        <div className="text-xs text-gray-500 mb-1">{authorRole}</div>
        <p className="text-sm text-gray-600 line-clamp-2">{bio}</p>
      </div>
    </div>
  )
}
