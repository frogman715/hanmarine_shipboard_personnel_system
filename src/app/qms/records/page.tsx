'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './records.css'

interface Record {
  id: number
  recordNumber: string
  title: string
  category: string
  retentionPeriod: string
  location: string
  lastAccessed: string
  status: 'ACTIVE' | 'ARCHIVED' | 'DUE_FOR_DISPOSAL'
}

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    setRecords([
      {
        id: 1,
        recordNumber: 'REC-QMS-2024-001',
        title: 'Internal Audit Records Q1 2024',
        category: 'Quality Audits',
        retentionPeriod: '7 years',
        location: 'Digital Archive/Audits',
        lastAccessed: '2024-01-15',
        status: 'ACTIVE'
      },
      {
        id: 2,
        recordNumber: 'REC-HR-2023-045',
        title: 'Employee Training Records 2023',
        category: 'Training',
        retentionPeriod: '10 years',
        location: 'HR Department/Training',
        lastAccessed: '2023-12-20',
        status: 'ARCHIVED'
      }
    ])
  }, [])

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || rec.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: records.length,
    active: records.filter(r => r.status === 'ACTIVE').length,
    archived: records.filter(r => r.status === 'ARCHIVED').length,
    dueDisposal: records.filter(r => r.status === 'DUE_FOR_DISPOSAL').length
  }

  return (
    <div className="records-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quality Management', href: '/qms' },
        { label: 'Records Control' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">📋</span>
            Records Control System
          </h1>
          <p className="page-subtitle">Control of Records - ISO 9001:2015 Section 7.5.3</p>
        </div>
        <div className="compliance-badges">
          <span className="badge iso-badge">ISO 7.5.3</span>
          <span className="badge hgqs-badge">HGQS PM-6</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-label">Active</div>
          <div className="stat-value status-active">{stats.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Archived</div>
          <div className="stat-value status-archived">{stats.archived}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Due for Disposal</div>
          <div className="stat-value status-disposal">{stats.dueDisposal}</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">📚</span>
          Record Retention Schedule
        </h2>
        <div className="retention-grid">
          <div className="retention-card">
            <h3>Quality Records</h3>
            <p><strong>Retention:</strong> 7 years</p>
            <p>Internal audits, management reviews, CPAR, customer feedback</p>
          </div>
          <div className="retention-card">
            <h3>Training Records</h3>
            <p><strong>Retention:</strong> 10 years</p>
            <p>Seafarer training, certifications, competency assessments</p>
          </div>
          <div className="retention-card">
            <h3>Employment Records</h3>
            <p><strong>Retention:</strong> Permanent</p>
            <p>Contracts, personal files, medical records, disciplinary actions</p>
          </div>
          <div className="retention-card">
            <h3>Financial Records</h3>
            <p><strong>Retention:</strong> 7 years</p>
            <p>Invoices, receipts, wage statements, tax documents</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search records..."
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
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
          <option value="DUE_FOR_DISPOSAL">Due for Disposal</option>
        </select>
        <Link href="/qms/records/new" className="btn-primary">
          <span>➕</span>
          <span>Register Record</span>
        </Link>
      </div>

      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Record Number</th>
              <th>Title</th>
              <th>Category</th>
              <th>Retention Period</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Accessed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="record-number">{record.recordNumber}</td>
                  <td className="record-title">{record.title}</td>
                  <td>{record.category}</td>
                  <td>{record.retentionPeriod}</td>
                  <td>{record.location}</td>
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase().replace('_', '-')}`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(record.lastAccessed).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="btn-action" title="View Record">👁️</button>
                    <button className="btn-action" title="Archive">📦</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-results">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
