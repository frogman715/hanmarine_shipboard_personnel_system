'use client'

import { RANKS, getRanksGrouped, getRankByCode } from '@/lib/ranks'
import { useState } from 'react'

interface RankSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showDescription?: boolean
  style?: React.CSSProperties
  required?: boolean
}

export default function RankSelect({ 
  value, 
  onChange, 
  placeholder = 'Select rank / position',
  showDescription = true,
  style = {},
  required = false,
}: RankSelectProps) {
  const grouped = getRanksGrouped()
  const selectedRank = value ? getRankByCode(value) : null
  const [showTooltip, setShowTooltip] = useState(false)

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #374151',
    background: '#020617',
    color: '#e5e7eb',
    fontSize: '0.875rem',
    ...style,
  }

  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={defaultStyle}
        required={required}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <option value="">{placeholder}</option>
        {Object.entries(grouped).map(([deptName, ranks]) => (
          <optgroup key={deptName} label={deptName}>
            {ranks.map(rank => (
              <option key={rank.code} value={rank.code}>
                {rank.code} - {rank.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Description tooltip */}
      {showDescription && selectedRank && showTooltip && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          padding: '0.75rem',
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#d1d5db',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.25rem' }}>
            {selectedRank.title}
          </div>
          <div style={{ lineHeight: '1.4' }}>
            {selectedRank.description}
          </div>
        </div>
      )}
    </div>
  )
}
