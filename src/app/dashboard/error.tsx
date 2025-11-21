'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0f172a',
      color: '#e2e8f0',
      padding: '2rem'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>
          ⚠️ Something went wrong!
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          {error.message || 'An error occurred while loading the dashboard.'}
        </p>
        {error.digest && (
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem',
              display: 'inline-block'
            }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
