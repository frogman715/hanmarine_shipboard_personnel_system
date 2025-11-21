'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UploadCertificatePage() {
  const params = useParams()
  const router = useRouter()
  const crewId = Number(params.id)

  const [type, setType] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [issuer, setIssuer] = useState('')
  const [remarks, setRemarks] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const certificateTypes = [
    'Passport',
    'Seaman Book',
    'Medical Certificate',
    'BST (Basic Safety Training)',
    'AFF (Advanced Fire Fighting)',
    'STCW',
    'COC (Certificate of Competency)',
    'COP (Certificate of Proficiency)',
    'GMDSS',
    'Tanker Endorsement',
    'SSO (Ship Security Officer)',
    'DSD (Designated Security Duties)',
    'Yellow Fever Vaccination',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('crewId', crewId.toString())
      formData.append('type', type)
      formData.append('issueDate', issueDate)
      formData.append('expiryDate', expiryDate)
      formData.append('issuer', issuer)
      formData.append('remarks', remarks)
      if (file) {
        formData.append('file', file)
      }

      const res = await fetch('/api/certificates/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        alert('✅ Certificate uploaded successfully!')
        router.push(`/crew/${crewId}`)
      } else {
        const error = await res.json()
        alert(`❌ Error: ${error.message || 'Failed to upload'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ Failed to upload certificate')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>
        <button 
          onClick={() => router.back()}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          ← Back
        </button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 24, borderRadius: 12, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>📋 Upload Certificate</h2>
        <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>Upload crew member certificate document</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
            Certificate Type <span style={{ color: 'red' }}>*</span>
          </label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            required
            style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem' }}
          >
            <option value="">-- Select Certificate Type --</option>
            {certificateTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
              Issue Date
            </label>
            <input 
              type="date" 
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
              Expiry Date <span style={{ color: 'red' }}>*</span>
            </label>
            <input 
              type="date" 
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
            Issuing Authority
          </label>
          <input 
            type="text" 
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g., Ministry of Transportation"
            style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
            Certificate Number / Remarks
          </label>
          <textarea 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Enter certificate number or additional notes"
            style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
            Upload Certificate File (PDF) <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{ width: '100%', padding: 12, border: '2px dashed #cbd5e1', borderRadius: 8, fontSize: '0.95rem', background: '#f8fafc' }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Accepted formats: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            type="submit"
            disabled={uploading}
            style={{ 
              flex: 1,
              padding: 14, 
              background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              cursor: uploading ? 'not-allowed' : 'pointer', 
              fontWeight: 600, 
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            {uploading ? '⏳ Uploading...' : '✅ Upload Certificate'}
          </button>

          <button 
            type="button"
            onClick={() => router.back()}
            style={{ 
              padding: 14, 
              background: '#e2e8f0', 
              color: '#475569', 
              border: 'none', 
              borderRadius: 8, 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '1rem',
              minWidth: 120
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}
