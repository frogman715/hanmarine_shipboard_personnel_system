'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import MainNavigation from '@/components/MainNavigation'

type Certificate = {
  id: number
  crewId: number
  type: string
  certificateNumber: string | null
  issueDate: string | null
  expiryDate: string | null
  issuingAuthority: string | null
  documentPath: string | null
  crew: {
    id: number
    fullName: string
    crewCode: string | null
    rank: string | null
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VALID' | 'EXPIRING' | 'EXPIRED'>('ALL')

  useEffect(() => {
    loadCertificates()
  }, [])

  async function loadCertificates() {
    try {
      const res = await fetch('/api/certificates')
      if (res.ok) {
        const data = await res.json()
        setCertificates(data)
      }
    } catch (error) {
      console.error('Error loading certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatus(expiryDate: string | null): 'VALID' | 'EXPIRING' | 'EXPIRED' | 'NO_DATE' {
    if (!expiryDate) return 'NO_DATE'
    
    const exp = new Date(expiryDate).getTime()
    const now = new Date().getTime()
    const daysUntilExpiry = (exp - now) / (1000 * 60 * 60 * 24)

    if (daysUntilExpiry < 0) return 'EXPIRED'
    if (daysUntilExpiry < 90) return 'EXPIRING'
    return 'VALID'
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'EXPIRED': return '#dc2626'
      case 'EXPIRING': return '#f97316'
      case 'VALID': return '#10b981'
      default: return '#6b7280'
    }
  }

  // Filter certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = searchTerm === '' ||
      cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.crew.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'ALL') return matchesSearch

    const status = getStatus(cert.expiryDate)
    return matchesSearch && status === statusFilter
  })

  // Group statistics
  const stats = {
    total: certificates.length,
    valid: certificates.filter(c => getStatus(c.expiryDate) === 'VALID').length,
    expiring: certificates.filter(c => getStatus(c.expiryDate) === 'EXPIRING').length,
    expired: certificates.filter(c => getStatus(c.expiryDate) === 'EXPIRED').length,
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <main className="main-content">
          <div>Loading certificates...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <MainNavigation />
      <main className="main-content">
        <div className="header">
          <div className="header-top">
            <h1>📜 Certificate Management</h1>
          </div>
          <p className="subtitle">Manage all crew certificates and documents</p>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by name, type, or certificate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter by certificate status"
          >
            <option value="ALL">All Status</option>
            <option value="VALID">✅ Valid</option>
            <option value="EXPIRING">⚠️ Expiring Soon</option>
            <option value="EXPIRED">❌ Expired</option>
          </select>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Certificates</div>
          </div>
          <div className="stat-card stat-valid">
            <div className="stat-value">{stats.valid}</div>
            <div className="stat-label">Valid</div>
          </div>
          <div className="stat-card stat-expiring">
            <div className="stat-value">{stats.expiring}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
          <div className="stat-card stat-expired">
            <div className="stat-value">{stats.expired}</div>
            <div className="stat-label">Expired</div>
          </div>
        </div>

        {/* Certificate Table */}
        {filteredCertificates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No certificates found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="cert-table-container">
            <table className="cert-table-full">
              <thead>
                <tr>
                  <th>Crew</th>
                  <th>Certificate Type</th>
                  <th>Cert. Number</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => {
                  const status = getStatus(cert.expiryDate)
                  const statusColor = getStatusColor(status)
                  const daysUntilExpiry = cert.expiryDate 
                    ? Math.floor((new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : null

                  return (
                    <tr key={cert.id}>
                      <td>
                        <Link href={`/crew/${cert.crew.id}`} className="crew-link">
                          {cert.crew.fullName}
                        </Link>
                        <div className="crew-meta">
                          {cert.crew.crewCode && <span>{cert.crew.crewCode}</span>}
                          {cert.crew.rank && <span> • {cert.crew.rank}</span>}
                        </div>
                      </td>
                      <td className="cert-type">{cert.type}</td>
                      <td className="cert-number">
                        {cert.certificateNumber || '-'}
                      </td>
                      <td className="date-cell">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="date-cell">
                        {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString('id-ID') : '-'}
                        {daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry < 90 && (
                          <div className="days-warning">
                            {daysUntilExpiry} days left
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge-small status-${status.toLowerCase()}`}>
                          {status === 'EXPIRED' && '❌ Expired'}
                          {status === 'EXPIRING' && '⚠️ Expiring'}
                          {status === 'VALID' && '✅ Valid'}
                          {status === 'NO_DATE' && '⚠️ No Date'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          {cert.documentPath && (
                            <a href={cert.documentPath} download className="btn-table">
                              📥
                            </a>
                          )}
                          <Link href={`/crew/${cert.crew.id}/certificates`} className="btn-table">
                            ✏️
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          display: flex;
        }
        
        .main-content {
          margin-left: 220px;
          flex: 1;
          padding: 2rem;
          background: linear-gradient(to bottom right, #0f172a, #1e293b);
          min-height: 100vh;
          color: white;
        }
        
        .header {
          margin-bottom: 2rem;
        }
        
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }
        
        .subtitle {
          color: #9ca3af;
          margin: 0;
        }
        
        .filter-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .search-input, .status-select {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(30, 41, 59, 0.5);
          color: white;
          font-size: 1rem;
        }
        
        .search-input {
          flex: 1;
        }
        
        .status-select {
          min-width: 200px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          padding: 1.5rem;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        
        .stat-card.stat-valid {
          background: #064e3b;
        }
        .stat-card.stat-valid .stat-value {
          color: #6ee7b7;
        }
        .stat-card.stat-valid .stat-label {
          color: #a7f3d0;
        }
        
        .stat-card.stat-expiring {
          background: #7c2d12;
        }
        .stat-card.stat-expiring .stat-value {
          color: #fdba74;
        }
        .stat-card.stat-expiring .stat-label {
          color: #fed7aa;
        }
        
        .stat-card.stat-expired {
          background: #7f1d1d;
        }
        .stat-card.stat-expired .stat-value {
          color: #fca5a5;
        }
        .stat-card.stat-expired .stat-label {
          color: #fecaca;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #9ca3af;
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .crew-link {
          color: #0ea5e9;
          text-decoration: none;
          font-weight: 500;
        }
        .crew-link:hover {
          text-decoration: underline;
        }
        
        .crew-meta {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }
        
        .cert-type {
          font-weight: 500;
        }
        
        .cert-number {
          font-family: monospace;
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        .date-cell {
          font-size: 0.875rem;
        }
        
        .days-warning {
          font-size: 0.7rem;
          color: #f97316;
          margin-top: 0.25rem;
        }
        
        .status-badge-small {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-badge-small.status-valid {
          background: #065f46;
          color: #6ee7b7;
        }
        
        .status-badge-small.status-expiring {
          background: #92400e;
          color: #fdba74;
        }
        
        .status-badge-small.status-expired {
          background: #991b1b;
          color: #fca5a5;
        }
        
        .status-badge-small.status-no_date {
          background: #854d0e;
          color: #fde047;
        }
        
        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }
        
        .cert-table-container {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cert-table-full {
          width: 100%;
          border-collapse: collapse;
        }
        
        .cert-table-full th {
          background: rgba(15, 23, 42, 0.8);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #cbd5e1;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .cert-table-full td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .cert-table-full tr:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        
        .btn-table {
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          text-decoration: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          display: inline-block;
        }
        
        .btn-table:hover {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  )
}
