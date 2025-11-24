'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainNavigation from '@/components/MainNavigation'

// Import certificate requirements list
const CERTIFICATE_TYPES = [
  'NATIONAL SEAMAN BOOK',
  'NATIONAL LICENSE',
  'FLAG STATE SEAMAN BOOK',
  'FLAG STATE LICENSE',
  'FLAG STATE TANKER SQ',
  'PASSPORT',
  'MEDICAL EXAMINATION',
  'VACCINATION - YELLOW FEVER',
  'DRUG AND ALCOHOL TEST',
  'USA VISA',
  'STCW WATCHKEEPING',
  'GMDSS-GOC',
  'RADAR TRAINING',
  'ARPA TRAINING',
  'ECDIS',
  'BRM (Bridge Resource Management)',
  'ERM (Engine Resource Management)',
  'BST (Basic Safety Training)',
  'SURVIVAL CRAFT',
  'FIRE FIGHTING',
  'FIRST AID',
  'RESCUE BOAT',
  'MEDICAL CARE COURSE',
  'SAFETY OFFICER TRAINING',
  'TANKER FAMILIARIZATION',
  'TANKER OIL ADVANCED',
  'TANKER CHEMICAL ADVANCED',
  'TANKER LPG ADVANCED',
  'POLLUTION PREVENTION',
  'DANGEROUS CARGO',
  'SHIP HANDLING',
  'COOKING COURSE',
  'RISK ASSESSMENT',
  'ISM COURSE',
  'ISPS/SSO',
  'FLAG STATE SSO LICENSE',
  'OWNER SMS',
  'EMPLOYMENT CONTRACT',
]

type Certificate = {
  id: number
  crewId: number
  type: string
  certificateNumber: string | null
  issueDate: string | null
  expiryDate: string | null
  issuingAuthority: string | null
  documentPath: string | null
}

type Crew = {
  id: number
  fullName: string
  crewCode: string | null
  rank: string | null
}

