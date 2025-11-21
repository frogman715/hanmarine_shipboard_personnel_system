'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OnboardingStep {
  step: number
  title: string
  titleId: string
  description: string
  pic: string
  docTerkait: string[]
  actions: string[]
}

interface CrewOnboardingStatus {
  crewId: number
  fullName: string
  rank: string
  currentStep: number
  updatedAt: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    step: 1,
    title: 'Pengumpulan dan Pengolahan Data CREW',
    titleId: 'data-collection',
    description: 'Melakukan pengumpulan data crew dan membuatkan dokumen serah terima',
    pic: 'Admin Crewing',
    docTerkait: ['Form Serah Terima Dokumen', 'CHECK LIST PENERIMAAN DOCUMEN CREW'],
    actions: [
      'Form serah terima doc diprint dan dikopi',
      'File kopian diserahkan pada crew, asli diarsipkan',
      'Apabila ada doc/sertifikat yang sudah kadaluarsa harus segera direvalidasi',
    ],
  },
  {
    step: 2,
    title: 'Scanning Data',
    titleId: 'scanning',
    description: 'Scan semua sertifikat dan dibuatkan folder nama',
    pic: 'Admin Crewing',
    docTerkait: ['Folder Scanning Crew'],
    actions: [
      'Scan semua sertifikat dan dokumen identitas',
      'Buat folder dengan nama crew',
      'Simpan di folder scanning crew',
      'Verify kualitas scan (readable, tidak terpotong)',
    ],
  },
  {
    step: 3,
    title: 'Input Data Crew',
    titleId: 'data-input',
    description: 'Sertifikat yang sudah discan diinput ke data utama',
    pic: 'Admin Crewing',
    docTerkait: ['Database Crew', 'Certificate Records'],
    actions: [
      'Input nomor sertifikat',
      'Input tanggal issued',
      'Input tanggal expired',
      'Update crew profile dengan data lengkap',
    ],
  },
  {
    step: 4,
    title: 'Membuat CV Crew',
    titleId: 'cv-creation',
    description: 'Membuat CV crew sesuai dengan flag negara kapal',
    pic: 'Crewing Officer',
    docTerkait: ['CV Template by Flag', 'Crew Profile'],
    actions: [
      'Pilih template CV sesuai flag state (Bahamas, Panama, Marshall Islands, dll)',
      'Generate CV dari data crew',
      'Review dan verify kelengkapan informasi',
      'Simpan CV dalam format PDF',
    ],
  },
  {
    step: 5,
    title: 'Kirim CV ke Owner',
    titleId: 'cv-submission',
    description: 'Submit CV ke owner untuk approval',
    pic: 'Crewing Manager',
    docTerkait: ['Email Template', 'Crew CV'],
    actions: [
      'Kirim CV ke owner via email',
      'Tunggu feedback dari owner',
      'Jika ditolak: file CV kembali untuk promosi ke owner lain',
      'Jika diapprove: lanjut ke tahap berikutnya',
    ],
  },
  {
    step: 6,
    title: 'Approval Crew - Dokumen Checklist',
    titleId: 'approval-checklist',
    description: 'Jika diapprove, dibuatkan dokumen checklist lengkap',
    pic: 'Crewing Officer',
    docTerkait: ['DOC-CHECKLIST', 'AC-02 Next of Kin', 'AC-04 Declaration', 'Training Record'],
    actions: [
      'Buat dan lengkapi Document Checklist (DOC-CHECKLIST)',
      'Buat Next of Kin Form (AC-02)',
      'Buat Declaration Form (AC-04)',
      'Lengkapi Training Record',
      'Verify semua dokumen valid dan lengkap',
    ],
  },
  {
    step: 7,
    title: 'On Board - Update Sistem',
    titleId: 'onboard',
    description: 'Update data crew list, CRP (Crew Replacement Plan), dan HUBLA',
    pic: 'Crewing Manager',
    docTerkait: ['Crew List', 'CRP', 'HUBLA Report'],
    actions: [
      'Update crew list dengan status ONBOARD',
      'Update Crew Replacement Plan (CRP)',
      'Update HUBLA (Hubungan Laut - Maritime Relations)',
      'Record sign-on date dan vessel assignment',
    ],
  },
  {
    step: 8,
    title: 'Finish - Arsip Dokumen',
    titleId: 'archive',
    description: 'Dokumen crew disimpan pada rak yang sudah ditentukan',
    pic: 'Admin Crewing',
    docTerkait: ['Filing System'],
    actions: [
      'Simpan dokumen fisik pada rak yang sudah ditentukan',
      'Update status crew menjadi ACTIVE/ONBOARD',
      'Archive digital documents',
      'Complete onboarding process',
    ],
  },
]

