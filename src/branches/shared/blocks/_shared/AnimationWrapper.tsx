'use client'

import React, { useRef, useEffect, useState } from 'react'

export interface AnimationProps {
  enableAnimation?: boolean | null
  animationType?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in' | null
  animationDuration?: 'fast' | 'normal' | 'slow' | null
  animationDelay?: number | null
}

interface AnimationWrapperProps extends AnimationProps {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const durationMap = {
  fast: 'duration-[400ms]',
  normal: 'duration-[600ms]',
  slow: 'duration-[800ms]',
}

const typeMap = {
  'fade-up': 'translate-y-8 opacity-0',
  'fade-in': 'opacity-0',
  'fade-left': 'translate-x-8 opacity-0',
  'fade-right': '-translate-x-8 opacity-0',
  'scale-in': 'scale-95 opacity-0',
}

/**
 * AnimationWrapper — Wraps block content with scroll-triggered animations
 *
 * Uses Intersection Observer for performance.
 * Respects prefers-reduced-motion automatically.
 */
export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  enableAnimation,
  animationType = 'fade-up',
  animationDuration = 'normal',
  animationDelay = 0,
  children,
  className = '',
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enableAnimation) {
      setIsVisible(true)
      return
    }

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [enableAnimation])

  if (!enableAnimation) {
    return <Tag className={className}>{children}</Tag>
  }

  const type = animationType || 'fade-up'
  const duration = animationDuration || 'normal'
  const delay = animationDelay || 0

  const initialClasses = typeMap[type] || typeMap['fade-up']
  const durationClass = durationMap[duration] || durationMap['normal']
  const delayStyle = delay > 0 ? { transitionDelay: `${delay * 0.1}s` } : undefined

  return (
    <Tag
      ref={ref as any}
      className={`transition-all ease-out ${durationClass} ${isVisible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : initialClasses} ${className}`}
      style={delayStyle}
    >
      {children}
    </Tag>
  )
}
