'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MainNavigation from '@/components/MainNavigation'

type Crew = { id: number; fullName: string }

export default function NewApplicationPage() {
  const [crew, setCrew] = useState<Crew[]>([])
  const [selectedCrew, setSelectedCrew] = useState<number | ''>('')
  const [appliedRank, setAppliedRank] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'quality' | 'alpha'>('quality')
  const [certStats, setCertStats] = useState<Record<number, { total: number; expired: number; expiring: number }>>({})

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetch('/api/crew')
      .then((r) => r.json())
      .then((d) => setCrew(d))
      .catch((e) => console.error(e))
  }, [])

  // Prefill from query params (e.g., ?prefillRank=CO&notes=Replacement...&candidateCrewId=123)
  useEffect(() => {
    const prefillRank = searchParams.get('prefillRank')
    const prefillNotes = searchParams.get('notes')
    const candidateCrewId = searchParams.get('candidateCrewId')
    if (prefillRank) setAppliedRank(prefillRank)
    if (prefillNotes) setNotes(prefillNotes)
    if (candidateCrewId) setSelectedCrew(Number(candidateCrewId))
  }, [searchParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedCrew) {
      alert('Pilih crew terlebih dahulu')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewId: selectedCrew, appliedRank, notes }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Gagal membuat application')
      }
      router.push('/applications')
    } catch (e: any) {
      setError(e.message ?? 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const prefillRank = searchParams.get('prefillRank') || ''
  const candidateListBase = crew.filter((c) => {
    // Show STANDBY crew (available for assignment) or AVAILABLE
    const status = c.crewStatus || c.status
    const statusOk = status === 'STANDBY' || status === 'AVAILABLE'
    const rankOk = prefillRank ? (c.rank || '').toLowerCase() === prefillRank.toLowerCase() : true
    const nameOk = search ? (c.fullName || '').toLowerCase().includes(search.toLowerCase()) : true
    return statusOk && rankOk && nameOk
  })
  // Sort by docs quality or alphabetically
  const scored = candidateListBase.map((c) => {
    const cs = certStats[c.id]
    let score = 2 // default no certs
    if (cs) {
      if (cs.expired > 0) score = 3
      else if (cs.expiring > 0) score = 1
      else if (cs.total > 0) score = 0
    }
    return { c, score }
  })
  if (sortBy === 'quality') {
    scored.sort((a, b) => a.score - b.score || (a.c.fullName || '').localeCompare(b.c.fullName || ''))
  } else {
    scored.sort((a, b) => (a.c.fullName || '').localeCompare(b.c.fullName || ''))
  }
  const candidateList = scored.slice(0, 24).map((x) => x.c)

  // Fetch certificate stats for visible candidates
  useEffect(() => {
    let ignore = false
    const run = async () => {
      const entries = await Promise.all(
        candidateList.map(async (c) => {
          try {
            const res = await fetch(`/api/certificates?crewId=${c.id}`, { cache: 'no-store' })
            if (!res.ok) return [c.id, { total: 0, expired: 0, expiring: 0 }] as const
            const list = await res.json()
            const now = new Date().getTime()
            const td = 30 * 24 * 60 * 60 * 1000
            let expired = 0, expiring = 0
            for (const cert of list) {
              if (!cert.expiryDate) continue
              const t = new Date(cert.expiryDate).getTime()
              if (t < now) expired++
              else if (t - now <= td) expiring++
            }
            return [c.id, { total: list.length || 0, expired, expiring }] as const
          } catch {
            return [c.id, { total: 0, expired: 0, expiring: 0 }] as const
          }
        })
      )
      if (!ignore) {
        const obj: Record<number, { total: number; expired: number; expiring: number }> = {}
        for (const [id, v] of entries) obj[id] = v
        setCertStats(obj)
      }
    }
    run()
    return () => { ignore = true }
  }, [candidateList.map((c) => c.id).join(',')])

  return (
    <>
      <MainNavigation />
      <main style={{ marginLeft: '260px', padding: '2rem', width: 'calc(100vw - 220px)' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Buat Application</h2>

        {/* Find Candidate Panel */}
        <section style={{ margin: '12px 0', padding: '12px', border: '1px solid #1f2937', borderRadius: 8, background: '#111827' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong>Find Candidate</strong>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              placeholder="Cari nama kandidat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.35rem 0.5rem', borderRadius: 8, background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'quality' | 'alpha')} style={{ padding: '0.35rem 0.5rem', borderRadius: 8, background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}>
              <option value="quality">Sort: Docs Quality</option>
              <option value="alpha">Sort: A-Z</option>
            </select>
            <span style={{ color: '#9ca3af', fontSize: 12 }}>
              {prefillRank ? `Rank: ${prefillRank}` : 'Rank belum ditentukan'} • {candidateList.length} kandidat
            </span>
          </div>
        </div>
        {candidateList.length === 0 ? (
          <div style={{ color: '#9ca3af' }}>Tidak ada kandidat STANDBY (siap naik) untuk rank ini.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
            {candidateList.map((c) => (
              <div key={c.id} style={{ padding: 10, border: '1px solid #374151', borderRadius: 8, background: '#0b1220' }}>
                <div style={{ color: '#e5e7eb', fontWeight: 600 }}>{c.fullName}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>{c.rank || '-'} • {c.vessel || '—'}</div>
                {(() => {
                  const cs = certStats[c.id]
                  if (!cs) return null
                  const badgeStyle = { display: 'inline-block', marginTop: 6, padding: '2px 6px', borderRadius: 999, fontSize: 12 }
                  if (cs.expired > 0) return <span style={{ ...badgeStyle, background: '#7f1d1d', color: '#fca5a5' }}>❌ {cs.expired} expired</span>
                  if (cs.expiring > 0) return <span style={{ ...badgeStyle, background: '#713f12', color: '#fde047' }}>⚠️ {cs.expiring} expiring</span>
                  if (cs.total > 0) return <span style={{ ...badgeStyle, background: '#064e3b', color: '#6ee7b7' }}>✅ docs ok</span>
                  return null
                })()}
                <button
                  type="button"
                  onClick={() => setSelectedCrew(c.id)}
                  style={{ marginTop: 8, padding: '0.25rem 0.6rem', borderRadius: 8 }}
                >
                  Pilih
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedCrew && (
        <div style={{ margin: '16px 0', padding: '12px', border: '2px solid #0ea5e9', borderRadius: 8, background: '#0c2e42' }}>
          <strong style={{ color: '#0ea5e9' }}>✓ Crew dipilih:</strong> {crew.find(c => c.id === selectedCrew)?.fullName || 'Unknown'}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Rank yang dilamar
          <input value={appliedRank} onChange={(e) => setAppliedRank(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Catatan
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} placeholder="Contoh: Replacement untuk John Doe (MT Tanker Alpha)" />
        </label>

        <button type="submit" disabled={saving} style={{ padding: '0.5rem 0.9rem' }}>
          {saving ? 'Menyimpan…' : 'Buat aplikasi'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
    </>
  )
}
