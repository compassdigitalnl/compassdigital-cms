import React from 'react'
import Link from 'next/link'
import type { TopBarBlock as TopBarType } from '@/payload-types'
import { Icon } from '@/components/Icon'

export const TopBar: React.FC<TopBarType> = async ({
  enabled = true,
  useGlobalSettings = true,
  backgroundColor = '#0A1628',
  textColor = '#FFFFFF',
  leftMessages,
  rightLinks,
}) => {
  if (!enabled) return null

  // Fetch from global settings if enabled
  let messages = leftMessages || []
  let links = rightLinks || []
  let bgColor = backgroundColor
  let txtColor = textColor

  if (useGlobalSettings) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      const response = await fetch(`${baseUrl}/api/globals/site-settings`, {
        cache: 'no-store', // Always fetch fresh data
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Check if topBar settings exist in global settings
        if (data.topBar) {
          messages = data.topBar.leftMessages || messages
          links = data.topBar.rightLinks || links
          bgColor = data.topBar.backgroundColor || bgColor
          txtColor = data.topBar.textColor || txtColor
        }
      } else {
        console.error(`Failed to fetch global settings: ${response.status}`)
        // Fallback to props
      }
    } catch (error) {
      console.error('Error fetching global settings:', error)
      // Fallback to props values
    }
  }

  return (
    <div
      className="border-b border-white/10"
      style={{
        backgroundColor: bgColor,
        color: txtColor,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-6">
            {messages.map((message, index) => (
              <div key={index} className="flex items-center gap-2">
                {message.icon && <Icon name={message.icon} size={16} className="flex-shrink-0" />}
                {message.link ? (
                  <Link
                    href={message.link}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {message.text}
                  </Link>
                ) : (
                  <span>{message.text}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.link}
                className="hover:opacity-80 transition-opacity font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
