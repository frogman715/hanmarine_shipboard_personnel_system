'use client'

import DynamicForm from '@/components/DynamicForm'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function DocumentChecklistPage() {
  const params = useParams()
  const crewId = Number(params.id)
  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState<number | null>(null)

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateCode: 'HGF-CR-01',
          crewId,
          formData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmissionId(result.id)
        setSubmitted(true)
        alert('✅ Document Checklist saved successfully!')
      } else {
        alert('Failed to save form')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving form')
    }
  }

  if (submitted && submissionId) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ padding: '20px', background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#16a34a' }}>✅ Document Checklist Saved!</h3>
          <p style={{ margin: 0, color: '#15803d' }}>Submission ID: {submissionId}</p>
        </div>
        <button onClick={() => window.history.back()} style={{ padding: '10px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back
        </button>
      </main>
    )
  }

  return (
    <main style={{ padding: '20px' }}>
      <DynamicForm formCode="HGF-CR-01" crewId={crewId} onSubmit={handleSubmit} />
    </main>
  )
}
