import React from 'react'
import type { AccountLoadingSkeletonProps } from './types'

function Bone({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-grey-light ${className}`} />
  )
}

export function AccountLoadingSkeleton({ variant = 'page' }: AccountLoadingSkeletonProps) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
            <Bone className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg mb-3" />
            <Bone className="h-6 w-16 mb-2" />
            <Bone className="h-4 w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Bone className="h-5 w-40" />
              <Bone className="h-5 w-24" />
              <Bone className="h-5 w-20 hidden lg:block" />
              <Bone className="h-5 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div>
          <Bone className="h-8 w-64 mb-2" />
          <Bone className="h-5 w-40" />
        </div>
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
          <Bone className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Bone className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Bone className="h-4 w-48 mb-2" />
                  <Bone className="h-3 w-24" />
                </div>
                <Bone className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default: page skeleton
  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <Bone className="h-8 w-48 mb-2" />
        <Bone className="h-5 w-64" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
            <Bone className="w-10 h-10 rounded-lg mb-3" />
            <Bone className="h-6 w-16 mb-2" />
            <Bone className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <Bone className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Bone key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
