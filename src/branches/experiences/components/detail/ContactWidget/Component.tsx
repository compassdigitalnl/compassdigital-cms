import { Phone, Mail, MessageCircle } from 'lucide-react'
import type { ContactWidgetProps } from './types'

export function ContactWidget({
  name,
  role,
  initials,
  message,
  isOnline = true,
  responseTime = 'reageert binnen 5 min',
  phone,
  email,
  whatsapp,
  className = '',
}: ContactWidgetProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 ${className}`}>
      {/* Header: Avatar + Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-[var(--color-teal)] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-extrabold">{initials}</span>
        </div>
        <div className="min-w-0">
          <div className="font-bold text-[var(--color-navy)]">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
          {isOnline && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-xs text-green-600">
                Online — {responseTime}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Message Bubble */}
      <div className="bg-gray-100 rounded-lg rounded-tl-none px-4 py-3 mb-4">
        <p className="text-sm text-gray-700">{message}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-navy)] border border-gray-300 hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
          >
            <Phone className="w-4 h-4" />
            Bellen
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-navy)] border border-gray-300 hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
          >
            <Mail className="w-4 h-4" />
            E-mail
          </a>
        )}
      </div>
    </div>
  )
}
