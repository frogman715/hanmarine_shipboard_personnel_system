'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import RankSelect from '@/components/RankSelect'

type Crew = {
  id: number
  fullName: string
  rank: string | null
  vessel: string | null
  status: string
  crewStatus: string
}

type Certificate = {
  id: number
  crewId: number
  type: string
  issueDate: string | null
  expiryDate: string | null
  issuer: string | null
  remarks: string | null
}

export default function CrewEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const crewId = Number(params.id)

  const [crew, setCrew] = useState<Crew | null>(null)
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [rank, setRank] = useState('')
  const [vessel, setVessel] = useState('')
  const [status, setStatus] = useState('AVAILABLE')

  // Certificate form
  const [certType, setCertType] = useState('')
  const [certName, setCertName] = useState('')
  const [certNumber, setCertNumber] = useState('')
  const [certIssueDate, setCertIssueDate] = useState('')
  const [certExpiryDate, setCertExpiryDate] = useState('')
  const [certIssuer, setCertIssuer] = useState('')
  const [certRemarks, setCertRemarks] = useState('')
  const [certFile, setCertFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  
  // Edit certificate state
  const [editingCertId, setEditingCertId] = useState<number | null>(null)
  const [editCertType, setEditCertType] = useState('')
  const [editCertName, setEditCertName] = useState('')
  const [editCertNumber, setEditCertNumber] = useState('')
  const [editCertIssueDate, setEditCertIssueDate] = useState('')
  const [editCertExpiryDate, setEditCertExpiryDate] = useState('')
  const [editCertIssuer, setEditCertIssuer] = useState('')
  const [editCertRemarks, setEditCertRemarks] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const crewRes = await fetch(`/api/crew`)
        const crewData: Crew[] = await crewRes.json()
        const found = crewData.find((c) => c.id === crewId)
        if (found) setCrew(found)

        const certRes = await fetch(`/api/certificates?crewId=${crewId}`)
        const certData: Certificate[] = await certRes.json()
        setCerts(certData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [crewId])

  useEffect(() => {
    if (crew) {
      setFullName(crew.fullName)
      setRank(crew.rank || '')
      setVessel(crew.vessel || '')
      setStatus(crew.status)
    }
  }, [crew])

  async function handleUpdateCrew() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/crew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, rank, vessel, status }),
      })
      if (!res.ok) throw new Error('Failed to update crew')
      alert('Crew updated!')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddCert(e: FormEvent) {
    e.preventDefault()
    if (!certType) {
      alert('Certificate type is required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      // Combine remarks with document name and number
      const remarksData = {
        documentName: certName || null,
        documentNumber: certNumber || null,
        notes: certRemarks || null
      }
      
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crewId,
          type: certType,
          issueDate: certIssueDate || null,
          expiryDate: certExpiryDate || null,
          issuer: certIssuer || null,
          remarks: JSON.stringify(remarksData),
        }),
      })
      if (!res.ok) throw new Error('Failed to add certificate')
      const newCert = await res.json()
      
      // Upload file if provided
      if (certFile) {
        setUploading(true)
        try {
          const formData = new FormData()
          formData.append('file', certFile)
          formData.append('certificateId', newCert.id.toString())
          
          const uploadRes = await fetch('/api/documents/upload', {
            method: 'POST',
            body: formData
          })
          
          if (!uploadRes.ok) {
            console.error('Failed to upload file, but certificate created')
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
        } finally {
          setUploading(false)
        }
      }
      
      setCerts([...certs, newCert])
      setCertType('')
      setCertName('')
      setCertNumber('')
      setCertIssueDate('')
      setCertExpiryDate('')
      setCertIssuer('')
      setCertRemarks('')
      setCertFile(null)
      alert('Certificate added!')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteCert(certId: number) {
    if (!confirm('Delete certificate?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/certificates?id=${certId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setCerts(certs.filter((c) => c.id !== certId))
      alert('Certificate deleted!')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleEditCert(cert: Certificate) {
    setEditingCertId(cert.id)
    setEditCertType(cert.type)
    setEditCertIssueDate(cert.issueDate || '')
    setEditCertExpiryDate(cert.expiryDate || '')
    setEditCertIssuer(cert.issuer || '')
    
    // Parse remarks JSON
    let remarksData: any = {}
    try {
      remarksData = cert.remarks ? JSON.parse(cert.remarks) : {}
    } catch (e) {
      remarksData = { notes: cert.remarks }
    }
    
    setEditCertName(remarksData.documentName || '')
    setEditCertNumber(remarksData.documentNumber || '')
    setEditCertRemarks(remarksData.notes || '')
  }

  async function handleUpdateCert(e: FormEvent) {
    e.preventDefault()
    if (!editingCertId) return
    
    setSaving(true)
    setError(null)
    try {
      const remarksData = {
        documentName: editCertName || null,
        documentNumber: editCertNumber || null,
        notes: editCertRemarks || null
      }
      
      const res = await fetch('/api/certificates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCertId,
          type: editCertType,
          issueDate: editCertIssueDate || null,
          expiryDate: editCertExpiryDate || null,
          issuer: editCertIssuer || null,
          remarks: JSON.stringify(remarksData),
        }),
      })
      
      if (!res.ok) throw new Error('Failed to update certificate')
      const updatedCert = await res.json()
      
      setCerts(certs.map(c => c.id === editingCertId ? updatedCert : c))
      setEditingCertId(null)
      alert('Certificate updated!')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    setEditingCertId(null)
  }

  if (loading) return <main><p>Loading...</p></main>
  if (!crew) return <main><h3>Crew not found</h3></main>

  return (
    <main>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ padding: '0.4rem 0.8rem', marginBottom: 12 }}>
          ← Back
        </button>
        <h2>Edit Crew: {crew.fullName}</h2>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Crew Info */}
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Crew Information</h3>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Full Name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Rank
            <div style={{ marginTop: 4 }}>
              <RankSelect
                value={rank}
                onChange={setRank}
                showDescription={true}
                style={{ display: 'block', width: '100%', padding: 8 }}
              />
            </div>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Vessel
            <input
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ONBOARD">ONBOARD</option>
              <option value="STANDBY">STANDBY</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
            </select>
          </label>
          <button
            onClick={handleUpdateCrew}
            disabled={saving}
            style={{ padding: '0.5rem 1rem', width: '100%', cursor: saving ? 'default' : 'pointer' }}
          >
            {saving ? 'Saving...' : 'Update Crew'}
          </button>
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        </div>

        {/* Certificates */}
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Certificates</h3>
          <form onSubmit={handleAddCert} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Certificate Type *
              <input
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                placeholder="e.g. COC, BST, Medical"
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, fontSize: '0.9rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Document Name
              <input
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="e.g. Certificate of Competency - Chief Engineer"
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, fontSize: '0.9rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Document Number
              <input
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g. 6201234567"
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, fontSize: '0.9rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Issue Date
              <input
                type="date"
                value={certIssueDate}
                onChange={(e) => setCertIssueDate(e.target.value)}
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4 }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Expiry Date
              <input
                type="date"
                value={certExpiryDate}
                onChange={(e) => setCertExpiryDate(e.target.value)}
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4 }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              No Certificate
              <input
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="e.g. 6201234567"
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, fontSize: '0.9rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Remarks
              <textarea
                value={certRemarks}
                onChange={(e) => setCertRemarks(e.target.value)}
                placeholder="Additional notes..."
                rows={2}
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, fontSize: '0.9rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Upload Certificate Image
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, fontSize: '0.9rem' }}
              />
              {certFile && (
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: 4 }}>
                  Selected: {certFile.name}
                </div>
              )}
            </label>
            <button 
              type="submit" 
              disabled={saving || uploading} 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', width: '100%' }}
            >
              {uploading ? 'Uploading...' : saving ? 'Adding...' : 'Add Certificate'}
            </button>
          </form>

          <div style={{ fontSize: '0.85rem' }}>
            <strong>Current Certificates:</strong>
            {certs.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No certificates</p>
            ) : (
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                {certs.map((c) => {
                  // If this certificate is being edited, show edit form
                  if (editingCertId === c.id) {
                    return (
                      <li key={c.id} style={{ marginBottom: 12, padding: 12, border: '2px solid #3b82f6', borderRadius: 8, backgroundColor: '#eff6ff' }}>
                        <form onSubmit={handleUpdateCert}>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            Certificate Type *
                            <input
                              value={editCertType}
                              onChange={(e) => setEditCertType(e.target.value)}
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            Document Name
                            <input
                              value={editCertName}
                              onChange={(e) => setEditCertName(e.target.value)}
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            Document Number
                            <input
                              value={editCertNumber}
                              onChange={(e) => setEditCertNumber(e.target.value)}
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            Issue Date
                            <input
                              type="date"
                              value={editCertIssueDate}
                              onChange={(e) => setEditCertIssueDate(e.target.value)}
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            Expiry Date
                            <input
                              type="date"
                              value={editCertExpiryDate}
                              onChange={(e) => setEditCertExpiryDate(e.target.value)}
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            No Certificate
                            <input
                              value={editCertIssuer}
                              onChange={(e) => setEditCertIssuer(e.target.value)}
                              placeholder="e.g. 6201234567"
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <label style={{ display: 'block', marginBottom: 6 }}>
                            Remarks
                            <textarea
                              value={editCertRemarks}
                              onChange={(e) => setEditCertRemarks(e.target.value)}
                              rows={2}
                              style={{ display: 'block', width: '100%', padding: 4, marginTop: 2, fontSize: '0.85rem' }}
                            />
                          </label>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button 
                              type="submit" 
                              disabled={saving}
                              style={{ flex: 1, padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: saving ? 'default' : 'pointer' }}
                            >
                              {saving ? 'Saving...' : 'Update'}
                            </button>
                            <button 
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={saving}
                              style={{ flex: 1, padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: 4, cursor: saving ? 'default' : 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </li>
                    )
                  }
                  
                  // Normal display
                  let remarksData: any = {}
                  try {
                    remarksData = c.remarks ? JSON.parse(c.remarks) : {}
                  } catch (e) {
                    remarksData = { notes: c.remarks }
                  }
                  
                  return (
                    <li key={c.id} style={{ marginBottom: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>
                      <div style={{ fontWeight: 'bold' }}>{c.type}</div>
                      {remarksData.documentName && (
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          📄 {remarksData.documentName}
                        </div>
                      )}
                      {remarksData.documentNumber && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          № {remarksData.documentNumber}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        Issue: {c.issueDate ? new Date(c.issueDate).toLocaleDateString('id-ID') : '-'} | Exp: {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('id-ID') : '-'}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button
                          onClick={() => handleEditCert(c)}
                          disabled={saving}
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: saving ? 'default' : 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCert(c.id)}
                          disabled={saving}
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: saving ? 'default' : 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
