'use client'

import { useEffect, useState } from 'react'
import MainNavigation from '@/components/MainNavigation'

type Alert = {
  assignmentId: number
  crewId: number
  fullName: string
  rank: string
  vesselName: string
  signOn: string
  monthsOnboard: number
  severity: 'warning' | 'critical'
}

type Application = {
  id: number
  crewId: number
  appliedRank?: string | null
  applicationDate?: string | null
  status: string
  crew?: { id: number; fullName: string } | null
  checklists?: Array<{ procedure?: Record<string, boolean> | null }>
}

type PlannedReplacement = {
  id: number
  crewId: number
  crewName: string
  rank: string
  vesselName: string
  flag: string
  signOn: string
  signOff: string | null
  status: string
  seamanBook: string
  passport: string
}

type CRPData = {
  year: number
  totalAssignments: number
  byMonth: Record<string, PlannedReplacement[]>
}

export default function ReplacementSchedulePage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [crpData, setCrpData] = useState<CRPData | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'alerts' | 'planned'>('alerts')

  useEffect(() => {
    async function load() {
      try {
        const [alertsRes, appsRes, crpRes] = await Promise.all([
          fetch('/api/contracts/alerts', { cache: 'no-store' }),
          fetch('/api/applications', { cache: 'no-store' }),
          fetch('/api/crew-replacement-plan?year=2025', { cache: 'no-store' }),
        ])
        const alertsData = await alertsRes.json()
        const appsData = await appsRes.json()
        const crpDataRes = await crpRes.json()
        // API returns { count, alerts } object
        setAlerts(Array.isArray(alertsData?.alerts) ? alertsData.alerts : Array.isArray(alertsData) ? alertsData : [])
        setApplications(Array.isArray(appsData) ? appsData : [])
        setCrpData(crpDataRes)
      } catch (e) {
        console.error(e)
        setAlerts([])
        setApplications([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Group applications by rank (only APPROVED/ACCEPTED)
  const candidatesByRank = applications
    .filter((a) => a.status === 'APPROVED' || a.status === 'ACCEPTED')
    .reduce((acc, app) => {
      const rank = app.appliedRank || 'Unknown'
      if (!acc[rank]) acc[rank] = []
      acc[rank].push(app)
      return acc
    }, {} as Record<string, Application[]>)

  // Compute progress for candidate badge
  const progressOf = (a: Application) => {
    const keys = [
      'dataCollection', 'scanning', 'dataEntry', 'cvCreated', 'cvSentToOwner',
      'ownerApproved', 'docChecklistPrepared', 'nextOfKinPrepared',
      'declarationPrepared', 'trainingRecordPrepared', 'onBoarded', 'archived',
    ]
    const cl = (a.checklists && a.checklists.length > 0) ? a.checklists[a.checklists.length - 1] : undefined
    const proc = (cl?.procedure || {}) as Record<string, boolean>
    const done = keys.reduce((acc, k) => acc + (proc?.[k] ? 1 : 0), 0)
    const percent = Math.round((done / keys.length) * 100)
    return { done, total: keys.length, percent }
  }

  return (
    <>
      <MainNavigation />
      <main style={{ marginLeft: '260px', padding: '2rem', width: 'calc(100vw - 220px)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>🔄 Crew Replacement Schedule</h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
            Daftar crew yang kontraknya hampir habis + rencana replacement dari CRP 2025
          </p>
        </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setView('alerts')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            background: view === 'alerts' ? '#0284c7' : 'transparent',
            color: view === 'alerts' ? 'white' : '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ⚠️ Contract Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setView('planned')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            background: view === 'planned' ? '#0284c7' : 'transparent',
            color: view === 'planned' ? 'white' : '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          📋 Planned Replacements 2025 ({crpData?.totalAssignments || 0})
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#9ca3af', padding: 16 }}>Loading...</div>
      ) : view === 'alerts' ? (
        // Existing alerts view
        alerts.length === 0 ? (
          <div style={{ color: '#9ca3af', padding: 16 }}>Tidak ada crew yang perlu diganti saat ini.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {alerts.map((alert) => {
              const candidates = candidatesByRank[alert.rank] || []
              return (
                <div
                  key={alert.assignmentId}
                  style={{
                    border: '1px solid #1f2937',
                    borderRadius: 12,
                    padding: '1.25rem',
                    background: '#0f172a',
                  }}
                >
                  {/* Crew yang akan diganti */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
                        {alert.fullName}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                        {alert.rank} • {alert.vesselName}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: 4 }}>
                        Sign-on: {new Date(alert.signOn).toLocaleDateString()} • {alert.monthsOnboard} bulan onboard
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: alert.severity === 'critical' ? '#991b1b' : '#854d0e',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      {alert.severity === 'critical' ? 'CRITICAL' : 'WARNING'}
                    </span>
                  </div>

                  {/* Kandidat pengganti */}
                  <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.95rem' }}>
                      Kandidat Pengganti ({alert.rank}) — {candidates.length} available
                    </div>

                    {candidates.length === 0 ? (
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: 8 }}>
                        Belum ada kandidat approved untuk rank ini.{' '}
                        <a
                          href={`/applications/new?prefillRank=${alert.rank}&notes=Replacement for ${alert.fullName} (${alert.vesselName})`}
                          style={{ color: '#38bdf8' }}
                        >
                          Propose Replacement →
                        </a>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                        {candidates.map((cand) => {
                          const prog = progressOf(cand)
                          return (
                            <div
                              key={cand.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem',
                                background: '#1e293b',
                                borderRadius: 8,
                                border: '1px solid #334155',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                  {cand.crew?.fullName || `Crew #${cand.crewId}`}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>
                                  Applied: {cand.applicationDate ? new Date(cand.applicationDate).toLocaleDateString() : '-'} • Status: {cand.status}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                {/* Progress badge */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      padding: '2px 6px',
                                      borderRadius: 999,
                                      background: prog.done === prog.total ? '#16a34a' : '#374151',
                                      color: 'white',
                                    }}
                                  >
                                    {prog.done}/{prog.total}
                                  </span>
                                  <div
                                    style={{
                                      width: 60,
                                      height: 6,
                                      background: '#334155',
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${prog.percent}%`,
                                        height: '100%',
                                        background: prog.done === prog.total ? '#16a34a' : '#60a5fa',
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Action buttons */}
                                <a
                                  href={`/applications/${cand.id}/joining`}
                                  style={{
                                    padding: '0.35rem 0.7rem',
                                    borderRadius: 8,
                                    background: '#0284c7',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  Open Checklist
                                </a>
                                <a
                                  href={`/crew/${cand.crewId}`}
                                  style={{
                                    padding: '0.35rem 0.7rem',
                                    borderRadius: 8,
                                    border: '1px solid #374151',
                                    color: '#e5e7eb',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  View Crew
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      ) : (
        // New CRP view
        !crpData || Object.keys(crpData.byMonth).length === 0 ? (
          <div style={{ color: '#9ca3af', padding: 16 }}>No planned replacements found for 2025.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {Object.entries(crpData.byMonth).map(([month, replacements]) => (
              <div
                key={month}
                style={{
                  border: '1px solid #1f2937',
                  borderRadius: 12,
                  padding: '1.25rem',
                  background: '#0f172a',
                }}
              >
                <h2 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>
                  📅 {month} ({replacements.length} replacements)
                </h2>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {replacements.map((replacement) => (
                    <div
                      key={replacement.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: '#1e293b',
                        borderRadius: 8,
                        border: '1px solid #334155',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>
                          {replacement.crewName}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                          {replacement.rank} • {replacement.vesselName} ({replacement.flag})
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 4 }}>
                          Sign On: {new Date(replacement.signOn).toLocaleDateString()}
                          {replacement.signOff && ` → Sign Off: ${new Date(replacement.signOff).toLocaleDateString()}`}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: replacement.status === 'PLANNED_OFFBOARD' ? '#991b1b' : '#16a34a',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        >
                          {replacement.status === 'PLANNED_OFFBOARD' ? 'OFF-SIGNER' : 'ON-SIGNER'}
                        </span>
                        <a
                          href={`/crew/${replacement.crewId}`}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: 8,
                            border: '1px solid #374151',
                            color: '#e5e7eb',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                          }}
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
      </main>
    </>
  )
}
