'use client'

import { useEffect, useState } from 'react'
import RankSelect from './RankSelect'

type FieldDefinition = {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'textarea' | 'checkbox' | 'select' | 'email' | 'tel' | 'file' | 'rank-select'
  section: string
  order: number
  required?: boolean
  placeholder?: string
  options?: string | string[]
  repeating?: boolean
}

type FormTemplate = {
  id: number
  code: string
  title: string
  description?: string
  fields: FieldDefinition[]
}

interface DynamicFormProps {
  formCode: string
  crewId?: number
  applicationId?: number
  onSubmit: (data: any) => Promise<void>
}

export default function DynamicForm({ formCode, crewId, applicationId, onSubmit }: DynamicFormProps) {
  const [template, setTemplate] = useState<FormTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [documentRows, setDocumentRows] = useState<any[]>([{ files: null }]) // For repeating document rows with file upload
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/forms?code=${formCode}`)
        const data = await res.json()
        if (data && data.code && Array.isArray(data.fields)) {
          setTemplate(data)
          // Initialize form data with empty values
          const initial: Record<string, any> = {}

          data.fields.forEach((field: FieldDefinition) => {
            if (field.type === 'checkbox') {
              initial[field.name] = false
            } else {
              initial[field.name] = ''
            }
          })

          setFormData(initial)
        } else {
          setError('Invalid form template structure')
        }
      } catch (e) {
        console.error('Error fetching form:', e)
        setError('Failed to load form template')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [formCode])

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleDocumentChange = (rowIndex: number, fieldName: string, value: any) => {
    setDocumentRows((prev) => {
      const updated = [...prev]
      updated[rowIndex] = { ...updated[rowIndex], [fieldName]: value }
      return updated
    })
  }

  const addDocumentRow = () => {
    setDocumentRows((prev) => [...prev, { files: null }])
  }

  const handleFileChange = (rowIndex: number, files: FileList | null) => {
    setDocumentRows((prev) => {
      const updated = [...prev]
      updated[rowIndex] = { ...updated[rowIndex], files: files?.[0] || null }
      return updated
    })
  }

  const removeDocumentRow = (rowIndex: number) => {
    if (documentRows.length > 1) {
      setDocumentRows((prev) => prev.filter((_, idx) => idx !== rowIndex))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Use FormData for file uploads
      const formDataObj = new FormData()
      
      // Add metadata fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, String(value || ''))
      })

      // Add document rows with files
      documentRows.forEach((row, index) => {
        Object.entries(row).forEach(([key, value]) => {
          if (key === 'files' && value) {
            formDataObj.append(`documents[${index}][file]`, value as File)
          } else if (key !== 'files') {
            formDataObj.append(`documents[${index}][${key}]`, String(value || ''))
          }
        })
      })

      formDataObj.append('crewId', String(crewId || ''))
      formDataObj.append('templateCode', formCode)

      // Send as multipart/form-data
      const response = await fetch('/api/forms/submit-with-files', {
        method: 'POST',
        body: formDataObj,
      })

      if (response.ok) {
        const result = await response.json()
        alert('✅ Document Checklist saved successfully!')
        window.location.href = `/crew/${crewId}`
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit')
      }
    } catch (e: any) {
      console.error('Error submitting form:', e)
      setError(e.message || 'Failed to submit form')
      alert('❌ ' + (e.message || 'Failed to submit form'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading form...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!template || !Array.isArray(template.fields)) return <p>Form not found</p>

  // Group fields by section
  const sections = template.fields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = []
    }
    acc[field.section].push(field)
    return acc
  }, {} as Record<string, FieldDefinition[]>)

  // Separate metadata and document fields
  const metadataFields = template.fields.filter(f => f.section === 'Metadata')
  const documentFields = template.fields.filter(f => f.section === 'Documents')

  return (
    <div>
      {/* Navigation */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            ← Back to Crew
          </button>
          
          <nav style={{ fontSize: '0.85rem', color: '#64748b' }}>
            <a href="/crew" style={{ color: '#0284c7', textDecoration: 'none' }}>Crew</a>
            {crewId && (
              <>
                <span style={{ margin: '0 8px' }}>/</span>
                <a href={`/crew/${crewId}`} style={{ color: '#0284c7', textDecoration: 'none' }}>Crew #{crewId}</a>
              </>
            )}
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#1e293b', fontWeight: 600 }}>{template.title}</span>
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ marginBottom: 8 }}>{template.title}</h2>
        {template.description && <p style={{ color: '#666', marginTop: 0 }}>{template.description}</p>}

      {/* Metadata Section */}
      <fieldset style={{ marginBottom: '24px', padding: '20px', border: '2px solid #0284c7', borderRadius: '8px', background: '#f0f9ff' }}>
        <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0284c7', padding: '0 8px' }}>📋 Metadata</legend>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {metadataFields.sort((a, b) => a.order - b.order).map((field) => (
            <FormFieldInput 
              key={field.name}
              field={field} 
              value={formData[field.name] || ''} 
              onChange={(val) => handleChange(field.name, val)} 
            />
          ))}
        </div>
      </fieldset>

      {/* Documents Section - Repeating Rows */}
      <fieldset style={{ marginBottom: '24px', padding: '20px', border: '2px solid #16a34a', borderRadius: '8px', background: '#f0fdf4' }}>
        <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#16a34a', padding: '0 8px' }}>📄 Documents (Add Multiple Rows)</legend>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#dcfce7', borderBottom: '2px solid #16a34a' }}>
                {documentFields.sort((a, b) => a.order - b.order).map(field => (
                  <th key={field.name} style={{ padding: 8, textAlign: 'left', fontSize: '0.9rem', fontWeight: 600 }}>{field.label}</th>
                ))}
                <th style={{ padding: 8, textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, minWidth: 150 }}>📎 Upload File</th>
                <th style={{ padding: 8, width: 80 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {documentRows.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #d1fae5' }}>
                  {documentFields.sort((a, b) => a.order - b.order).map(field => (
                    <td key={field.name} style={{ padding: 8 }}>
                      <DocumentFieldInput 
                        field={field}
                        value={row[field.name] || ''}
                        onChange={(val) => handleDocumentChange(rowIndex, field.name, val)}
                      />
                    </td>
                  ))}
                  <td style={{ padding: 8 }}>
                    <input 
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(rowIndex, e.target.files)}
                      style={{ 
                        width: '100%',
                        padding: '4px', 
                        fontSize: '0.8rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4
                      }}
                    />
                    {row.files && (
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 4 }}>
                        ✓ {row.files.name}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <button 
                      type="button"
                      onClick={() => removeDocumentRow(rowIndex)}
                      disabled={documentRows.length === 1}
                      style={{ 
                        padding: '4px 8px', 
                        background: documentRows.length === 1 ? '#cbd5e1' : '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 4, 
                        cursor: documentRows.length === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          type="button"
          onClick={addDocumentRow}
          style={{ 
            padding: '8px 16px', 
            background: '#16a34a', 
            color: 'white', 
            border: 'none', 
            borderRadius: 6, 
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          ➕ Add Document Row
        </button>
      </fieldset>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: saving ? '#94a3b8' : '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)' }}>
          {saving ? '💾 Saving...' : '💾 Save Form'}
        </button>
      </div>
    </form>
    </div>
  )
}

interface FormFieldInputProps {
  field: FieldDefinition
  value: any
  onChange: (value: any) => void
}

interface DocumentFieldInputProps {
  field: FieldDefinition
  value: any
  onChange: (value: any) => void
}

// Compact input for table cells
function DocumentFieldInput({ field, value, onChange }: DocumentFieldInputProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #cbd5e1',
    borderRadius: 4,
    fontSize: '0.85rem',
  }

  if (field.type === 'checkbox') {
    return (
      <input 
        type="checkbox" 
        checked={value || false} 
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, cursor: 'pointer' }}
      />
    )
  }

  if (field.type === 'select') {
    const options = typeof field.options === 'string' ? JSON.parse(field.options) : (field.options || [])
    return (
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        <option value="">--</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        rows={2}
        style={inputStyle}
      />
    )
  }

  return (
    <input 
      type={field.type} 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  )
}

function FormFieldInput({ field, value, onChange }: FormFieldInputProps) {
  const commonStyles: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
  }

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 500,
    color: '#333',
  }

  const requiredMark = field.required ? <span style={{ color: 'red' }}>*</span> : null

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label style={labelStyles}>
            {field.label} {requiredMark}
          </label>
          <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} style={commonStyles} placeholder={field.placeholder} />
        </div>
      )
    case 'checkbox':
      return (
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={value || false} onChange={(e) => onChange(e.target.checked)} />
            {field.label} {requiredMark}
          </label>
        </div>
      )
    case 'select':
      const options = typeof field.options === 'string' ? JSON.parse(field.options) : (field.options || [])
      return (
        <div>
          <label style={labelStyles}>
            {field.label} {requiredMark}
          </label>
          <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={commonStyles}>
            <option value="">-- Select --</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )
    case 'rank-select':
      return (
        <div>
          <label style={labelStyles}>
            {field.label} {requiredMark}
          </label>
          <RankSelect
            value={value || ''}
            onChange={onChange}
            showDescription={true}
            style={commonStyles}
            required={field.required}
          />
        </div>
      )
    case 'file':
      return (
        <div>
          <label style={labelStyles}>
            {field.label} {requiredMark}
          </label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onChange(file)
            }}
            style={commonStyles}
          />
        </div>
      )
    default:
      return (
        <div>
          <label style={labelStyles}>
            {field.label} {requiredMark}
          </label>
          <input type={field.type} value={value || ''} onChange={(e) => onChange(e.target.value)} style={commonStyles} placeholder={field.placeholder} />
        </div>
      )
  }
}
