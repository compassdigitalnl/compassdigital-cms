'use client'

import { type DragEvent } from 'react'

interface NodeItem {
  type: string
  label: string
  icon: string
  color: string
  description: string
}

const NODE_ITEMS: NodeItem[] = [
  {
    type: 'send_email',
    label: 'E-mail',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: '#3b82f6',
    description: 'Verstuur een e-mail template',
  },
  {
    type: 'wait',
    label: 'Wachten',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#f59e0b',
    description: 'Pauzeer de flow',
  },
  {
    type: 'condition',
    label: 'Voorwaarde',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#a855f7',
    description: 'Splits op basis van voorwaarde',
  },
  {
    type: 'add_to_list',
    label: 'Aan lijst',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: '#06b6d4',
    description: 'Voeg toe aan e-mail lijst',
  },
  {
    type: 'remove_from_list',
    label: 'Van lijst',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: '#06b6d4',
    description: 'Verwijder van e-mail lijst',
  },
  {
    type: 'add_tag',
    label: 'Tag +',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    color: '#10b981',
    description: 'Voeg tag toe aan subscriber',
  },
  {
    type: 'remove_tag',
    label: 'Tag -',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    color: '#10b981',
    description: 'Verwijder tag van subscriber',
  },
  {
    type: 'webhook',
    label: 'Webhook',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    color: '#6366f1',
    description: 'Roep externe webhook aan',
  },
  {
    type: 'exit',
    label: 'Einde',
    icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#ef4444',
    description: 'Beëindig de flow',
  },
]

interface FlowSidebarProps {
  className?: string
}

export function FlowSidebar({ className = '' }: FlowSidebarProps) {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className={`w-56 border-r bg-grey-light overflow-y-auto ${className}`} style={{ borderColor: '#e5e7eb' }}>
      <div className="p-3">
        <h3 className="text-xs font-bold text-grey-mid uppercase tracking-wider mb-3">Stappen</h3>
        <div className="space-y-1.5">
          {NODE_ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-grey-light"
              title={item.description}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ background: `${item.color}15`, color: item.color }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-grey-dark">{item.label}</div>
                <div className="text-[10px] text-grey-mid">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
