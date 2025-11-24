'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Vessel = {
  id: number
  name: string
  flag: string
  vesselType?: string | null
  owner?: string | null
  ownerId?: number | null
  grt?: number | null
  dwt?: number | null
  imo?: string | null
  callSign?: string | null
  registrationYear?: number | null
  notes?: string | null
  _count?: { assignments?: number }
  ownerRel?: { id: number; name: string } | null
}

type Assignment = {
  id: number
  crewId: number
  vesselName: string
  rank: string
  signOn?: string | null
  signOff?: string | null
  status: string
  crew?: { fullName: string; crewStatus: string } | null
}

export default function VesselsPage() {
  const [vessels, setVessels] = useState<Vessel[]>([])
  const [filteredVessels, setFilteredVessels] = useState<Vessel[]>([])
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null)
  const [crewList, setCrewList] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCrew, setLoadingCrew] = useState(false)
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL')
  const [flagFilter, setFlagFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [owners, setOwners] = useState<Array<{ name: string }>>([])

  useEffect(() => {
    async function load() {
      try{
        const [vesselsRes, ownersRes] = await Promise.all([
          fetch('/api/vessels?includeCount=true&includeOwner=true', { cache: 'no-store' }),
          fetch('/api/owners', { cache: 'no-store' }),
        ])
        if (!vesselsRes.ok) throw new Error('Failed to fetch vessels')
        const vesselsData = await vesselsRes.json()
        setVessels(vesselsData)
        setFilteredVessels(vesselsData)
        if (ownersRes.ok) {
          const ownersData = await ownersRes.json()
          setOwners(ownersData)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let filtered = vessels

    if (ownerFilter !== 'ALL') {
      filtered = filtered.filter((v) => (v.ownerRel?.name || v.owner) === ownerFilter)
    }

    if (flagFilter !== 'ALL') {
      filtered = filtered.filter((v) => v.flag === flagFilter)
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter((v) => v.vesselType === typeFilter)
    }

    setFilteredVessels(filtered)
  }, [ownerFilter, flagFilter, typeFilter, vessels])

  async function loadCrewList(vesselName: string) {
    setLoadingCrew(true)
    try {
      const res = await fetch(`/api/assignments?vesselName=${encodeURIComponent(vesselName)}&status=ONBOARD,ACTIVE`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch crew list')
      const data = await res.json()
      setCrewList(data)
    } catch (e) {
      console.error(e)
      setCrewList([])
    } finally {
      setLoadingCrew(false)
    }
  }

  function selectVessel(v: Vessel) {
    setSelectedVessel(v)
    loadCrewList(v.name)
  }

  return (
    <main style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>🚢 Vessel List</h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Master data kapal dan crew onboard per vessel</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href="/api/export?type=vessels"
            download
            style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', borderRadius: 8, textDecoration: 'none' }}
          >
            📥 Download Vessel List (Excel)
          </a>
          <a
            href="/api/export?type=crew"
            download
            style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', borderRadius: 8, textDecoration: 'none' }}
          >
            📥 Download Crew List (Excel)
          </a>
          <Link href="/import" style={{ padding: '0.5rem 1rem', background: '#0284c7', color: 'white', borderRadius: 8, textDecoration: 'none' }}>
            Import Crew List Excel
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#9ca3af', padding: 16 }}>Loading...</div>
      ) : (
        <>
          {/* Filters */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Owner Filter */}
            {owners.length > 0 && (
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: 8, background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', minWidth: '200px' }}
              >
                <option value="ALL">All Owners</option>
                {owners.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>
            )}

            {/* Flag Filter */}
            <select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 8, background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', minWidth: '150px' }}
            >
              <option value="ALL">All Flags</option>
              {[...new Set(vessels.map((v) => v.flag).filter(Boolean))].sort().map((flag) => (
                <option key={flag} value={flag}>{flag}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 8, background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', minWidth: '150px' }}
            >
              <option value="ALL">All Types</option>
              {[...new Set(vessels.map((v) => v.vesselType).filter((t): t is string => Boolean(t)))].sort().map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Reset Filters */}
            {(ownerFilter !== 'ALL' || flagFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <button
                onClick={() => { setOwnerFilter('ALL'); setFlagFilter('ALL'); setTypeFilter('ALL'); }}
                style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#374151', border: '1px solid #4b5563', color: '#e5e7eb', cursor: 'pointer' }}
              >
                Reset Filters
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: selectedVessel ? '350px 1fr' : '1fr', gap: '1.5rem' }}>
            {/* Vessel List */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '1.1rem' }}>Vessels ({filteredVessels.length})</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {filteredVessels.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => selectVessel(v)}
                    style={{
                      padding: '1rem',
                      border: selectedVessel?.id === v.id ? '2px solid #0284c7' : '1px solid #1f2937',
                      borderRadius: 10,
                      background: selectedVessel?.id === v.id ? '#1e293b' : '#0f172a',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{v.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                      {v.flag} • {v.ownerRel?.name || v.owner || 'N/A'}
                    </div>
                    {v._count?.assignments !== undefined && (
                      <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginTop: 4 }}>
                        {v._count.assignments} crew member(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vessel Detail + Crew List */}
            {selectedVessel && (
              <div>
                <div style={{ padding: '1.5rem', border: '1px solid #1f2937', borderRadius: 12, background: '#0f172a', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', marginBottom: '0.75rem' }}>{selectedVessel.name}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                      <div style={{ color: '#9ca3af' }}>Flag</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.flag}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>Owner</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.ownerRel?.name || selectedVessel.owner || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>Type</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.vesselType || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>GRT</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.grt?.toLocaleString() || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>DWT</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.dwt?.toLocaleString() || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>IMO</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.imo || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>Call Sign</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.callSign || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>Year</div>
                      <div style={{ fontWeight: 600 }}>{selectedVessel.registrationYear || '-'}</div>
                    </div>
                  </div>
                  {selectedVessel.notes && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1e293b', borderRadius: 8, fontSize: '0.85rem', color: '#9ca3af' }}>
                      {selectedVessel.notes}
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #1f2937', borderRadius: 12, background: '#0f172a' }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Crew Onboard ({crewList.length})</h3>
                  {loadingCrew ? (
                    <div style={{ color: '#9ca3af' }}>Loading crew...</div>
                  ) : crewList.length === 0 ? (
                    <div style={{ color: '#9ca3af' }}>No crew onboard.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #1f2937' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #1f2937' }}>Rank</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #1f2937' }}>Sign On</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #1f2937' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #1f2937' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {crewList.map((a) => (
                            <tr key={a.id}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>{a.crew?.fullName || `Crew #${a.crewId}`}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>{a.rank}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>{a.signOn ? new Date(a.signOn).toLocaleDateString() : '-'}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                                <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 999, background: a.status === 'ONBOARD' ? '#16a34a' : '#374151', color: 'white' }}>
                                  {a.status}
                                </span>
                              </td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                                <Link href={`/crew/${a.crewId}`} style={{ color: '#38bdf8', fontSize: '0.85rem' }}>View Profile</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}
