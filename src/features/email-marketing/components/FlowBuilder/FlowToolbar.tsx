'use client'

interface FlowToolbarProps {
  flowName: string
  status: string
  isSaving: boolean
  hasChanges: boolean
  onSave: () => void
  onStatusChange: (status: string) => void
  onNameChange: (name: string) => void
  onBack: () => void
}

export function FlowToolbar({
  flowName,
  status,
  isSaving,
  hasChanges,
  onSave,
  onStatusChange,
  onNameChange,
  onBack,
}: FlowToolbarProps) {
  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    draft: { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
    active: { bg: '#ecfdf5', text: '#059669', dot: '#22c55e' },
    paused: { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  }

  const statusLabels: Record<string, string> = {
    draft: 'Concept',
    active: 'Actief',
    paused: 'Gepauzeerd',
  }

  const colors = statusColors[status] || statusColors.draft

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 border-b bg-white"
      style={{ borderColor: '#e5e7eb' }}
    >
      {/* Left: Back + Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title="Terug naar flows"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <input
          type="text"
          value={flowName}
          onChange={(e) => onNameChange(e.target.value)}
          className="text-sm font-bold text-gray-800 border-0 bg-transparent focus:outline-none focus:ring-0 px-0 min-w-[200px]"
          placeholder="Flow naam..."
        />

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: colors.bg, color: colors.text }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: colors.dot }} />
          {statusLabels[status] || status}
        </div>

        {hasChanges && (
          <span className="text-xs text-amber-500 font-medium">Niet opgeslagen</span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Status toggle */}
        {status === 'draft' && (
          <button
            onClick={() => onStatusChange('active')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#059669' }}
          >
            Activeren
          </button>
        )}
        {status === 'active' && (
          <button
            onClick={() => onStatusChange('paused')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 transition-all"
          >
            Pauzeren
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={() => onStatusChange('active')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#059669' }}
          >
            Hervatten
          </button>
        )}

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
          style={{ background: '#0a1628' }}
        >
          {isSaving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  )
}
