'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Checklist = {
  id?: number
  medicalOk?: boolean | null
  trainingCertsOk?: boolean | null
  remarks?: string | null
  procedure?: Record<string, boolean> | null
}

export default function ApplicationJoiningPage() {
  const params = useParams()
  const applicationId = Number(params.id)
  const router = useRouter()

  const [data, setData] = useState<Checklist | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/applications/joining?applicationId=${applicationId}`, { cache: 'no-store' })
      const json = await res.json()
      const defaultProc = {
        dataCollection: false,
        scanning: false,
        dataEntry: false,
        cvCreated: false,
        cvSentToOwner: false,
        ownerRejected: false,
        ownerApproved: false,
        docChecklistPrepared: false,
        nextOfKinPrepared: false,
        declarationPrepared: false,
        trainingRecordPrepared: false,
        onBoarded: false,
        archived: false,
      }
      setData(
        json && json.id
          ? { ...json, procedure: { ...defaultProc, ...(json.procedure || {}) } }
          : { medicalOk: false, trainingCertsOk: false, remarks: '', procedure: defaultProc }
      )
    } catch (e: any) {
      setError(e.message ?? 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [applicationId])

  const save = async () => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch('/api/applications/joining', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          medicalOk: !!data?.medicalOk,
          trainingCertsOk: !!data?.trainingCertsOk,
          remarks: data?.remarks || '',
          procedure: data?.procedure || {},
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal menyimpan')
      await load()
      alert('Checklist berhasil disimpan')
    } catch (e: any) {
      setError(e.message ?? 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Joining Preparation Checklist</h2>
      <p style={{ color: '#9ca3af', marginTop: 4 }}>Application ID: {applicationId}</p>

      {loading ? (
        <div style={{ padding: 16, color: '#9ca3af' }}>Loading…</div>
      ) : (
        <div style={{ padding: 16, border: '1px solid #1f2937', borderRadius: 12, background: '#111827' }}>
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={!!data?.medicalOk}
              onChange={(e) => setData((d) => ({ ...(d || {}), medicalOk: e.target.checked }))}
            />
            <span style={{ color: '#e5e7eb' }}>Medical Check-up selesai</span>
          </label>

          <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={!!data?.trainingCertsOk}
              onChange={(e) => setData((d) => ({ ...(d || {}), trainingCertsOk: e.target.checked }))}
            />
            <span style={{ color: '#e5e7eb' }}>Training for join selesai</span>
          </label>

          {/* Procedure Checklist (berdasarkan flow manual) */}
          <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #1f2937' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Procedure Checklist</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
              <div style={{ border: '1px solid #1f2937', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#a3e635' }}>Persiapan Data</div>
                {[
                  ['dataCollection','Pengumpulan data crew'],
                  ['scanning','Scanning dokumen'],
                  ['dataEntry','Input data crew'],
                ].map(([key,label]) => (
                  <label key={key} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={!!data?.procedure?.[key as string]}
                      onChange={(e) => setData((d) => ({ ...(d||{}), procedure: { ...(d?.procedure||{}), [key]: e.target.checked } }))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div style={{ border: '1px solid #1f2937', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#60a5fa' }}>CV & Pengajuan</div>
                {[
                  ['cvCreated','Membuat CV sesuai flag'],
                  ['cvSentToOwner','Kirim CV ke owner'],
                  ['ownerRejected','Ditolak owner'],
                  ['ownerApproved','Disetujui owner'],
                ].map(([key,label]) => (
                  <label key={key} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={!!data?.procedure?.[key as string]}
                      onChange={(e) => setData((d) => ({ ...(d||{}), procedure: { ...(d?.procedure||{}), [key]: e.target.checked } }))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div style={{ border: '1px solid #1f2937', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#f59e0b' }}>Prepare Joining</div>
                {[
                  ['docChecklistPrepared','Doc checklist disiapkan'],
                  ['nextOfKinPrepared','Next of kin'],
                  ['declarationPrepared','Declaration'],
                  ['trainingRecordPrepared','Training record'],
                ].map(([key,label]) => (
                  <label key={key} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={!!data?.procedure?.[key as string]}
                      onChange={(e) => setData((d) => ({ ...(d||{}), procedure: { ...(d?.procedure||{}), [key]: e.target.checked } }))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div style={{ border: '1px solid #1f2937', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#34d399' }}>Eksekusi</div>
                {[
                  ['onBoarded','On board'],
                  ['archived','Arsip dokumen'],
                ].map(([key,label]) => (
                  <label key={key} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={!!data?.procedure?.[key as string]}
                      onChange={(e) => setData((d) => ({ ...(d||{}), procedure: { ...(d?.procedure||{}), [key]: e.target.checked } }))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <label style={{ display: 'block', marginTop: 12 }}>
            <div style={{ marginBottom: 6, color: '#9ca3af' }}>Catatan</div>
            <textarea
              value={data?.remarks || ''}
              onChange={(e) => setData((d) => ({ ...(d || {}), remarks: e.target.value }))}
              rows={4}
              style={{ width: '100%', padding: 10, borderRadius: 8, background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
              placeholder="Contoh: MCU tanggal 20/11, BST refresh selesai, tunggu visa."
            />
          </label>

          {error && <div style={{ color: '#fca5a5', marginTop: 10 }}>Error: {error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => router.back()} className="nav-btn nav-btn-secondary" style={{ padding: '0.45rem 0.8rem' }}>
              ← Back
            </button>
            <button onClick={save} disabled={saving} className="nav-btn nav-btn-primary" style={{ padding: '0.45rem 0.8rem' }}>
              {saving ? 'Menyimpan…' : 'Simpan Checklist'}
            </button>
            <button onClick={load} disabled={loading} className="nav-btn nav-btn-secondary" style={{ padding: '0.45rem 0.8rem' }}>
              Refresh
            </button>
            <a href="/applications" className="nav-btn nav-btn-secondary" style={{ padding: '0.45rem 0.8rem' }}>
              Ke Applications
            </a>
          </div>
        </div>
      )}
    </main>
  )
}
