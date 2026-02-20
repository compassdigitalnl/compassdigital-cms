'use client'
import React from 'react'
import { Icon } from '@/components/Icon'
import type { InfoBoxBlock } from '@/payload-types'

export const InfoBoxComponent: React.FC<InfoBoxBlock> = ({ type = 'info', icon, title, content }) => {
  // Determine colors based on type
  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          background: '#FFF8E1', // amber-light
          border: 'rgba(245, 158, 11, 0.2)', // amber
          iconBg: 'white',
          iconColor: '#F59E0B', // amber
        }
      case 'success':
        return {
          background: '#E8F5E9', // green-light
          border: 'rgba(0, 200, 83, 0.2)', // green
          iconBg: 'white',
          iconColor: '#00C853', // green
        }
      case 'danger':
        return {
          background: '#FFF0F0', // coral-light
          border: 'rgba(255, 107, 107, 0.2)', // coral
          iconBg: 'white',
          iconColor: '#FF6B6B', // coral
        }
      default: // info
        return {
          background: 'rgba(0, 137, 123, 0.12)', // teal-glow
          border: 'rgba(0, 137, 123, 0.15)', // teal
          iconBg: 'white',
          iconColor: '#00897B', // teal
        }
    }
  }

  const colors = getColors()

  return (
    <div
      style={{
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: '14px',
        padding: '20px 24px',
        margin: '24px 0',
        display: 'flex',
        gap: '14px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '36px',
          height: '36px',
          background: colors.iconBg,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon || 'Lightbulb'} size={18} style={{ color: colors.iconColor }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 800,
              color: '#0A1628', // navy
              marginBottom: '4px',
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontSize: '14px',
            color: '#64748B', // grey-dark
            lineHeight: 1.6,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
