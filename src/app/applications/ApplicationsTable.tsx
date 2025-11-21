'use client'

import { useEffect, useState } from 'react'

type Application = {
  id: number
  crewId: number
  appliedRank?: string | null
  applicationDate?: string | null
  notes?: string | null
  status: string
  crew?: { id: number; fullName: string } | null
  checklists?: Array<{ id?: number; medicalOk?: boolean | null; trainingCertsOk?: boolean | null; procedure?: Record<string, boolean> | null }>
}

const statusOrder = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'OFFERED', 'ACCEPTED', 'REJECTED']

export default function ApplicationsTable() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [joiningPendingOnly, setJoiningPendingOnly] = useState<boolean>(false)

  // Check URL param for joiningPendingOnly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('joiningPendingOnly') === 'true') {
        setJoiningPendingOnly(true)
      }
    }
  }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/applications', { cache: 'no-store' })
      if (!res.ok) throw new Error('Gagal mengambil data applications')
      const data = await res.json()
      setApps(data)
    } catch (e: any) {
      setError(e.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal update status')
      await load()
    } catch (e: any) {
      alert(e.message ?? 'Error')
    }
  }

  async function prepareJoining(applicationId: number) {
    try {
      const res = await fetch('/api/applications/prepare-joining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal prepare joining')
      alert('Joining prepared: checklist & instruction dibuat')
    } catch (e: any) {
      alert(e.message ?? 'Error')
    }
  }

  const isJoiningPending = (a: Application) => {
    if (!(a.status === 'APPROVED' || a.status === 'ACCEPTED')) return false
    const cls = a.checklists || []
    if (cls.length === 0) return true
    return cls.some((cl) => cl?.medicalOk !== true || cl?.trainingCertsOk !== true)
  }

  // Compute procedure progress (12 langkah utama, exclude "ownerRejected")
  const progressOf = (a: Application) => {
    const items = [
      ['dataCollection','Pengumpulan data'],
      ['scanning','Scanning dokumen'],
      ['dataEntry','Input data crew'],
      ['cvCreated','Buat CV sesuai flag'],
      ['cvSentToOwner','Kirim CV ke owner'],
      ['ownerApproved','Disetujui owner'],
      ['docChecklistPrepared','Doc checklist disiapkan'],
      ['nextOfKinPrepared','Next of kin'],
      ['declarationPrepared','Declaration'],
      ['trainingRecordPrepared','Training record'],
      ['onBoarded','On board'],
      ['archived','Arsip dokumen'],
    ] as const
    const total = items.length
    const cl = (a.checklists && a.checklists.length > 0) ? a.checklists[a.checklists.length - 1] : undefined
    const proc = (cl?.procedure || {}) as Record<string, boolean>
    const done = items.reduce((acc, [k]) => acc + (proc?.[k] ? 1 : 0), 0)
    const pendingLabels = items.filter(([k]) => !proc?.[k]).map(([,label]) => label)
    const percent = Math.round((done / (total || 1)) * 100)
    return { done, total, percent, pendingLabels }
  }

  const filtered = apps
    .filter((a) => (statusFilter === 'ALL' ? true : a.status === statusFilter))
    .filter((a) => (joiningPendingOnly ? isJoiningPending(a) : true))

  return (
    <section style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Applications</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', paddingRight: 8, borderRight: '1px solid #374151' }}>
            <input type="checkbox" checked={joiningPendingOnly} onChange={(e) => setJoiningPendingOnly(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Joining Pending only</span>
          </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.35rem 0.5rem', borderRadius: 8 }}>
            <option value="ALL">All</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="APPROVED">Approved</option>
            <option value="OFFERED">Offered</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={load} disabled={loading} style={{ padding: '0.35rem 0.65rem', borderRadius: 8 }}>
            {loading ? 'Refresh…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: '#fca5a5', marginBottom: 8 }}>Error: {error}</div>}

      {filtered.length === 0 ? (
        <p>Tidak ada aplikasi.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px' }}>Nama</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Rank Dilamar</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Tanggal</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Notes</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const isPending = isJoiningPending(a)
                const prog = progressOf(a)
                return (
                <tr key={a.id}>
                  <td style={{ padding: '8px', borderTop: '1px solid #1f2937' }}>{a.crew?.fullName ?? '-'}</td>
                  <td style={{ padding: '8px', borderTop: '1px solid #1f2937' }}>{a.appliedRank ?? '-'}</td>
                  <td style={{ padding: '8px', borderTop: '1px solid #1f2937' }}>{a.applicationDate ? new Date(a.applicationDate).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '8px', borderTop: '1px solid #1f2937' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span>{a.status}</span>
                      {isPending && <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 999, background: '#3b82f6', color: 'white' }}>Pending</span>}
                      <span title={`Progress: ${prog.done}/${prog.total}\n\nPending:\n- ${prog.pendingLabels.join('\n- ') || 'Tidak ada, semua selesai'}`}
                        style={{ fontSize: 11, padding: '2px 6px', borderRadius: 999, background: prog.done === prog.total ? '#16a34a' : '#374151', color: 'white' }}>
                        {prog.done}/{prog.total}
                      </span>
                      <div title={`Progress ${prog.percent}%`}
                        style={{ width: 60, height: 6, background: '#334155', borderRadius: 999, overflow: 'hidden', marginLeft: 4 }}>
                        <div style={{ width: `${prog.percent}%`, height: '100%', background: prog.done === prog.total ? '#16a34a' : '#60a5fa' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '8px', borderTop: '1px solid #1f2937' }}>{a.notes ?? '-'}</td>
                  <td style={{ padding: '8px', borderTop: '1px solid #1f2937' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {a.status !== 'APPROVED' && a.status !== 'ACCEPTED' && a.status !== 'REJECTED' && (
                        <>
                          <button onClick={() => updateStatus(a.id, 'APPROVED')} style={{ padding: '0.25rem 0.6rem', borderRadius: 8, background: '#16a34a', color: 'white', border: 0 }}>Approve</button>
                          <button onClick={() => updateStatus(a.id, 'REJECTED')} style={{ padding: '0.25rem 0.6rem', borderRadius: 8, background: '#7f1d1d', color: 'white', border: 0 }}>Reject</button>
                        </>
                      )}
                      {(a.status === 'APPROVED' || a.status === 'ACCEPTED') && (
                        <>
                          <button onClick={() => prepareJoining(a.id)} style={{ padding: '0.25rem 0.6rem', borderRadius: 8 }}>Prepare Joining</button>
                          <a href={`/applications/${a.id}/joining`} style={{ padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #374151' }}>Open Checklist</a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
