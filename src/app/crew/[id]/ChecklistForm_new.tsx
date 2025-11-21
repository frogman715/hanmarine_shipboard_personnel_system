'use client'

import { useEffect, useState } from 'react'
import './checklist-form.css'

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
    <div className="checklist-form-container">
      <div className="checklist-form-header">
        <span className="icon">📋</span>
        <h4>Pre-Join Preparation Checklist</h4>
        <div className="checklist-compliance-badges">
          <span className="checklist-compliance-badge">
            <span className="icon">✓</span>
            HGQS PM Annex B
          </span>
          <span className="checklist-compliance-badge">
            <span className="icon">✓</span>
            MLC 2006 Reg 1.2 & 1.3
          </span>
        </div>
      </div>
      
      <div className="checklist-items-container">
        <div className="checklist-items-grid">
          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={passportOk} 
              onChange={(e) => setPassportOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">📘</span>
              <span>Passport</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={seamanBookOk} 
              onChange={(e) => setSeamanBookOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">📕</span>
              <span>Seaman's Book (SIRB)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={cocOk} 
              onChange={(e) => setCocOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">🎓</span>
              <span>COC / COP (Certificate of Competency)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={medicalOk} 
              onChange={(e) => setMedicalOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">🏥</span>
              <span>Medical Certificate (PEME - Max 2 years validity)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={visaOk} 
              onChange={(e) => setVisaOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">🌏</span>
              <span>Visa (Flag State Requirements)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={vaccinationOk} 
              onChange={(e) => setVaccinationOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">💉</span>
              <span>Vaccination (Yellow Fever)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={photoIdOk} 
              onChange={(e) => setPhotoIdOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">📸</span>
              <span>Photo ID Copy</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={policeClearanceOk} 
              onChange={(e) => setPoliceClearanceOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">👮</span>
              <span>Police Clearance (SKCK)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={trainingCertsOk} 
              onChange={(e) => setTrainingCertsOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">📜</span>
              <span>Training Certificates (Basic Safety - STCW95)</span>
            </span>
          </label>

          <label className="checklist-item-label">
            <input 
              type="checkbox" 
              checked={covidVaccineOk} 
              onChange={(e) => setCovidVaccineOk(e.target.checked)} 
              className="checklist-item-checkbox"
            />
            <span className="checklist-item-text">
              <span className="checklist-item-icon">💉</span>
              <span>COVID-19 Vaccine Certificate</span>
            </span>
          </label>
        </div>
      </div>

      <div className="checklist-remarks-section">
        <label className="checklist-remarks-label">
          <span className="icon">📝</span>
          <span>Remarks & Notes</span>
        </label>
        <textarea 
          value={remarks} 
          onChange={(e) => setRemarks(e.target.value)} 
          placeholder="Add any special notes, document issues, or follow-up actions required..."
          className="checklist-remarks-textarea"
        />
      </div>

      <div className="checklist-button-group">
        <button 
          onClick={submit} 
          disabled={loading} 
          className="checklist-save-button"
        >
          <span className="icon">{loading ? '⏳' : '✅'}</span>
          <span>{loading ? 'Saving Checklist...' : 'Save Checklist'}</span>
        </button>
      </div>
      
      {saved && (
        <div className="checklist-alert checklist-alert-success">
          <div className="checklist-alert-success-text">
            <span>✅</span>
            <span>Checklist saved successfully! All documents verified.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="checklist-alert checklist-alert-error">
          <div className="checklist-alert-error-text">
            <span>❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {warnings && warnings.length > 0 && (
        <div className="checklist-alert-warning">
          <div className="checklist-alert-warning-title">
            <span>⚠️</span>
            <span>Certificate Expiry Warnings</span>
          </div>
          <ul className="checklist-warning-list">
            {warnings.map((w) => (
              <li key={w.id}>
                <strong>{w.type}</strong> — Expired: {w.expiryDate ? new Date(w.expiryDate).toLocaleDateString() : 'unknown'}
              </li>
            ))}
          </ul>
          <div className="checklist-warning-note">
            ⚠️ Certificates must be renewed 15 months before expiry (HGQS PM Annex B § 3.3)
          </div>
        </div>
      )}
    </div>
  )
}
