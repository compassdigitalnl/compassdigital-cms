'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardList,
  ArrowLeft,
  Save,
  Repeat,
  Stethoscope,
  FlaskConical,
  PlusCircle,
  Building2,
  Package,
} from 'lucide-react'

const COLORS = {
  navy: '#0A1628',
  teal: '#00897B',
  tealLight: '#26A69A',
  tealGlow: 'rgba(0,137,123,0.15)',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  bg: '#F5F7FA',
  coral: '#FF6B6B',
  coralLight: '#FFF0F0',
}

const ICON_OPTIONS = [
  { value: 'clipboard-list', label: 'Clipboard (standaard)', icon: ClipboardList },
  { value: 'repeat', label: 'Repeat (herhaling)', icon: Repeat },
  { value: 'stethoscope', label: 'Stethoscope (medisch)', icon: Stethoscope },
  { value: 'flask-conical', label: 'Flask (lab)', icon: FlaskConical },
  { value: 'plus-circle', label: 'Plus Circle (EHBO)', icon: PlusCircle },
  { value: 'building-2', label: 'Building (gebouw)', icon: Building2 },
  { value: 'package', label: 'Package (pakket)', icon: Package },
]

const COLOR_OPTIONS = [
  { value: 'teal', label: 'Teal (standaard)', bg: 'rgba(0,137,123,0.15)', color: '#00897B' },
  { value: 'blue', label: 'Blue (blauw)', bg: '#E3F2FD', color: '#2196F3' },
  { value: 'amber', label: 'Amber (oranje)', bg: '#FFF8E1', color: '#F59E0B' },
  { value: 'green', label: 'Green (groen)', bg: '#E8F5E9', color: '#00C853' },
]

export default function NewOrderListPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('clipboard-list')
  const [color, setColor] = useState('teal')
  const [isPinned, setIsPinned] = useState(false)
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/order-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          icon,
          color,
          isPinned,
          notes,
          items: [], // Start with empty list
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create list')
      }

      const data = await response.json()

      // Redirect to the new list
      router.push(`/my-account/lists/${data.doc.id}`)
    } catch (err) {
      console.error('Error creating list:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
      setLoading(false)
    }
  }

  const selectedColorOption = COLOR_OPTIONS.find((opt) => opt.value === color) || COLOR_OPTIONS[0]
  const SelectedIconComponent =
    ICON_OPTIONS.find((opt) => opt.value === icon)?.icon || ClipboardList

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/my-account/lists')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-teal-50"
          style={{ border: `1.5px solid ${COLORS.grey}` }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: COLORS.navy }} />
        </button>
        <h1
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '28px',
            fontWeight: 800,
            color: COLORS.navy,
          }}
        >
          Nieuwe bestellijst
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: COLORS.coralLight, border: `1px solid ${COLORS.coral}` }}
        >
          <p style={{ fontSize: '14px', color: COLORS.coral, fontWeight: 600 }}>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className="rounded-2xl p-6 mb-5"
          style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
        >
          <h2
            className="mb-5"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: COLORS.navy,
            }}
          >
            Basisinformatie
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}
            >
              Lijstnaam <span style={{ color: COLORS.coral }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Bijvoorbeeld: "Maandelijkse EHBO bestelling"'
              required
              className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
              style={{
                border: `2px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.teal
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.tealGlow}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.grey
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}
            >
              Beschrijving (optioneel)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Korte beschrijving van deze bestellijst..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl resize-vertical transition-all focus:outline-none"
              style={{
                border: `2px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.teal
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.tealGlow}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.grey
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Icon & Color Preview */}
          <div className="mb-4">
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}>
              Voorbeeld
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: selectedColorOption.bg }}
              >
                <SelectedIconComponent
                  className="w-6 h-6"
                  style={{ color: selectedColorOption.color }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: COLORS.navy,
                  }}
                >
                  {name || 'Bestellijst naam'}
                </div>
                <div style={{ fontSize: '13px', color: COLORS.greyMid }}>
                  {description || 'Beschrijving'}
                </div>
              </div>
            </div>
          </div>

          {/* Icon Selection */}
          <div className="mb-4">
            <label
              htmlFor="icon"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}
            >
              Icoon
            </label>
            <select
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-3 rounded-xl cursor-pointer transition-all focus:outline-none"
              style={{
                border: `2px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                background: 'white',
              }}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <label
              htmlFor="color"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}
            >
              Kleur
            </label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-3 rounded-xl cursor-pointer transition-all focus:outline-none"
              style={{
                border: `2px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                background: 'white',
              }}
            >
              {COLOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pinned Checkbox */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
                style={{ accentColor: COLORS.teal }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}>
                Vastpinnen (wordt bovenaan getoond)
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 600, color: COLORS.navy }}
            >
              Notities (optioneel)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bijv. instructies voor collega's, bestelmomenten, leveringsvoorkeuren..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl resize-vertical transition-all focus:outline-none"
              style={{
                border: `2px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.teal
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.tealGlow}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.grey
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/my-account/lists')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:bg-gray-50"
            style={{
              background: 'white',
              color: COLORS.navy,
              border: `1.5px solid ${COLORS.grey}`,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            }}
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={loading || !name}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0,137,123,0.3)',
            }}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Opslaan...' : 'Lijst aanmaken'}
          </button>
        </div>
      </form>
    </div>
  )
}
