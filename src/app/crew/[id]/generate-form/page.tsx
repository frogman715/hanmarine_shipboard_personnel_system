'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

type FormData = {
  fullName: string
  crewCode: string
  rank: string
  vessel: string
  placeOfBirth: string
  dateOfBirth: string
  age: string
  religion: string
  bloodType: string
  heightCm: string
  weightKg: string
  shoeSize: string
  address: string
  phoneMobile: string
  phoneHome: string
  wifeName: string
  totalFamily: string
  passport: string
  seamanBook: string
  medical: string
  lastVessel: string
  lastRank: string
  lastSignOn: string
  lastSignOff: string
  today: string
  year: string
}

export default function GenerateFormPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const crewId = Number(params.id)
  const formType = searchParams.get('form')

  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const formTitles: Record<string, string> = {
    'lundqvist-contract': "Seafarer's Employment Contract",
    'lundqvist-nok': 'Next of Kin Declaration',
    'lundqvist-form': 'Lundqvist Rederierna Form',
    'lundqvist-medical': 'Medical History Checklist',
    'lundqvist-checklist': 'Checklist Penerimaan Dokumen',
    'intergis-contract': 'Seafarer Employment Agreement',
    'intergis-nok': 'Next of Kin Declaration',
    'intergis-medical': 'Medical History Checklist',
    'intergis-training-record': 'Training Record',
    'intergis-training-schedule': 'Training Schedule',
  }

  useEffect(() => {
    fetchCrewData()
  }, [crewId])

  const fetchCrewData = async () => {
    try {
      const res = await fetch(`/api/crew?id=${crewId}`)
      const crews = await res.json()
      const crew = crews.find((c: any) => c.id === crewId)

      if (crew) {
        setFormData({
          fullName: crew.fullName || '',
          crewCode: crew.crewCode || '',
          rank: crew.rank || '',
          vessel: crew.vessel || '',
          placeOfBirth: crew.placeOfBirth || '',
          dateOfBirth: crew.dateOfBirth ? new Date(crew.dateOfBirth).toLocaleDateString('en-GB') : '',
          age: crew.dateOfBirth ? String(Math.floor((new Date().getTime() - new Date(crew.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : '',
          religion: crew.religion || '',
          bloodType: crew.bloodType || '',
          heightCm: crew.heightCm || '',
          weightKg: crew.weightKg || '',
          shoeSize: crew.shoeSize || '',
          address: crew.address || '',
          phoneMobile: crew.phoneMobile || '',
          phoneHome: crew.phoneHome || '',
          wifeName: crew.wifeName || '',
          totalFamily: crew.totalFamily || '',
          passport: crew.certificates?.find((c: any) => c.type.includes('Passport'))?.expiryDate 
            ? new Date(crew.certificates.find((c: any) => c.type.includes('Passport')).expiryDate).toLocaleDateString('en-GB') 
            : '',
          seamanBook: crew.certificates?.find((c: any) => c.type.includes('Seaman'))?.expiryDate 
            ? new Date(crew.certificates.find((c: any) => c.type.includes('Seaman')).expiryDate).toLocaleDateString('en-GB') 
            : '',
          medical: crew.certificates?.find((c: any) => c.type.includes('Medical'))?.expiryDate 
            ? new Date(crew.certificates.find((c: any) => c.type.includes('Medical')).expiryDate).toLocaleDateString('en-GB') 
            : '',
          lastVessel: crew.seaServices?.[0]?.vesselName || '',
          lastRank: crew.seaServices?.[0]?.rank || '',
          lastSignOn: crew.seaServices?.[0]?.signOn 
            ? new Date(crew.seaServices[0].signOn).toLocaleDateString('en-GB') 
            : '',
          lastSignOff: crew.seaServices?.[0]?.signOff 
            ? new Date(crew.seaServices[0].signOff).toLocaleDateString('en-GB') 
            : '',
          today: new Date().toLocaleDateString('en-GB'),
          year: String(new Date().getFullYear()),
        })
      }
    } catch (error) {
      console.error('Error fetching crew data:', error)
      alert('Failed to load crew data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null)
  }

  const handleGenerate = async () => {
    if (!formData) return

    setGenerating(true)
    try {
      // Send to generate API with edited data
      const res = await fetch(`/api/crew/${crewId}/generate-form?form=${formType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formData.fullName}_${formType}.${formType?.includes('checklist') || formType?.includes('training-record') ? 'xlsx' : 'docx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        alert('Form generated and downloaded successfully!')
        router.push(`/crew/${crewId}`)
      } else {
        const error = await res.json()
        alert('Failed to generate form: ' + (error.details || error.error))
      }
    } catch (error) {
      console.error('Error generating form:', error)
      alert('Error generating form')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <main style={{ padding: 20 }}><p>Loading crew data...</p></main>
  if (!formData) return <main style={{ padding: 20 }}><p style={{ color: 'red' }}>Crew not found</p></main>

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: 20, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '8px 16px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: 16
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
          📝 Edit Form Data
        </h1>
        <p style={{ color: '#64748b', marginTop: 0 }}>
          {formTitles[formType || ''] || 'Form'} - Review and edit data before generating
        </p>
      </div>

      {/* Form Fields */}
      <div style={{ background: '#f9fafb', padding: 24, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Crew Code</label>
            <input
              type="text"
              value={formData.crewCode}
              onChange={(e) => handleChange('crewCode', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Rank</label>
            <input
              type="text"
              value={formData.rank}
              onChange={(e) => handleChange('rank', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Vessel</label>
            <input
              type="text"
              value={formData.vessel}
              onChange={(e) => handleChange('vessel', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Place of Birth</label>
            <input
              type="text"
              value={formData.placeOfBirth}
              onChange={(e) => handleChange('placeOfBirth', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Date of Birth</label>
            <input
              type="text"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              placeholder="DD/MM/YYYY"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Religion</label>
            <input
              type="text"
              value={formData.religion}
              onChange={(e) => handleChange('religion', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Blood Type</label>
            <input
              type="text"
              value={formData.bloodType}
              onChange={(e) => handleChange('bloodType', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Phone Mobile</label>
            <input
              type="text"
              value={formData.phoneMobile}
              onChange={(e) => handleChange('phoneMobile', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Wife Name</label>
            <input
              type="text"
              value={formData.wifeName}
              onChange={(e) => handleChange('wifeName', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem', fontFamily: 'inherit' }}
            />
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '12px 24px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Cancel
        </button>
        
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            padding: '12px 32px',
            background: generating ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: generating ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
          }}
        >
          {generating ? '⏳ Generating...' : '📥 Generate & Download'}
        </button>
      </div>
    </main>
  )
}
