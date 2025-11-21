'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import RankSelect from '@/components/RankSelect'

type SeaService = {
  id: number
  crewId: number
  vesselName: string | null
  rank: string | null
  grt: number | null
  dwt: number | null
  engineType: string | null
  bhp: number | null
  companyName: string | null
  flag: string | null
  signOn: string | null
  signOff: string | null
  remarks: string | null
}

export default function SeaServicePage() {
  const params = useParams()
  const crewId = Number(params.id)

  const [seaServices, setSeaServices] = useState<SeaService[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SeaService | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [formData, setFormData] = useState({
    vesselName: '',
    rank: '',
    grt: '',
    dwt: '',
    engineType: '',
    bhp: '',
    companyName: '',
    flag: '',
    signOn: '',
    signOff: '',
    remarks: '',
  })

  useEffect(() => {
    fetchSeaServices()
  }, [crewId])

  const fetchSeaServices = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/crew?id=${crewId}`)
      const crews: any[] = await res.json()
      const crew = crews.find((c) => c.id === crewId)
      if (crew && crew.seaServices) {
        setSeaServices(crew.seaServices)
      }
    } catch (e) {
      console.error('Error fetching sea services:', e)
      setError('Failed to load sea service records')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      vesselName: '',
      rank: '',
      grt: '',
      dwt: '',
      engineType: '',
      bhp: '',
      companyName: '',
      flag: '',
      signOn: '',
      signOff: '',
      remarks: '',
    })
    setEditing(null)
    setIsAdding(false)
  }

  const handleSave = async () => {
    if (!formData.vesselName) {
      alert('Vessel name is required')
      return
    }

    try {
      const method = editing ? 'PUT' : 'POST'
      const endpoint = 'http://localhost:3000/api/sea-service'

      const payload = editing
        ? {
            id: editing.id,
            ...formData,
            grt: formData.grt ? Number(formData.grt) : null,
            dwt: formData.dwt ? Number(formData.dwt) : null,
            bhp: formData.bhp ? Number(formData.bhp) : null,
          }
        : {
            crewId,
            ...formData,
            grt: formData.grt ? Number(formData.grt) : null,
            dwt: formData.dwt ? Number(formData.dwt) : null,
            bhp: formData.bhp ? Number(formData.bhp) : null,
          }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('Sea service record saved!')
        fetchSeaServices()
        resetForm()
      } else {
        setError('Failed to save record')
      }
    } catch (e) {
      console.error('Error saving:', e)
      setError('Error saving sea service record')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this record?')) return

    try {
      const res = await fetch(`http://localhost:3000/api/sea-service?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Record deleted!')
        fetchSeaServices()
      } else {
        setError('Failed to delete record')
      }
    } catch (e) {
      console.error('Error deleting:', e)
      setError('Error deleting record')
    }
  }

  const handleEdit = (service: SeaService) => {
    setFormData({
      vesselName: service.vesselName || '',
      rank: service.rank || '',
      grt: service.grt ? String(service.grt) : '',
      dwt: service.dwt ? String(service.dwt) : '',
      engineType: service.engineType || '',
      bhp: service.bhp ? String(service.bhp) : '',
      companyName: service.companyName || '',
      flag: service.flag || '',
      signOn: service.signOn ? service.signOn.split('T')[0] : '',
      signOff: service.signOff ? service.signOff.split('T')[0] : '',
      remarks: service.remarks || '',
    })
    setEditing(service)
    setIsAdding(false)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>🌊 Sea Service Experience</h1>

      {/* Add Record Form */}
      {isAdding || editing ? (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '24px', background: '#f9fafb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>{editing ? '✏️ Edit Sea Service' : '➕ Add New Sea Service'}</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Vessel Information */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Vessel Name *</label>
              <input
                type="text"
                value={formData.vesselName}
                onChange={(e) => handleChange('vesselName', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Rank</label>
              <RankSelect
                value={formData.rank}
                onChange={(value) => handleChange('rank', value)}
                showDescription={true}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>GRT (Gross Tonnage)</label>
              <input
                type="number"
                value={formData.grt}
                onChange={(e) => handleChange('grt', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>DWT (Deadweight)</label>
              <input
                type="number"
                value={formData.dwt}
                onChange={(e) => handleChange('dwt', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Engine Type</label>
              <input
                type="text"
                value={formData.engineType}
                onChange={(e) => handleChange('engineType', e.target.value)}
                placeholder="e.g., Diesel, HFO"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>BHP (Horsepower)</label>
              <input
                type="number"
                value={formData.bhp}
                onChange={(e) => handleChange('bhp', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Flag</label>
              <input
                type="text"
                value={formData.flag}
                onChange={(e) => handleChange('flag', e.target.value)}
                placeholder="e.g., Panama, Liberia"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Sign On</label>
              <input
                type="date"
                value={formData.signOn}
                onChange={(e) => handleChange('signOn', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Sign Off</label>
              <input
                type="date"
                value={formData.signOff}
                onChange={(e) => handleChange('signOff', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{ padding: '10px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              💾 Save
            </button>
            <button onClick={resetForm} style={{ padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} style={{ padding: '10px 16px', marginBottom: '20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ➕ Add Sea Service Record
        </button>
      )}

      {/* Sea Service Records Table */}
      <div style={{ overflowX: 'auto', marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Records ({seaServices.length})</h3>
        {seaServices.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No sea service records yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginTop: '12px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Vessel</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Rank</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>GRT</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Company</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Sign On</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Sign Off</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seaServices.map((service) => (
                <tr key={service.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <strong>{service.vesselName || '-'}</strong>
                  </td>
                  <td style={{ padding: '10px' }}>{service.rank || '-'}</td>
                  <td style={{ padding: '10px' }}>{service.grt ? service.grt.toLocaleString() : '-'}</td>
                  <td style={{ padding: '10px', fontSize: '0.85rem' }}>{service.companyName || '-'}</td>
                  <td style={{ padding: '10px', fontSize: '0.85rem' }}>{service.signOn ? new Date(service.signOn).toLocaleDateString('id-ID') : '-'}</td>
                  <td style={{ padding: '10px', fontSize: '0.85rem' }}>{service.signOff ? new Date(service.signOff).toLocaleDateString('id-ID') : '-'}</td>
                  <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(service)} style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(service.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button onClick={() => window.history.back()} style={{ padding: '10px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>
    </main>
  )
}
