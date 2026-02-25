'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Bell, Clock, ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { NotificationCenterProps, NotificationType, NotificationIconColor, NotificationTab, Notification } from './types'

// Helper: Format relative time
function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date()
  const then = new Date(isoTimestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Zojuist'
  if (diffMins < 60) return `${diffMins} min geleden`
  if (diffHours < 24) return `${diffHours} uur geleden`
  if (diffDays === 1) return '1 dag geleden'
  if (diffDays < 7) return `${diffDays} dagen geleden`
  return `${Math.floor(diffDays / 7)} weken geleden`
}

// Helper: Get icon background color
function getIconBackground(color: NotificationIconColor): string {
  const bgMap: Record<NotificationIconColor, string> = {
    green: 'var(--green-light)',
    teal: 'var(--teal-glow)',
    blue: 'var(--blue-light)',
    amber: 'var(--amber-light)',
    coral: 'var(--coral-light)',
  }
  return bgMap[color]
}

// Helper: Get icon color
function getIconColor(color: NotificationIconColor): string {
  const colorMap: Record<NotificationIconColor, string> = {
    green: 'var(--green)',
    teal: 'var(--teal)',
    blue: '#2196F3',
    amber: '#F59E0B',
    coral: 'var(--coral)',
  }
  return colorMap[color]
}

// Helper: Map tab to notification type
const tabTypeMap: Record<NotificationTab, NotificationType | null> = {
  Alles: null,
  Bestellingen: 'order',
  Voorraad: 'stock',
  Systeem: 'system',
}

/**
 * NotificationCenter Component
 *
 * Notification center dropdown from header bell icon. Shows order updates, stock alerts,
 * invoices, and system messages.
 *
 * @example
 * ```tsx
 * <NotificationCenter
 *   notifications={notifications}
 *   unreadCount={4}
 *   onMarkAllRead={handleMarkAllRead}
 *   onNotificationClick={handleNotificationClick}
 *   onViewAll={() => router.push('/account/notifications')}
 * />
 * ```
 */
