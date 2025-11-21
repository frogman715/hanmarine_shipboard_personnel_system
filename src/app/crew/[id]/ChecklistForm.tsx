'use client'

import { useEffect, useState } from 'react'

type Props = {
  crewId: number
}

export default function ChecklistForm({ crewId }: Props) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<any[] | null>(null)

  const [passportOk, setPassportOk] = useState<boolean>(false)
  const [seamanBookOk, setSeamanBookOk] = useState<boolean>(false)
  const [cocOk, setCocOk] = useState<boolean>(false)
  const [medicalOk, setMedicalOk] = useState<boolean>(false)
  const [visaOk, setVisaOk] = useState<boolean>(false)
  const [vaccinationOk, setVaccinationOk] = useState<boolean>(false)
  const [photoIdOk, setPhotoIdOk] = useState<boolean>(false)
  const [policeClearanceOk, setPoliceClearanceOk] = useState<boolean>(false)
  const [trainingCertsOk, setTrainingCertsOk] = useState<boolean>(false)
  const [covidVaccineOk, setCovidVaccineOk] = useState<boolean>(false)
  const [remarks, setRemarks] = useState<string>('')

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crewId,
          passportOk,
          seamanBookOk,
          cocOk,
          medicalOk,
          visaOk,
          vaccinationOk,
          photoIdOk,
          policeClearanceOk,
          trainingCertsOk,
          covidVaccineOk,
          remarks,
        }),
      })
      if (!res.ok) {
        const b = await res.json().catch(() => ({}))
        throw new Error(b.error || 'Gagal menyimpan checklist')
      }
      const data = await res.json().catch(() => ({}))
      if (data.warnings && data.warnings.length > 0) {
        setWarnings(data.warnings)
      } else {
        setSaved(true)
        setWarnings(null)
      }
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500)
      return () => clearTimeout(t)
    }
  }, [saved])

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20, borderRadius: 12, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: '1.5rem' }}>📋</span>
        <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>Pre-Join Preparation Checklist</h4>
      </div>
      
      <div style={{ background: 'rgba(255,255,255,0.15)', padding: 16, borderRadius: 10, marginBottom: 16, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={passportOk} onChange={(e) => setPassportOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>📘 Passport</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={seamanBookOk} onChange={(e) => setSeamanBookOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>📕 Seaman's Book</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={cocOk} onChange={(e) => setCocOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>🎓 COC / COP</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={medicalOk} onChange={(e) => setMedicalOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>🏥 Medical Certificate</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={visaOk} onChange={(e) => setVisaOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>🌏 Visa</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={vaccinationOk} onChange={(e) => setVaccinationOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>💉 Vaccination (Yellow Fever)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={photoIdOk} onChange={(e) => setPhotoIdOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>📸 Photo ID Copy</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={policeClearanceOk} onChange={(e) => setPoliceClearanceOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>👮 Police Clearance (SKCK)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={trainingCertsOk} onChange={(e) => setTrainingCertsOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>📜 Training Certificates</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
            <input type="checkbox" checked={covidVaccineOk} onChange={(e) => setCovidVaccineOk(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>💉 COVID-19 Vaccine</span>
          </label>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
          📝 Remarks
        </label>
        <textarea 
          value={remarks} 
          onChange={(e) => setRemarks(e.target.value)} 
          placeholder="Add notes or special instructions..."
          style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: 'none', fontSize: '0.9rem', resize: 'vertical', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button 
          onClick={submit} 
          disabled={loading} 
          style={{ 
            flex: 1,
            padding: 12, 
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontWeight: 600, 
            fontSize: '0.95rem', 
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)', 
            transition: 'all 0.3s' 
          }}
        >
          {loading ? '⏳ Saving...' : '✅ Save Checklist'}
        </button>
      </div>
      
      {saved && (
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(16, 185, 129, 0.2)', borderRadius: 8, border: '2px solid #10b981' }}>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>✅ Checklist saved successfully!</span>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(239, 68, 68, 0.2)', borderRadius: 8, border: '2px solid #ef4444' }}>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>❌ {error}</span>
        </div>
      )}
      {warnings && warnings.length > 0 && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #f59e0b', borderRadius: 6, background: '#fff7ed' }}>
          <strong>Expired certificates found:</strong>
          <ul style={{ marginTop: 8 }}>
            {warnings.map((w) => (
              <li key={w.id}>
                {w.type} — expired: {w.expiryDate ? new Date(w.expiryDate).toLocaleDateString() : 'unknown'}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 8, color: '#92400e' }}>Please update certificates before proceeding.</p>
        </div>
      )}
    </div>
  )
}

