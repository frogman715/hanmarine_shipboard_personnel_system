'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './nonconforming.css'

interface NonConformity {
  id: number
  ncNumber: string
  title: string
  description: string
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR'
  status: 'OPEN' | 'UNDER_REVIEW' | 'CORRECTED' | 'CLOSED'
  reportedBy: string
  reportedDate: string
  disposition: string
}

export default function NonConformingPage() {
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    setNonConformities([
      {
        id: 1,
        ncNumber: 'NC-2024-001',
        title: 'Certificate Expired',
        description: 'Seafarer certificate found expired during documentation check',
        severity: 'MAJOR',
        status: 'UNDER_REVIEW',
        reportedBy: 'QA Inspector',
        reportedDate: '2024-01-15',
        disposition: 'Under investigation'
      }
    ])
  }, [])

  const filteredNCs = nonConformities.filter(nc => {
    const matchesSearch = nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nc.ncNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || nc.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: nonConformities.length,
    open: nonConformities.filter(nc => nc.status === 'OPEN').length,
    underReview: nonConformities.filter(nc => nc.status === 'UNDER_REVIEW').length,
    closed: nonConformities.filter(nc => nc.status === 'CLOSED').length
  }

  return (
    <div className="nonconforming-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quality Management', href: '/qms' },
        { label: 'Non-Conforming Services' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">⚠️</span>
            Control of Nonconforming Outputs
          </h1>
          <p className="page-subtitle">Non-conformity Management - ISO 9001:2015 Section 8.7</p>
        </div>
        <div className="compliance-badges">
          <span className="badge iso-badge">ISO 8.7</span>
          <span className="badge hgqs-badge">HGQS PM-12</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Total NCs</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-label">Open</div>
          <div className="stat-value status-open">{stats.open}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟡</div>
          <div className="stat-label">Under Review</div>
          <div className="stat-value status-review">{stats.underReview}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Closed</div>
          <div className="stat-value status-closed">{stats.closed}</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Disposition Actions (ISO 8.7.1)
        </h2>
        <div className="disposition-grid">
          <div className="disposition-card">
            <div className="disposition-icon">✅</div>
            <h3>Correction</h3>
            <p>Immediate action to eliminate detected non-conformity</p>
          </div>
          <div className="disposition-card">
            <div className="disposition-icon">✔️</div>
            <h3>Use As-Is</h3>
            <p>Authorization to use under concession with customer agreement</p>
          </div>
          <div className="disposition-card">
            <div className="disposition-icon">🔄</div>
            <h3>Rework</h3>
            <p>Take action to make conforming to requirements</p>
          </div>
          <div className="disposition-card">
            <div className="disposition-icon">🗑️</div>
            <h3>Scrap/Reject</h3>
            <p>Prevent original intended use or application</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search non-conformities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="CORRECTED">Corrected</option>
          <option value="CLOSED">Closed</option>
        </select>
        <Link href="/qms/nonconforming/new" className="btn-primary">
          <span>➕</span>
          <span>Report NC</span>
        </Link>
      </div>

      <div className="table-container">
        <table className="nc-table">
          <thead>
            <tr>
              <th>NC Number</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Disposition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNCs.length > 0 ? (
              filteredNCs.map((nc) => (
                <tr key={nc.id}>
                  <td className="nc-number">{nc.ncNumber}</td>
                  <td className="nc-title">{nc.title}</td>
                  <td>
                    <span className={`severity-badge severity-${nc.severity.toLowerCase()}`}>
                      {nc.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${nc.status.toLowerCase().replace('_', '-')}`}>
                      {nc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{nc.reportedBy}</td>
                  <td>{new Date(nc.reportedDate).toLocaleDateString()}</td>
                  <td>{nc.disposition}</td>
                  <td className="actions-cell">
                    <button className="btn-action" title="View Details">👁️</button>
                    <button className="btn-action" title="Take Action">🔧</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-results">No non-conformities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
