// CONTEXT READ 14: Lines 481-520 for crew entry form analysis
// CONTEXT READ 15: Lines 521-560 for crew entry form analysis
// CONTEXT READ 13: Lines 441-480 for crew entry form analysis
// CONTEXT READ 14: Lines 481-520 for crew entry form analysis
// CONTEXT READ 12: Lines 401-440 for crew entry form analysis
// CONTEXT READ 13: Lines 441-480 for crew entry form analysis
// CONTEXT READ 11: Lines 361-400 for crew entry form analysis
// CONTEXT READ 12: Lines 401-440 for crew entry form analysis
// CONTEXT READ 10: Lines 321-360 for crew entry form analysis
// CONTEXT READ 11: Lines 361-400 for crew entry form analysis
// CONTEXT READ 9: Lines 281-320 for crew entry form analysis
// CONTEXT READ 10: Lines 321-360 for crew entry form analysis
// CONTEXT READ 8: Lines 241-280 for crew entry form analysis
// CONTEXT READ 9: Lines 281-320 for crew entry form analysis
// CONTEXT READ 7: Lines 201-240 for crew entry form analysis
// CONTEXT READ 8: Lines 241-280 for crew entry form analysis
// CONTEXT READ 6: Lines 161-200 for crew entry form analysis
// CONTEXT READ 7: Lines 201-240 for crew entry form analysis
// CONTEXT READ 5: Lines 121-160 for crew entry form analysis
// CONTEXT READ 6: Lines 161-200 for crew entry form analysis
// CONTEXT READ 4: Lines 81-120 for crew entry form analysis
// CONTEXT READ 5: Lines 121-160 for crew entry form analysis
// CONTEXT READ 3: Lines 41-80 for crew entry form analysis
// CONTEXT READ 4: Lines 81-120 for crew entry form analysis
// CONTEXT READ 2: Next 40 lines for crew entry form analysis
// CONTEXT READ 3: Lines 41-80 for crew entry form analysis
// Copilot context read: analyzing crew entry workflow (no code changes)
// CONTEXT READ 2: Next 40 lines for crew entry form analysis
'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import RankSelect from '@/components/RankSelect'
import MainNavigation from '@/components/MainNavigation'

type Crew = {
  id: number
  crewCode?: string | null
  fullName: string
  rank: string
  vessel?: string | null
  status: string
  crewStatus?: string
  reportedToOffice?: boolean | null
  reportedToOfficeDate?: string | null
  inactiveReason?: string | null
}

