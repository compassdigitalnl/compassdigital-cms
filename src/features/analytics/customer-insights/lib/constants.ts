import type { RFMSegment } from './types'

export const SEGMENT_CONFIG: Record<RFMSegment, { label: string; color: string; description: string; icon: string }> = {
  champions: { label: 'Champions', color: '#16a34a', description: 'Beste klanten - kopen vaak en recent', icon: '🏆' },
  loyal: { label: 'Loyale klanten', color: '#2563eb', description: 'Regelmatige kopers met hoge waarde', icon: '💎' },
  potential: { label: 'Potentieel loyaal', color: '#7c3aed', description: 'Recente kopers die vaker kunnen bestellen', icon: '⭐' },
  new: { label: 'Nieuw', color: '#06b6d4', description: 'Recent eerste bestelling geplaatst', icon: '🆕' },
  at_risk: { label: 'Risico', color: '#f59e0b', description: 'Waren actief maar kopen minder', icon: '⚠️' },
  hibernating: { label: 'Slapend', color: '#6b7280', description: 'Lang geleden laatste bestelling', icon: '😴' },
  lost: { label: 'Verloren', color: '#dc2626', description: 'Zeer lang geen activiteit meer', icon: '❌' },
}

// RFM score thresholds (1-5 scale, quintile-based)
export const RFM_SEGMENT_RULES: Record<RFMSegment, { r: [number, number]; f: [number, number]; m: [number, number] }> = {
  champions: { r: [4, 5], f: [4, 5], m: [4, 5] },
  loyal: { r: [3, 5], f: [3, 5], m: [3, 5] },
  potential: { r: [4, 5], f: [1, 3], m: [1, 3] },
  new: { r: [4, 5], f: [1, 1], m: [1, 5] },
  at_risk: { r: [2, 3], f: [2, 5], m: [2, 5] },
  hibernating: { r: [1, 2], f: [1, 2], m: [1, 5] },
  lost: { r: [1, 1], f: [1, 5], m: [1, 5] },
}