export default function OnboardingPage() {
  const [crewStatus, setCrewStatus] = useState<CrewOnboardingStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  useEffect(() => {
    // Fetch crew onboarding status
    const fetchCrewStatus = async () => {
      try {
        const res = await fetch('/api/crew?status=PENDING,PROCESSING,APPROVED')
        if (res.ok) {
          const crew = await res.json()
          // Mock onboarding progress - in real app, this would come from OnboardingProgress table
          const statusData = crew.slice(0, 10).map((c: any, idx: number) => ({
            crewId: c.id,
            fullName: c.fullName || c.name || 'Unknown',
            rank: c.rank || 'N/A',
            currentStep: Math.floor(Math.random() * 8) + 1, // Mock data
            updatedAt: new Date().toISOString(),
          }))
          setCrewStatus(statusData)
        }
      } catch (error) {
        console.error('Error fetching crew status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCrewStatus()
  }, [])

  const getStepColor = (step: number): string => {
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#06b6d4', // cyan
      '#6366f1', // indigo
      '#14b8a6', // teal
    ]
    return colors[step - 1] || '#6b7280'
  }

  const getCrewAtStep = (step: number): CrewOnboardingStatus[] => {
    return crewStatus.filter((c) => c.currentStep === step)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔄 Crew Onboarding Workflow</h1>
            <p className="text-gray-600">
              Prosedur penerimaan crew - 8 langkah dari pengumpulan data hingga on board
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/crew"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              👥 Crew List
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
            >
              📊 Dashboard
            </Link>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{crewStatus.length}</div>
            <div className="text-sm text-gray-600">Total in Pipeline</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {crewStatus.filter((c) => c.currentStep >= 7).length}
            </div>
            <div className="text-sm text-gray-600">Near Completion</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {crewStatus.filter((c) => c.currentStep === 5).length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {crewStatus.filter((c) => c.currentStep <= 3).length}
            </div>
            <div className="text-sm text-gray-600">Processing Docs</div>
          </div>
        </div>
      </div>

      {/* Visual Flow Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">📋 Workflow Steps</h2>
        <div className="space-y-4">
          {ONBOARDING_STEPS.map((step, idx) => (
            <div key={step.step}>
              <div
                className="flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md"
                style={{
                  borderColor: getStepColor(step.step),
                  backgroundColor: selectedStep === step.step ? `${getStepColor(step.step)}10` : 'white',
                }}
                onClick={() => setSelectedStep(selectedStep === step.step ? null : step.step)}
              >
                {/* Step Number */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getStepColor(step.step) }}
                >
                  {step.step}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        👤 {step.pic}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                        {getCrewAtStep(step.step).length} crew
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{step.description}</p>

                  {/* Expanded Details */}
                  {selectedStep === step.step && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div>
                        <div className="font-medium text-sm mb-2">✅ Action Items:</div>
                        <ul className="space-y-1">
                          {step.actions.map((action, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="font-medium text-sm mb-2">📄 Dokumen Terkait:</div>
                        <div className="flex flex-wrap gap-2">
                          {step.docTerkait.map((doc, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Crew at this step */}
                      {getCrewAtStep(step.step).length > 0 && (
                        <div>
                          <div className="font-medium text-sm mb-2">👥 Crew at this step:</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {getCrewAtStep(step.step).map((crew) => (
                              <Link
                                key={crew.crewId}
                                href={`/crew/${crew.crewId}`}
                                className="text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded border border-blue-200 transition"
                              >
                                <div className="font-medium">{crew.fullName}</div>
                                <div className="text-gray-600">{crew.rank}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        {step.step === 1 && (
                          <Link
                            href="/crew?action=handover"
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                          >
                            📝 Form Serah Terima
                          </Link>
                        )}
                        {step.step === 3 && (
                          <Link
                            href="/crew"
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                          >
                            📊 Input Data Crew
                          </Link>
                        )}
                        {step.step === 4 && (
                          <Link
                            href="/crew?action=generate-cv"
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                          >
                            📄 Generate CV
                          </Link>
                        )}
                        {step.step === 6 && (
                          <Link
                            href="/applications/form?templateCode=DOC-CHECKLIST"
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                          >
                            ✅ Document Checklist
                          </Link>
                        )}
                        {step.step === 7 && (
                          <Link
                            href="/replacement-schedule"
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                          >
                            🚢 Update CRP
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow to next step */}
                {idx < ONBOARDING_STEPS.length - 1 && (
                  <div className="absolute left-8 mt-14 text-2xl text-gray-400">↓</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Guide */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📚 Process Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">🎯 Key Objectives</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Ensure complete documentation collection</li>
              <li>• Maintain digital and physical archives</li>
              <li>• Verify all certificates are valid</li>
              <li>• Generate accurate CV per flag requirements</li>
              <li>• Track approval status with owners</li>
              <li>• Complete mandatory checklists</li>
              <li>• Update all systems before boarding</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">⏱️ Timeline Estimates</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Steps 1-3: 2-3 days (Documentation)</li>
              <li>• Step 4: 1 day (CV Generation)</li>
              <li>• Step 5: 3-7 days (Owner Approval)</li>
              <li>• Step 6: 1-2 days (Checklist Completion)</li>
              <li>• Step 7-8: 1 day (System Update & Archive)</li>
              <li>• <strong>Total: 8-14 days average</strong></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            <strong>💡 Tip:</strong> Click on any step to see detailed action items and crew currently at that stage. 
            Use quick action buttons to navigate directly to relevant forms and pages.
          </p>
        </div>
      </div>
    </div>
  )
}