export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAllRead,
  onNotificationClick,
  onViewAll,
  tabs = ['Alles', 'Bestellingen', 'Voorraad', 'Systeem'],
  maxItems = 10,
  className = '',
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<NotificationTab>('Alles')
  const wrapRef = useRef<HTMLDivElement>(null)

  // Calculate unread count from notifications if not provided
  const calculatedUnreadCount = unreadCount ?? notifications.filter((n) => !n.read).length

  // Filter notifications by active tab
  const filteredNotifications = useMemo(() => {
    const tabType = tabTypeMap[activeTab]
    const filtered = tabType === null ? notifications : notifications.filter((n) => n.type === tabType)
    return filtered.slice(0, maxItems)
  }, [notifications, activeTab, maxItems])

  // Get count for each tab
  const getTabCount = (tab: NotificationTab): number => {
    const tabType = tabTypeMap[tab]
    if (tabType === null) return notifications.filter((n) => !n.read).length
    return notifications.filter((n) => n.type === tabType && !n.read).length
  }

  // Get Lucide icon component
  const getIcon = (iconName: string) => {
    const pascalCase = iconName
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
    return (LucideIcons as any)[pascalCase] || LucideIcons.Bell
  }

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (onNotificationClick) {
      await onNotificationClick(notification)
    }
    setIsOpen(false)
  }

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    if (onMarkAllRead) {
      await onMarkAllRead()
    }
  }

  return (
    <div className={`notif-wrap ${className}`} ref={wrapRef}>
      <button
        className="notif-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaties"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {calculatedUnreadCount > 0 && (
          <span className="notif-badge" aria-label={`${calculatedUnreadCount} ongelezen meldingen`}>
            {calculatedUnreadCount}
          </span>
        )}
      </button>

      <div className={`notif-dropdown ${isOpen ? 'open' : ''}`} role="dialog" aria-labelledby="notif-title">
        <div className="nd-header">
          <h3 id="notif-title">Meldingen</h3>
          <div className="nd-header-actions">
            {calculatedUnreadCount > 0 && (
              <button className="nd-header-btn" onClick={handleMarkAllRead}>
                Alles gelezen
              </button>
            )}
          </div>
        </div>

        <div className="nd-tabs" role="tablist">
          {tabs.map((tab) => {
            const tabCount = getTabCount(tab)
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`nd-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tabCount > 0 && <span className="tab-badge">{tabCount}</span>}
              </button>
            )
          })}
        </div>

        <div className="nd-list" role="tabpanel">
          {filteredNotifications.length === 0 ? (
            <div className="nd-empty">
              <p>Geen meldingen</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = getIcon(notification.icon)
              return (
                <a
                  key={notification.id}
                  className={`nd-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  href={notification.link || '#'}
                  aria-label={`${notification.title}, ${formatRelativeTime(notification.timestamp)}`}
                >
                  <div
                    className="nd-icon"
                    style={{
                      background: getIconBackground(notification.iconColor),
                    }}
                    aria-hidden="true"
                  >
                    <IconComponent size={17} style={{ color: getIconColor(notification.iconColor) }} />
                  </div>
                  <div className="nd-body">
                    <div className="nd-title">{notification.title}</div>
                    <div className="nd-text">{notification.text}</div>
                    <div className="nd-time">
                      <Clock size={11} /> {formatRelativeTime(notification.timestamp)}
                    </div>
                  </div>
                </a>
              )
            })
          )}
        </div>

        <div className="nd-footer">
          <a
            href="/account/notifications"
            onClick={(e) => {
              if (onViewAll) {
                e.preventDefault()
                onViewAll()
              }
            }}
          >
            Alle meldingen bekijken <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Notification Wrapper */
        .notif-wrap {
          position: relative;
          display: inline-block;
        }

        /* Trigger Button */
        .notif-trigger {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--grey);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all var(--transition);
        }

        .notif-trigger:hover {
          border-color: var(--teal);
          background: var(--teal-glow);
        }

        .notif-trigger :global(svg) {
          color: var(--navy);
        }

        .notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          background: var(--coral);
          color: white;
          font-size: 10px;
          font-weight: 800;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          padding: 0 4px;
        }

        /* Dropdown */
        .notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 400px;
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 500;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .notif-dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* Header */
        .nd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-16) var(--space-20);
          border-bottom: 1px solid var(--grey);
        }

        .nd-header h3 {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 800;
          color: var(--navy);
        }

        .nd-header-actions {
          display: flex;
          gap: var(--space-6);
        }

        .nd-header-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--teal);
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--font-primary);
          padding: var(--space-4) var(--space-8);
          border-radius: var(--radius-sm);
          transition: background var(--transition);
        }

        .nd-header-btn:hover {
          background: var(--teal-glow);
        }

        /* Tabs */
        .nd-tabs {
          display: flex;
          border-bottom: 1px solid var(--grey);
        }

        .nd-tab {
          flex: 1;
          padding: var(--space-10);
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--grey-mid);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all var(--transition);
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          font-family: var(--font-primary);
        }

        .nd-tab:hover {
          color: var(--teal);
        }

        .nd-tab.active {
          color: var(--teal);
          border-bottom-color: var(--teal);
        }

        .tab-badge {
          background: var(--coral);
          color: white;
          font-size: 9px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 100px;
          margin-left: var(--space-4);
          display: inline-block;
        }

        /* List */
        .nd-list {
          max-height: 380px;
          overflow-y: auto;
        }

        .nd-item {
          display: flex;
          gap: var(--space-12);
          padding: var(--space-14) var(--space-20);
          border-bottom: 1px solid var(--grey);
          cursor: pointer;
          transition: background var(--transition);
          position: relative;
          text-decoration: none;
          color: inherit;
        }

        .nd-item:hover {
          background: var(--grey-light);
        }

        .nd-item:last-child {
          border-bottom: none;
        }

        .nd-item.unread {
          background: rgba(0, 137, 123, 0.03);
        }

        .nd-item.unread::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--teal);
        }

        /* Icon */
        .nd-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Body */
        .nd-body {
          flex: 1;
          min-width: 0;
        }

        .nd-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.3;
        }

        .nd-text {
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: var(--space-2);
          line-height: 1.3;
        }

        .nd-time {
          font-size: 11px;
          color: var(--grey-mid);
          margin-top: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        /* Empty State */
        .nd-empty {
          padding: var(--space-32) var(--space-20);
          text-align: center;
        }

        .nd-empty p {
          font-size: 13px;
          color: var(--grey-mid);
        }

        /* Footer */
        .nd-footer {
          padding: var(--space-12) var(--space-20);
          border-top: 1px solid var(--grey);
          text-align: center;
        }

        .nd-footer a {
          font-size: 13px;
          font-weight: 600;
          color: var(--teal);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
        }

        .nd-footer a:hover {
          text-decoration: underline;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .notif-dropdown {
            width: calc(100vw - 40px);
            right: -60px;
          }
        }
      `}</style>
    </div>
  )
}
