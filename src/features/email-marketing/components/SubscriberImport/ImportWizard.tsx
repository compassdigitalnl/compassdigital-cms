'use client'

import { useState, useCallback, useRef } from 'react'
import Papa from 'papaparse'

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete'

interface ColumnMapping {
  email: string
  name: string
  status: string
  tags: string
}

interface ImportResult {
  total: number
  created: number
  skipped: number
  errors: Array<{ email: string; error: string }>
}

interface ImportWizardProps {
  onComplete?: (result: ImportResult) => void
  onCancel?: () => void
  defaultLists?: string[]
  className?: string
}

export function ImportWizard({
  onComplete,
  onCancel,
  defaultLists = [],
  className = '',
}: ImportWizardProps) {
  const [step, setStep] = useState<Step>('upload')
  const [csvData, setCsvData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<ColumnMapping>({ email: '', name: '', status: '', tags: '' })
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Step 1: Upload CSV ──
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setError('Alleen CSV bestanden worden ondersteund')
      return
    }

    setError('')
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][]
        if (data.length < 2) {
          setError('Het bestand bevat geen data')
          return
        }

        const fileHeaders = data[0].map((h) => h.trim().toLowerCase())
        setHeaders(fileHeaders)
        setCsvData(data.slice(1).filter((row) => row.some((cell) => cell.trim())))

        // Auto-detect column mapping
        const autoMapping: ColumnMapping = { email: '', name: '', status: '', tags: '' }
        fileHeaders.forEach((h, i) => {
          const col = String(i)
          if (/e-?mail|email/i.test(h)) autoMapping.email = col
          else if (/na[a]?m|name|voornaam|first.?name/i.test(h)) autoMapping.name = col
          else if (/status/i.test(h)) autoMapping.status = col
          else if (/tag|label/i.test(h)) autoMapping.tags = col
        })

        // Default: first column = email if not detected
        if (!autoMapping.email && fileHeaders.length > 0) autoMapping.email = '0'
        if (!autoMapping.name && fileHeaders.length > 1) autoMapping.name = '1'

        setMapping(autoMapping)
        setStep('mapping')
      },
      error: () => {
        setError('Kan het bestand niet lezen')
      },
    })
  }, [])

  // ── Step 3: Import ──
  const handleImport = useCallback(async () => {
    setStep('importing')
    setProgress(0)

    const subscribers = csvData.map((row) => {
      const emailIdx = parseInt(mapping.email)
      const nameIdx = mapping.name ? parseInt(mapping.name) : -1
      const statusIdx = mapping.status ? parseInt(mapping.status) : -1
      const tagsIdx = mapping.tags ? parseInt(mapping.tags) : -1

      return {
        email: row[emailIdx]?.trim() || '',
        name: nameIdx >= 0 ? row[nameIdx]?.trim() : '',
        status: statusIdx >= 0 ? row[statusIdx]?.trim() : undefined,
        tags: tagsIdx >= 0 ? row[tagsIdx]?.split(';').map((t) => t.trim()).filter(Boolean) : undefined,
      }
    }).filter((s) => s.email)

    // Batch import in chunks of 500
    const chunkSize = 500
    const totalChunks = Math.ceil(subscribers.length / chunkSize)
    const combinedResult: ImportResult = { total: subscribers.length, created: 0, skipped: 0, errors: [] }

    for (let i = 0; i < totalChunks; i++) {
      const chunk = subscribers.slice(i * chunkSize, (i + 1) * chunkSize)

      try {
        const res = await fetch('/api/email-marketing/subscribers/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            subscribers: chunk,
            skipDuplicates,
            defaultLists,
          }),
        })

        const data = await res.json()
        if (data.results) {
          combinedResult.created += data.results.created
          combinedResult.skipped += data.results.skipped
          combinedResult.errors.push(...data.results.errors)
        }
      } catch {
        combinedResult.errors.push(...chunk.map((s) => ({ email: s.email, error: 'Netwerk fout' })))
      }

      setProgress(Math.round(((i + 1) / totalChunks) * 100))
    }

    setResult(combinedResult)
    setStep('complete')
    onComplete?.(combinedResult)
  }, [csvData, mapping, skipDuplicates, defaultLists, onComplete])

  const previewRows = csvData.slice(0, 5)

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['Upload', 'Mapping', 'Preview', 'Import'].map((label, i) => {
          const steps: Step[] = ['upload', 'mapping', 'preview', 'importing']
          const isActive = steps.indexOf(step) >= i || step === 'complete'
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: isActive ? '#0a1628' : '#e5e7eb',
                  color: isActive ? 'white' : '#9ca3af',
                }}
              >
                {i + 1}
              </div>
              <span className="text-xs font-medium text-gray-500 hidden sm:block">{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          )
        })}
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {/* ── Upload ── */}
      {step === 'upload' && (
        <div className="text-center">
          <div
            className="border-2 border-dashed rounded-xl p-10 cursor-pointer hover:border-gray-400 transition-colors"
            style={{ borderColor: '#d1d5db' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-bold text-gray-700 mb-1">Sleep een CSV bestand hierheen</p>
            <p className="text-xs text-gray-500">of klik om te selecteren</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-3">
            Verplichte kolom: email. Optioneel: name, status, tags
          </p>
        </div>
      )}

      {/* ── Mapping ── */}
      {step === 'mapping' && (
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">Kolommen koppelen</h3>
          <p className="text-xs text-gray-500 mb-4">
            {csvData.length} rijen gevonden. Koppel de kolommen aan de juiste velden.
          </p>

          <div className="space-y-3">
            {[
              { key: 'email', label: 'E-mailadres *', required: true },
              { key: 'name', label: 'Naam', required: false },
              { key: 'status', label: 'Status', required: false },
              { key: 'tags', label: 'Tags (;-gescheiden)', required: false },
            ].map(({ key, label, required }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-600 w-40">{label}</label>
                <select
                  value={mapping[key as keyof ColumnMapping] || ''}
                  onChange={(e) => setMapping((m) => ({ ...m, [key]: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <option value="">{required ? 'Selecteer kolom...' : '— Overslaan —'}</option>
                  {headers.map((h, i) => (
                    <option key={i} value={String(i)}>{h || `Kolom ${i + 1}`}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 mb-6">
            <input
              type="checkbox"
              checked={skipDuplicates}
              onChange={(e) => setSkipDuplicates(e.target.checked)}
              id="skipDuplicates"
              className="w-4 h-4"
            />
            <label htmlFor="skipDuplicates" className="text-xs text-gray-600">
              Bestaande e-mailadressen overslaan
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep('upload')}
              className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Terug
            </button>
            <button
              onClick={() => {
                if (!mapping.email) {
                  setError('Selecteer een kolom voor e-mailadres')
                  return
                }
                setError('')
                setStep('preview')
              }}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: '#0a1628' }}
            >
              Volgende
            </button>
          </div>
        </div>
      )}

      {/* ── Preview ── */}
      {step === 'preview' && (
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">Preview (eerste 5 rijen)</h3>

          <div className="overflow-x-auto rounded-lg border mb-4" style={{ borderColor: '#e5e7eb' }}>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-bold text-gray-600">E-mail</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-600">Naam</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-600">Status</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-600">Tags</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => {
                  const emailIdx = parseInt(mapping.email)
                  const nameIdx = mapping.name ? parseInt(mapping.name) : -1
                  const statusIdx = mapping.status ? parseInt(mapping.status) : -1
                  const tagsIdx = mapping.tags ? parseInt(mapping.tags) : -1

                  return (
                    <tr key={i} className="border-t" style={{ borderColor: '#f3f4f6' }}>
                      <td className="px-3 py-2 text-gray-700">{row[emailIdx] || '—'}</td>
                      <td className="px-3 py-2 text-gray-700">{nameIdx >= 0 ? row[nameIdx] || '—' : '—'}</td>
                      <td className="px-3 py-2 text-gray-700">{statusIdx >= 0 ? row[statusIdx] || 'enabled' : 'enabled'}</td>
                      <td className="px-3 py-2 text-gray-700">{tagsIdx >= 0 ? row[tagsIdx] || '—' : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Totaal: <strong>{csvData.length}</strong> subscribers om te importeren.
            {skipDuplicates && ' Duplicaten worden overgeslagen.'}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setStep('mapping')}
              className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Terug
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: '#059669' }}
            >
              Importeren ({csvData.length} subscribers)
            </button>
          </div>
        </div>
      )}

      {/* ── Importing ── */}
      {step === 'importing' && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-700 mb-2">Bezig met importeren...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: '#0a1628' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{progress}%</p>
        </div>
      )}

      {/* ── Complete ── */}
      {step === 'complete' && result && (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-50">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2">Import voltooid!</h3>

          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.created}</div>
              <div className="text-xs text-gray-500">Aangemaakt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{result.skipped}</div>
              <div className="text-xs text-gray-500">Overgeslagen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{result.errors.length}</div>
              <div className="text-xs text-gray-500">Fouten</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <details className="text-left mb-4 max-h-40 overflow-y-auto">
              <summary className="text-xs text-red-500 cursor-pointer font-medium">
                {result.errors.length} fouten bekijken
              </summary>
              <div className="mt-2 space-y-1">
                {result.errors.slice(0, 20).map((err, i) => (
                  <div key={i} className="text-xs text-gray-600">
                    <span className="font-mono">{err.email}</span>: {err.error}
                  </div>
                ))}
                {result.errors.length > 20 && (
                  <div className="text-xs text-gray-400">...en {result.errors.length - 20} meer</div>
                )}
              </div>
            </details>
          )}

          <button
            onClick={() => onCancel?.()}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white"
            style={{ background: '#0a1628' }}
          >
            Sluiten
          </button>
        </div>
      )}

      {/* Cancel button (all steps except complete/importing) */}
      {onCancel && !['importing', 'complete'].includes(step) && (
        <button
          onClick={onCancel}
          className="mt-4 text-xs text-gray-400 hover:text-gray-600 hover:underline"
        >
          Annuleren
        </button>
      )}
    </div>
  )
}
