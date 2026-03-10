'use client'

import { useField } from '@payloadcms/ui'
import { SegmentBuilder } from '../SegmentBuilder'

export function SegmentConditionsField({ path }: { path: string }) {
  const { value, setValue } = useField<any>({ path })

  const currentValue = value && typeof value === 'object' && value.groups
    ? value
    : { logic: 'and', groups: [] }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
          color: '#1a1a2e',
        }}
      >
        Voorwaarden
      </label>
      <SegmentBuilder
        value={currentValue}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  )
}
