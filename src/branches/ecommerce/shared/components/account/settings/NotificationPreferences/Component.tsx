import React from 'react'
import { Bell } from 'lucide-react'
import type { NotificationPreferencesProps } from './types'

const notificationItems = [
  { key: 'orderConfirmation', label: 'Orderbevestigingen', description: 'Ontvang een bevestiging bij elke bestelling' },
  { key: 'shippingUpdates', label: 'Verzend updates', description: 'Track & trace notificaties' },
  { key: 'newsletter', label: 'Nieuwsbrief', description: 'Maandelijkse updates en acties' },
  { key: 'productUpdates', label: 'Product updates', description: 'Nieuwe producten en categorieën' },
  { key: 'priceAlerts', label: 'Prijsmeldingen', description: 'Waarschuw me bij prijswijzigingen' },
]

export function NotificationPreferences({ notifications, onToggle }: NotificationPreferencesProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4 lg:mb-5">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Notificaties</h2>
          <p className="text-xs lg:text-sm text-gray-500">Beheer je e-mail voorkeuren</p>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-3">
        {notificationItems.map((item) => {
          const isEnabled = notifications[item.key as keyof typeof notifications]
          return (
            <div key={item.key} className="flex items-start justify-between p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50">
              <div className="flex-1 min-w-0 pr-3">
                <div className="text-xs lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <div
                className="w-11 lg:w-12 h-6 rounded-full relative cursor-pointer transition-all flex-shrink-0"
                style={{ background: isEnabled ? 'var(--color-primary)' : '#E5E7EB' }}
                onClick={() => onToggle(item.key)}
              >
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform" style={{ left: isEnabled ? '22px' : '2px' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
