'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './signed-off.css'

interface SignedOffSeafarer {
  id: number
  name: string
  rank: string
  vessel: string
  signOffDate: string
  signOffPort: string
  reason: 'CONTRACT_END' | 'MEDICAL' | 'COMPASSIONATE' | 'TERMINATION' | 'OTHER'
  status: 'TRAVEL_ARRANGED' | 'IN_TRANSIT' | 'REPATRIATED' | 'FINAL_PAY_PENDING' | 'COMPLETED'
  finalPayStatus: 'PENDING' | 'PROCESSED' | 'PAID'
  documentsReturned: boolean
}

export default function SignedOffSeafarerPage() {
  const [seafarers, setSeafarers] = useState<SignedOffSeafarer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterReason, setFilterReason] = useState('ALL')

  useEffect(() => {
    setSeafarers([
      {
        id: 1,
        name: 'John Anderson',
        rank: 'Chief Engineer',
        vessel: 'MV Nordic Star',
        signOffDate: '2024-01-10',
        signOffPort: 'Singapore',
        reason: 'CONTRACT_END',
        status: 'COMPLETED',
        finalPayStatus: 'PAID',
        documentsReturned: true
      },
      {
        id: 2,
        name: 'Maria Santos',
        rank: '2nd Officer',
        vessel: 'MV Baltic Wave',
        signOffDate: '2024-01-15',
        signOffPort: 'Manila',
        reason: 'MEDICAL',
        status: 'FINAL_PAY_PENDING',
        finalPayStatus: 'PROCESSED',
        documentsReturned: false
      }
    ])
  }, [])

  const filteredSeafarers = seafarers.filter(seafarer => {
    const matchesSearch = seafarer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seafarer.vessel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || seafarer.status === filterStatus
    const matchesReason = filterReason === 'ALL' || seafarer.reason === filterReason
    return matchesSearch && matchesStatus && matchesReason
  })

  const stats = {
    total: seafarers.length,
    travelArranged: seafarers.filter(s => s.status === 'TRAVEL_ARRANGED').length,
    inTransit: seafarers.filter(s => s.status === 'IN_TRANSIT').length,
    completed: seafarers.filter(s => s.status === 'COMPLETED').length
  }

  return (
    <div className="signed-off-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Seafarers', href: '/seafarers' },
        { label: 'Signed-Off Seafarers' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🚢</span>
            Signed-Off Seafarer Management
          </h1>
          <p className="page-subtitle">Sign-Off & Repatriation Process - HGQS Annex D (MLC 2006)</p>
        </div>
        <div className="compliance-badges">
          <span className="badge hgqs-badge">HGQS Annex D</span>
          <span className="badge mlc-badge">MLC 2006</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Sign-Offs</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✈️</div>
          <div className="stat-label">Travel Arranged</div>
          <div className="stat-value status-travel">{stats.travelArranged}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌏</div>
          <div className="stat-label">In Transit</div>
          <div className="stat-value status-transit">{stats.inTransit}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value status-completed">{stats.completed}</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Sign-Off Process Flow (MLC 2006 Standard A2.5)
        </h2>
        <div className="process-flow">
          <div className="flow-step">
            <div className="step-number">1</div>
            <h3>Sign-Off Notification</h3>
            <p>Vessel notifies office of seafarer sign-off details</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">2</div>
            <h3>Travel Arrangement</h3>
            <p>Book flights, hotels, and ground transportation</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">3</div>
            <h3>Documentation</h3>
            <p>Collect CDC, certificates, medical records</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">4</div>
            <h3>Final Pay</h3>
            <p>Calculate wages, overtime, leave pay</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">5</div>
            <h3>Repatriation</h3>
            <p>Ensure safe return to home port</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">6</div>
            <h3>Post Sign-Off</h3>
            <p>Debriefing, feedback, re-employment assessment</p>
          </div>
        </div>
      </div>

      <div className="mlc-requirements">
        <h2 className="section-title">
          <span className="section-icon">⚓</span>
          MLC 2006 Repatriation Requirements
        </h2>
        <div className="requirements-grid">
          <div className="requirement-card">
            <h3>Standard A2.5.1 (a)</h3>
            <p>Seafarers entitled to repatriation at no cost in specified circumstances</p>
          </div>
          <div className="requirement-card">
            <h3>Standard A2.5.1 (b)</h3>
            <p>Repatriation includes transportation, accommodation, meals</p>
          </div>
          <div className="requirement-card">
            <h3>Standard A2.5.2</h3>
            <p>Financial security for repatriation required</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search seafarers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
          aria-label="Filter by reason"
        >
          <option value="ALL">All Reasons</option>
          <option value="CONTRACT_END">Contract End</option>
          <option value="MEDICAL">Medical</option>
          <option value="COMPASSIONATE">Compassionate</option>
          <option value="TERMINATION">Termination</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Status</option>
          <option value="TRAVEL_ARRANGED">Travel Arranged</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="REPATRIATED">Repatriated</option>
          <option value="FINAL_PAY_PENDING">Final Pay Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <Link href="/seafarers/signed-off/new" className="btn-primary">
          <span>➕</span>
          <span>Register Sign-Off</span>
        </Link>
      </div>

      <div className="table-container">
        <table className="seafarers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Vessel</th>
              <th>Sign-Off Date</th>
              <th>Port</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Final Pay</th>
              <th>Docs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSeafarers.length > 0 ? (
              filteredSeafarers.map((seafarer) => (
                <tr key={seafarer.id}>
                  <td className="seafarer-name">{seafarer.name}</td>
                  <td>{seafarer.rank}</td>
                  <td>{seafarer.vessel}</td>
                  <td>{new Date(seafarer.signOffDate).toLocaleDateString()}</td>
                  <td>{seafarer.signOffPort}</td>
                  <td>
                    <span className={`reason-badge reason-${seafarer.reason.toLowerCase().replace('_', '-')}`}>
                      {seafarer.reason.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${seafarer.status.toLowerCase().replace('_', '-')}`}>
                      {seafarer.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`pay-badge pay-${seafarer.finalPayStatus.toLowerCase()}`}>
                      {seafarer.finalPayStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`docs-badge ${seafarer.documentsReturned ? 'docs-returned' : 'docs-pending'}`}>
                      {seafarer.documentsReturned ? '✓ Yes' : '⏳ No'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-action" title="View Details">👁️</button>
                    <button className="btn-action" title="Update Status">🔄</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="no-results">No signed-off seafarers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