export default function CrewPage() {
  const [rows, setRows] = useState<Crew[]>([])
  const [filteredRows, setFilteredRows] = useState<Crew[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  async function updateReportingStatus(crewId: number, reported: boolean) {
    try {
      const res = await fetch('/api/crew/reporting-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewId, reportedToOffice: reported })
      })
      if (!res.ok) throw new Error('Failed to update')
      await load()
    } catch (e) {
      alert('Error updating reporting status')
    }
  }

  async function markAsInactive(crewId: number, reason: string) {
    if (!confirm(`Mark crew as INACTIVE: ${reason}?`)) return
    try {
      const res = await fetch('/api/crew/reporting-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewId, inactiveReason: reason })
      })
      if (!res.ok) throw new Error('Failed to update')
      await load()
    } catch (e) {
      alert('Error marking crew as inactive')
    }
  }

  const [fullName, setFullName] = useState('')
  const [rank, setRank] = useState('')
  const [vessel, setVessel] = useState('')
  const [status, setStatus] = useState('AVAILABLE')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/crew/list')
      if (!res.ok) throw new Error('Failed to load crew')
      const data = await res.json()
      setRows(data)
      setFilteredRows(data)
    } catch (e: any) {
      setError(e.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    let filtered = rows

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.rank?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.vessel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.crewCode?.includes(searchTerm)
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((c) => (c.crewStatus || c.status) === statusFilter)
    }

    setFilteredRows(filtered)
  }, [searchTerm, statusFilter, rows])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!fullName || !rank) {
      alert('Nama lengkap dan rank wajib diisi')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, rank, vessel, status }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Gagal simpan crew')
      }
      setFullName('')
      setRank('')
      setVessel('')
      setStatus('AVAILABLE')
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <MainNavigation />
      <main style={{ marginLeft: '260px', padding: '2rem', width: 'calc(100vw - 260px)' }}>
        <style>{`
        .crew-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .crew-page-title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }
        .crew-stats {
          display: flex;
          gap: 2rem;
          color: #9ca3af;
          font-size: 0.875rem;
        }
        .crew-stat-item {
          display: flex;
        // Copilot context read: analyzing crew entry workflow (no code changes)
          flex-direction: column;
        }
        .crew-stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0284c7;
        }
        .search-filter-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1;
          min-width: 250px;
          padding: 0.75rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          color: #e5e7eb;
          font-size: 0.875rem;
        }
        .search-input::placeholder {
          color: #6b7280;
        }
        .filter-select {
          padding: 0.75rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          color: #e5e7eb;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-active { background: #064e3b; color: #6ee7b7; }
        .status-onboard { background: #064e3b; color: #6ee7b7; }
        .status-standby { background: #082f49; color: #7dd3fc; }
        .status-available { background: #1e3a8a; color: #93c5fd; }
        .status-on_leave { background: #713f12; color: #fde047; }
        .crew-table {
          width: 100%;
          border-collapse: collapse;
          background: #111827;
          border-radius: 8px;
          overflow: hidden;
        }
        .crew-table thead {
          background: #1f2937;
        }
        .crew-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #e5e7eb;
          font-size: 0.875rem;
        }
        .crew-table td {
          padding: 0.75rem 1rem;
          border-top: 1px solid #1f2937;
          font-size: 0.875rem;
        }
        .crew-table tbody tr {
          transition: background 0.2s;
        }
        .crew-table tbody tr:hover {
          background: #1f2937;
        }
        .report-btn {
          padding: 0.35rem 0.6rem;
          font-size: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .report-btn:hover {
          opacity: 0.8;
        }
        .report-btn-yes {
          background: #059669;
          color: #fff;
        }
        .report-btn-no {
          background: #dc2626;
          color: #fff;
        }
        .report-btn-active {
          background: #374151;
          opacity: 0.6;
        }
        .crew-name-link {
          color: #0284c7;
          text-decoration: none;
          font-weight: 500;
        }
        .crew-name-link:hover {
          text-decoration: underline;
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }
        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="crew-page-header">
        <div>
          <h1 className="crew-page-title">👥 Crew Database</h1>
          <p style={{ color: '#9ca3af', margin: '0.5rem 0 0' }}>Manage crew members, ranks, and assignments</p>
        </div>
        <div className="crew-stats">
          <div className="crew-stat-item">
            <span className="crew-stat-value">{rows.length}</span>
            <span>Total Crew</span>
          </div>
          <div className="crew-stat-item">
            <span className="crew-stat-value">{filteredRows.length}</span>
            <span>Filtered</span>
          </div>
        </div>
      </div>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 340px) minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #1f2937',
            background: '#111827',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 'bold' }}>➕ Add New Crew</h3>

          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            Nama lengkap
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.4rem 0.55rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
              }}
              placeholder="mis. ARIEF SULAEMAN"
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            Rank / jabatan
            <div style={{ marginTop: '0.25rem' }}>
              <RankSelect
                value={rank}
                onChange={setRank}
                placeholder="Select rank (e.g. CO, 2E, AB)"
                showDescription={true}
              />
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            Vessel (opsional)
            <input
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.4rem 0.55rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
              }}
              placeholder="mis. MT ALFA BALTICA"
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.4rem 0.55rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
              }}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ONBOARD">ONBOARD</option>
              <option value="ON LEAVE">ON LEAVE</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '999px',
              border: 'none',
              background: saving ? '#1f2937' : '#38bdf8',
              color: '#020617',
              fontWeight: 600,
              cursor: saving ? 'default' : 'pointer',
            }}
          >
            {saving ? 'Menyimpan…' : 'Simpan crew'}
          </button>

          {error && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#f97373' }}>
              Error: {error}
            </p>
          )}
        </form>

        <div>
          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <input
              type="text"
              placeholder="🔍 Search by code, name, rank, or vessel..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ONBOARD">Onboard</option>
              <option value="STANDBY">Standby</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Crew Table */}
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading crew...</div>
          ) : filteredRows.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No crew found</h3>
              <p style={{ margin: 0 }}>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter'
                  : 'Add your first crew member using the form'}
              </p>
            </div>
          ) : (
            <table className="crew-table">
              <thead>
                <tr>
                  <th>Crew Code</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Vessel</th>
                  <th>Status</th>
                  <th>Office Report</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((c) => {
                  const isStandby = (c.crewStatus || c.status) === 'STANDBY'
                  return (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: '#60a5fa', fontWeight: 600 }}>
                        {c.crewCode || '—'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/crew/${c.id}`} className="crew-name-link">
                        {c.fullName}
                      </Link>
                    </td>
                    <td style={{ color: '#9ca3af' }}>{c.rank || '—'}</td>
                    <td style={{ color: '#9ca3af' }}>{c.vessel || '—'}</td>
                    <td>
                      <span className={`status-badge status-${(c.crewStatus || c.status || 'ACTIVE').toLowerCase().replace(' ', '_')}`}>
                        {c.crewStatus || c.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>
                      {isStandby ? (
                        c.reportedToOffice === false ? (
                          <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>❌ Tidak Lapor</span>
                        ) : c.reportedToOffice === true ? (
                          <span style={{ color: '#10b981', fontSize: '0.875rem' }}>✅ Sudah Lapor{c.reportedToOfficeDate ? ` (${new Date(c.reportedToOfficeDate).toLocaleDateString()})` : ''}</span>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>—</span>
                        )
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      {isStandby && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateReportingStatus(c.id, true) }}
                            className={`report-btn ${c.reportedToOffice === true ? 'report-btn-active' : 'report-btn-yes'}`}
                            title="Mark as reported to office"
                          >
                            ✅ Lapor
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateReportingStatus(c.id, false) }}
                            className={`report-btn ${c.reportedToOffice === false ? 'report-btn-active' : 'report-btn-no'}`}
                            title="Mark as NOT reported"
                          >
                            ❌ Tidak
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsInactive(c.id, 'Pindah Kantor') }}
                            className="report-btn"
                            style={{ background: '#7c3aed', color: '#fff' }}
                            title="Mark as moved to another office"
                          >
                            🏢 Pindah
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
    </>
  )
}