export default function CrewCertificatesPage() {
  const params = useParams()
  const router = useRouter()
  const crewId = Number(params.id)

  const [crew, setCrew] = useState<Crew | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
  })
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  useEffect(() => {
    loadData()
  }, [crewId])

  async function loadData() {
    try {
      const [crewRes, certsRes] = await Promise.all([
        fetch(`/api/crew/${crewId}`),
        fetch(`/api/certificates?crewId=${crewId}`),
      ])

      if (crewRes.ok) {
        const crewData = await crewRes.json()
        setCrew(crewData)
      }

      if (certsRes.ok) {
        const certsData = await certsRes.json()
        setCertificates(certsData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function openAddForm() {
    setEditingCert(null)
    setFormData({
      type: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
    })
    setUploadFile(null)
    setShowForm(true)
  }

  function openEditForm(cert: Certificate) {
    setEditingCert(cert)
    setFormData({
      type: cert.type,
      certificateNumber: cert.certificateNumber || '',
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : '',
      issuingAuthority: cert.issuingAuthority || '',
    })
    setUploadFile(null)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = new FormData()
      submitData.append('crewId', crewId.toString())
      submitData.append('type', formData.type)
      submitData.append('certificateNumber', formData.certificateNumber)
      submitData.append('issueDate', formData.issueDate)
      submitData.append('expiryDate', formData.expiryDate)
      submitData.append('issuingAuthority', formData.issuingAuthority)
      
      if (uploadFile) {
        submitData.append('file', uploadFile)
      }

      const url = editingCert
        ? `/api/certificates/${editingCert.id}`
        : '/api/certificates'
      
      const method = editingCert ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: submitData,
      })

      if (res.ok) {
        setShowForm(false)
        loadData()
      } else {
        alert('Failed to save certificate')
      }
    } catch (error) {
      console.error('Error saving certificate:', error)
      alert('Error saving certificate')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(certId: number) {
    if (!confirm('Delete this certificate?')) return

    try {
      const res = await fetch(`/api/certificates/${certId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadData()
      } else {
        alert('Failed to delete certificate')
      }
    } catch (error) {
      console.error('Error deleting certificate:', error)
    }
  }

  function getStatusColor(expiryDate: string | null) {
    if (!expiryDate) return '#6b7280'
    
    const exp = new Date(expiryDate).getTime()
    const now = new Date().getTime()
    const daysUntilExpiry = (exp - now) / (1000 * 60 * 60 * 24)

    if (daysUntilExpiry < 0) return '#dc2626' // Expired - red
    if (daysUntilExpiry < 30) return '#f97316' // Expiring soon - orange
    if (daysUntilExpiry < 90) return '#eab308' // Warning - yellow
    return '#10b981' // Valid - green
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <main style={{ marginLeft: '220px', padding: '2rem', width: 'calc(100vw - 220px)' }}>
          <div>Loading...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <MainNavigation />
      <main style={{ marginLeft: '220px', padding: '2rem', width: 'calc(100vw - 220px)' }}>
        <style>{`
          .cert-header {
            margin-bottom: 2rem;
          }
          .cert-title {
            font-size: 2rem;
            font-weight: bold;
            margin: 0 0 0.5rem 0;
          }
          .cert-subtitle {
            color: #9ca3af;
            margin: 0;
          }
          .action-bar {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
          }
          .btn-primary {
            background: #10b981;
            color: white;
          }
          .btn-primary:hover {
            background: #059669;
          }
          .btn-secondary {
            background: #374151;
            color: #e5e7eb;
          }
          .btn-secondary:hover {
            background: #4b5563;
          }
          .btn-danger {
            background: #dc2626;
            color: white;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
          .btn-danger:hover {
            background: #b91c1c;
          }
          .cert-grid {
            display: grid;
            gap: 1rem;
          }
          .cert-card {
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.2s;
          }
          .cert-card:hover {
            border-color: #374151;
          }
          .cert-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }
          .cert-type {
            font-size: 1.125rem;
            font-weight: 600;
            color: #e5e7eb;
            margin: 0 0 0.5rem 0;
          }
          .cert-number {
            color: #9ca3af;
            font-family: monospace;
            font-size: 0.875rem;
          }
          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
          }
          .cert-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .cert-detail-item {
            font-size: 0.875rem;
          }
          .cert-detail-label {
            color: #9ca3af;
            margin-bottom: 0.25rem;
          }
          .cert-detail-value {
            color: #e5e7eb;
            font-weight: 500;
          }
          .cert-actions {
            display: flex;
            gap: 0.5rem;
            padding-top: 1rem;
            border-top: 1px solid #1f2937;
          }
          .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
          .form-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .form-modal {
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
          }
          .form-group {
            margin-bottom: 1.25rem;
          }
          .form-label {
            display: block;
            color: #e5e7eb;
            font-weight: 500;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
          }
          .form-input,
          .form-select {
            width: 100%;
            padding: 0.75rem;
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 8px;
            color: #e5e7eb;
            font-size: 1rem;
          }
          .form-file {
            width: 100%;
            padding: 0.75rem;
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 8px;
            color: #e5e7eb;
            cursor: pointer;
          }
          .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
          }
          .empty-state {
            text-align: center;
            padding: 3rem;
            color: #9ca3af;
          }
        `}</style>

        <div className="cert-header">
          <h1 className="cert-title">📜 Certificates - {crew?.fullName}</h1>
          <p className="cert-subtitle">
            {crew?.crewCode && <span style={{ fontFamily: 'monospace', marginRight: '1rem' }}>Code: {crew.crewCode}</span>}
            {crew?.rank && <span>Rank: {crew.rank}</span>}
          </p>
        </div>

        <div className="action-bar">
          <button className="btn btn-primary" onClick={openAddForm}>
            ➕ Add Certificate
          </button>
          <button className="btn btn-secondary" onClick={() => router.push(`/crew/${crewId}`)}>
            ← Back to Crew
          </button>
        </div>

        {certificates.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3>No certificates yet</h3>
            <p>Click "Add Certificate" to start adding certificates for this crew member</p>
          </div>
        ) : (
          <div className="cert-grid">
            {certificates.map((cert) => {
              const statusColor = getStatusColor(cert.expiryDate)
              const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date()
              
              return (
                <div key={cert.id} className="cert-card">
                  <div className="cert-card-header">
                    <div>
                      <h3 className="cert-type">{cert.type}</h3>
                      {cert.certificateNumber && (
                        <div className="cert-number">No: {cert.certificateNumber}</div>
                      )}
                    </div>
                    <span className="status-badge" style={{ background: statusColor }}>
                      {isExpired ? '❌ Expired' : cert.expiryDate ? '✅ Valid' : '⚠️ No Date'}
                    </span>
                  </div>

                  <div className="cert-details">
                    <div className="cert-detail-item">
                      <div className="cert-detail-label">Issue Date</div>
                      <div className="cert-detail-value">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </div>
                    <div className="cert-detail-item">
                      <div className="cert-detail-label">Expiry Date</div>
                      <div className="cert-detail-value">
                        {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </div>
                    {cert.issuingAuthority && (
                      <div className="cert-detail-item">
                        <div className="cert-detail-label">Issuing Authority</div>
                        <div className="cert-detail-value">{cert.issuingAuthority}</div>
                      </div>
                    )}
                  </div>

                  <div className="cert-actions">
                    {cert.documentPath && (
                      <a
                        href={cert.documentPath}
                        download
                        className="btn btn-secondary btn-small"
                      >
                        📥 Download
                      </a>
                    )}
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => openEditForm(cert)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(cert.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="form-overlay" onClick={() => setShowForm(false)}>
            <div className="form-modal" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Certificate Type *</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="">Select certificate type...</option>
                    {CERTIFICATE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    placeholder="e.g. 123456789"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issuing Authority</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                    placeholder="e.g. SYAHBANDAR, FLAG STATE"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Document (PDF/Image)</label>
                  <input
                    type="file"
                    className="form-file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                  {editingCert?.documentPath && !uploadFile && (
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Current file: {editingCert.documentPath.split('/').pop()}
                    </p>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editingCert ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
