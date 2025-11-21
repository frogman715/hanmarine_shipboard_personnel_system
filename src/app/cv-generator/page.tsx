'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CV_TEMPLATES, FLAG_OPTIONS, getTemplateByFlag, validateCrewDataForCV } from '@/lib/cv-templates'

export default function CVGeneratorPage() {
  const searchParams = useSearchParams()
  const preselectedCrewId = searchParams.get('crewId')

  const [crew, setCrew] = useState<any[]>([])
  const [selectedCrewId, setSelectedCrewId] = useState<string>(preselectedCrewId || '')
  const [selectedFlag, setSelectedFlag] = useState<string>('BAHAMAS')
  const [crewData, setCrewData] = useState<any>(null)
  const [validation, setValidation] = useState<{ valid: boolean; missing: string[] } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [cvPreview, setCvPreview] = useState<string>('')

  useEffect(() => {
    // Fetch crew list
    const fetchCrew = async () => {
      try {
        const res = await fetch('/api/crew')
        if (res.ok) {
          const data = await res.json()
          setCrew(data)
          
          if (preselectedCrewId) {
            const selected = data.find((c: any) => c.id.toString() === preselectedCrewId)
            if (selected) {
              setCrewData(selected)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching crew:', error)
      }
    }

    fetchCrew()
  }, [preselectedCrewId])

  useEffect(() => {
    if (selectedCrewId) {
      const selected = crew.find((c) => c.id.toString() === selectedCrewId)
      if (selected) {
        setCrewData(selected)
      }
    }
  }, [selectedCrewId, crew])

  useEffect(() => {
    if (crewData && selectedFlag) {
      const template = getTemplateByFlag(selectedFlag)
      if (template) {
        const result = validateCrewDataForCV(crewData, template)
        setValidation(result)
      }
    }
  }, [crewData, selectedFlag])

  const handleGenerateCV = async () => {
    if (!crewData || !selectedFlag) return

    setGenerating(true)
    try {
      // In a real app, this would call an API to generate PDF
      // For now, we'll create a preview
      const template = getTemplateByFlag(selectedFlag)
      if (template) {
        const preview = generateCVPreview(crewData, template)
        setCvPreview(preview)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert('✅ CV Generated Successfully!\n\nIn production, this would generate a PDF file.')
    } catch (error) {
      console.error('Error generating CV:', error)
      alert('❌ Error generating CV')
    } finally {
      setGenerating(false)
    }
  }

  const generateCVPreview = (crew: any, template: any): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CV - ${crew.fullName || crew.name}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #1e293b; font-size: 28px; }
    .header p { margin: 5px 0; color: #64748b; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #0284c7; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 15px; }
    .field { margin-bottom: 10px; }
    .field-label { font-weight: bold; color: #475569; display: inline-block; width: 180px; }
    .field-value { color: #1e293b; }
    .flag-badge { background: #0284c7; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="flag-badge">${template.country}</div>
    <h1>CURRICULUM VITAE</h1>
    <p>${crew.fullName || crew.name}</p>
    <p>Rank: ${crew.rank || 'N/A'}</p>
  </div>

  <div class="section">
    <h2>Personal Information</h2>
    <div class="field">
      <span class="field-label">Full Name:</span>
      <span class="field-value">${crew.fullName || crew.name || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Date of Birth:</span>
      <span class="field-value">${crew.dateOfBirth || crew.dob || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Nationality:</span>
      <span class="field-value">${crew.nationality || 'Indonesian'}</span>
    </div>
    <div class="field">
      <span class="field-label">Place of Birth:</span>
      <span class="field-value">${crew.placeOfBirth || crew.pob || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Passport No:</span>
      <span class="field-value">${crew.passportNumber || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Seaman Book No:</span>
      <span class="field-value">${crew.seamanBookNumber || 'N/A'}</span>
    </div>
  </div>

  <div class="section">
    <h2>Contact Information</h2>
    <div class="field">
      <span class="field-label">Address:</span>
      <span class="field-value">${crew.address || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Phone:</span>
      <span class="field-value">${crew.phone || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${crew.email || 'N/A'}</span>
    </div>
  </div>

  <div class="section">
    <h2>Certification & Licensing</h2>
    <div class="field">
      <span class="field-label">Rank/Position:</span>
      <span class="field-value">${crew.rank || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="field-label">Certificate of Competency:</span>
      <span class="field-value">Available - See Certificates Section</span>
    </div>
    <div class="field">
      <span class="field-label">Flag State Endorsement:</span>
      <span class="field-value">${template.country} Endorsed</span>
    </div>
  </div>

  <div class="section">
    <h2>Sea Service Experience</h2>
    <p style="color: #64748b; font-style: italic;">Detailed sea service records available upon request</p>
    <div class="field">
      <span class="field-label">Total Sea Service:</span>
      <span class="field-value">${crew.totalSeaService || 'N/A'}</span>
    </div>
  </div>

  <div class="section">
    <h2>Medical Certificate</h2>
    <div class="field">
      <span class="field-label">Medical Status:</span>
      <span class="field-value">Fit for Sea Service</span>
    </div>
    <div class="field">
      <span class="field-label">Certificate Valid Until:</span>
      <span class="field-value">See Medical Certificate</span>
    </div>
  </div>

  <div class="section">
    <h2>Training & Certifications</h2>
    <p style="color: #64748b; font-style: italic;">All STCW certificates and training records are attached</p>
  </div>

  <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
    <p>CV Generated by HanMarine Shipboard Personnel System</p>
    <p>Date: ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
    `.trim()
  }

  const template = selectedFlag ? getTemplateByFlag(selectedFlag) : null

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📄 CV Generator</h1>
        <p className="text-gray-600">
          Generate professional crew CV based on flag state requirements
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ CV Configuration</h2>

            {/* Crew Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Crew</label>
              <select
                value={selectedCrewId}
                onChange={(e) => setSelectedCrewId(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Crew --</option>
                {crew.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName || c.name} - {c.rank || 'N/A'}
                  </option>
                ))}
              </select>
            </div>

            {/* Flag Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Flag State / Vessel Flag</label>
              <select
                value={selectedFlag}
                onChange={(e) => setSelectedFlag(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FLAG_OPTIONS.map((flag) => (
                  <option key={flag.value} value={flag.value}>
                    {flag.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Info */}
            {template && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2 text-blue-900">
                  📋 {template.country} Template
                </h3>
                <div className="text-sm text-blue-800">
                  <div className="mb-2">
                    <strong>Format:</strong> {template.format}
                  </div>
                  <div>
                    <strong>Sections:</strong> {template.sections.length}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Status */}
            {validation && crewData && (
              <div
                className={`rounded-lg p-4 mb-4 ${
                  validation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    validation.valid ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {validation.valid ? '✅ Data Complete' : '⚠️ Missing Required Fields'}
                </h3>
                {!validation.valid && (
                  <ul className="text-sm text-red-800 space-y-1">
                    {validation.missing.map((field) => (
                      <li key={field}>• {field}</li>
                    ))}
                  </ul>
                )}
                {validation.valid && (
                  <p className="text-sm text-green-800">All required fields are present</p>
                )}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateCV}
              disabled={!crewData || !validation?.valid || generating}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                !crewData || !validation?.valid || generating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {generating ? '⏳ Generating CV...' : '📄 Generate CV'}
            </button>
          </div>

          {/* Template Sections */}
          {template && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">📑 CV Sections</h3>
              <ul className="space-y-2">
                {template.sections.map((section, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-blue-600">✓</span>
                    <span>{section}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          {crewData && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">👤 Crew Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{crewData.fullName || crewData.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Rank</div>
                  <div className="font-medium">{crewData.rank || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date of Birth</div>
                  <div className="font-medium">
                    {crewData.dateOfBirth || crewData.dob || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nationality</div>
                  <div className="font-medium">{crewData.nationality || 'Indonesian'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Passport</div>
                  <div className="font-medium">{crewData.passportNumber || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}

          {cvPreview && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">👁️ CV Preview</h2>
              <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: cvPreview }} />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([cvPreview], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `CV_${crewData.fullName || crewData.name}_${selectedFlag}.html`
                    a.click()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                >
                  💾 Download HTML
                </button>
                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          )}

          {!crewData && (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-600">Select a crew member to preview CV</p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">💡 CV Generation Guide</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">1️⃣ Select Crew</h3>
            <p className="text-sm text-gray-700">
              Choose the crew member from the dropdown. The system will load their complete profile
              including certificates and sea service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2️⃣ Choose Flag State</h3>
            <p className="text-sm text-gray-700">
              Select the vessel flag state. Each flag has specific CV format and required sections
              based on their maritime authority requirements.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3️⃣ Generate & Download</h3>
            <p className="text-sm text-gray-700">
              Click generate to create the CV. Review the preview and download as PDF or HTML. The
              CV is ready to send to vessel owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
