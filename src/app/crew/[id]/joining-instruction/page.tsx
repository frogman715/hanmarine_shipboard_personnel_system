'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Crew = {
  id: number
  fullName: string
  rank: string | null
  vessel: string | null
  address: string | null
  phoneMobile: string | null
}

type JoiningInstruction = {
  id: number
  crewId: number | null
  instructionText: string
  travelDetails: string | null
  issuedAt: string | null
  issuedBy: string | null
  crew: Crew | null
}

export default function JoiningInstructionPage() {
  const params = useParams()
  const crewId = Number(params.id)

  const [crew, setCrew] = useState<Crew | null>(null)
  const [ji, setJi] = useState<JoiningInstruction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [instructionText, setInstructionText] = useState('')
  const [travelDetails, setTravelDetails] = useState('')
  const [issuedBy, setIssuedBy] = useState('HanMarine HR Department')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch crew data
        const crewRes = await fetch(`/api/crew`)
        const crewData: Crew[] = await crewRes.json()
        const found = crewData.find((c) => c.id === crewId)
        if (found) setCrew(found)

        // Fetch existing joining instruction
        const jiRes = await fetch(`/api/joining-instructions?crewId=${crewId}`)
        const jiData: JoiningInstruction = await jiRes.json()
        if (jiData && jiData.id) {
          setJi(jiData)
          setInstructionText(jiData.instructionText || '')
          setTravelDetails(jiData.travelDetails || '')
          setIssuedBy(jiData.issuedBy || 'HanMarine HR Department')
        }
      } catch (e) {
        console.error('Error fetching data:', e)
        setError('Failed to load crew or joining instruction data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [crewId])

  const handleSave = async () => {
    if (!crew) return

    try {
      const method = ji ? 'PUT' : 'POST'
      const endpoint = '/api/joining-instructions'

      const payload = ji
        ? {
            id: ji.id,
            instructionText,
            travelDetails,
            issuedBy,
          }
        : {
            crewId,
            instructionText,
            travelDetails,
            issuedBy,
          }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const saved = await res.json()
        setJi(saved)
        alert('Joining Instruction saved successfully!')
      } else {
        alert('Failed to save joining instruction')
      }
    } catch (e) {
      console.error('Error saving:', e)
      alert('Error saving joining instruction')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!crew) return <p>Crew not found</p>

  const issuedDate = ji?.issuedAt ? new Date(ji.issuedAt).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Joining Instruction Letter</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleSave} style={{ padding: '8px 16px', marginRight: '10px', cursor: 'pointer' }}>
          💾 Save Instruction
        </button>
        <button onClick={handlePrint} style={{ padding: '8px 16px', cursor: 'pointer', background: '#0284c7', color: 'white' }}>
          🖨️ Print / PDF
        </button>
      </div>

      {/* Editor Section */}
      <div style={{ marginBottom: '30px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9fafb' }}>
        <h3>Edit Instruction Text</h3>
        <textarea
          value={instructionText}
          onChange={(e) => setInstructionText(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            padding: '10px',
            fontFamily: 'monospace',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
          placeholder="Enter custom instruction text..."
        />

        <h4 style={{ marginTop: '16px' }}>Travel Details (Optional)</h4>
        <textarea
          value={travelDetails}
          onChange={(e) => setTravelDetails(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            fontFamily: 'monospace',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
          placeholder="Flight details, accommodation, meeting point, etc."
        />

        <h4 style={{ marginTop: '16px' }}>Issued By</h4>
        <input
          type="text"
          value={issuedBy}
          onChange={(e) => setIssuedBy(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Print Preview Section */}
      <div
        style={{
          padding: '40px',
          border: '1px solid #333',
          background: 'white',
          lineHeight: '1.6',
          fontFamily: 'Arial, sans-serif',
          minHeight: '600px',
        }}
        id="print-content"
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '15px' }}>
          <h2 style={{ margin: '0 0 5px 0' }}>PT. HAN MARINE SERVICES</h2>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>Crew Management & Maritime Services</p>
          <p style={{ margin: '0', fontSize: '0.85rem', color: '#999' }}>Jakarta, Indonesia</p>
        </div>

        {/* Letter Date */}
        <p style={{ textAlign: 'right', marginBottom: '20px' }}>
          <strong>Date:</strong> {issuedDate}
        </p>

        {/* Recipient */}
        <p style={{ marginBottom: '20px' }}>
          <strong>To:</strong>
          <br />
          {crew.fullName}
          <br />
          {crew.rank || 'Crew Member'}
          <br />
          {crew.address ? crew.address.substring(0, 50) + (crew.address.length > 50 ? '...' : '') : ''}
          <br />
          {crew.phoneMobile || ''}
        </p>

        {/* Subject */}
        <p style={{ marginBottom: '20px' }}>
          <strong>Subject: JOINING INSTRUCTION - VESSEL ASSIGNMENT</strong>
        </p>

        {/* Body */}
        <div style={{ marginBottom: '20px', textAlign: 'justify' }}>
          <p>Dear {crew.fullName},</p>

          <p>We are pleased to inform you that your application has been accepted and we are now proceeding with your joining procedures.</p>

          <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Vessel Name:</strong> {crew.vessel || 'To be announced'}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Position:</strong> {crew.rank || 'To be confirmed'}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Contract Period:</strong> To be confirmed with Master
            </p>
          </div>

          {/* Main Instruction */}
          {instructionText && (
            <div style={{ marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
              {instructionText}
            </div>
          )}

          {/* Travel Details */}
          {travelDetails && (
            <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
              <strong>Travel Details & Meeting Point:</strong>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                {travelDetails}
              </div>
            </div>
          )}

          <p style={{ marginTop: '20px' }}>
            Please ensure you have all required documents ready before joining the vessel. Contact us if you have any questions regarding this instruction.
          </p>

          <p>Best regards,</p>
        </div>

        {/* Signature */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc' }}>
          <p style={{ margin: '0 0 40px 0' }}>
            <strong>{issuedBy}</strong>
            <br />
            PT. HAN MARINE SERVICES
          </p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>This document is issued on {issuedDate} and valid for vessel joining procedures.</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          main {
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
          button {
            display: none;
          }
          #print-content {
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </main>
  )
}
