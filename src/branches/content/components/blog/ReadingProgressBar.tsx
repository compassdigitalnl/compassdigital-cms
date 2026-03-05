'use client'
import React, { useEffect, useState } from 'react'

interface ReadingProgressBarProps {
  className?: string
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ className = '' }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY

      if (documentHeight > 0) {
        const scrollProgress = (scrollTop / documentHeight) * 100
        setProgress(Math.min(100, Math.max(0, scrollProgress)))
      }
    }

    // Initial calculation
    updateProgress()

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      style={{ height: '3px' }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      {/* Background track */}
      <div
        className="absolute inset-0 bg-gray-200/50 backdrop-blur-sm"
        style={{ height: '3px' }}
      />

      {/* Progress bar with gradient */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 ? '0 0 10px rgba(0, 137, 123, 0.5)' : 'none',
        }}
      />
    </div>
  )
}
