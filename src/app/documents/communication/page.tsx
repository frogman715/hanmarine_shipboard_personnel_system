'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './communication.css'

interface Communication {
  id: number
  type: 'MEETING' | 'CIRCULAR' | 'NOTICE' | 'MEMO' | 'ANNOUNCEMENT'
  title: string
  subject: string
  audience: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  publishedDate: string
  publishedBy: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export default function CommunicationPage() {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    setCommunications([
      {
        id: 1,
        type: 'MEETING',
        title: 'Management Review Meeting Q1 2024',
        subject: 'Quarterly QMS performance review',
        audience: 'Management Team',
        priority: 'HIGH',
        publishedDate: '2024-01-15',
        publishedBy: 'QMR',
        status: 'PUBLISHED'
      },
      {
        id: 2,
        type: 'CIRCULAR',
        title: 'Updated Leave Policy',
        subject: 'Changes to annual leave entitlement',
        audience: 'All Employees',
        priority: 'MEDIUM',
        publishedDate: '2024-01-10',
        publishedBy: 'HR Manager',
        status: 'PUBLISHED'
      }
    ])
  }, [])

  const filteredComms = communications.filter(comm => {
    const matchesSearch = comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || comm.type === filterType
    const matchesStatus = filterStatus === 'ALL' || comm.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: communications.length,
    meetings: communications.filter(c => c.type === 'MEETING').length,
    circulars: communications.filter(c => c.type === 'CIRCULAR').length,
    notices: communications.filter(c => c.type === 'NOTICE').length
  }

  return (
    <div className="communication-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Document Control', href: '/documents' },
        { label: 'Communication Management' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">📢</span>
            Communication Management
          </h1>
          <p className="page-subtitle">Internal & External Communication - HGQS Annex C</p>
        </div>
        <div className="compliance-badges">
          <span className="badge hgqs-badge">HGQS Annex C</span>
          <span className="badge iso-badge">ISO 7.4</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Total Communications</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-label">Meetings</div>
          <div className="stat-value status-meetings">{stats.meetings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-label">Circulars</div>
          <div className="stat-value status-circulars">{stats.circulars}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📌</div>
          <div className="stat-label">Notices</div>
          <div className="stat-value status-notices">{stats.notices}</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Communication Channels (ISO 7.4)
        </h2>
        <div className="channels-grid">
          <div className="channel-card">
            <div className="channel-icon">🤝</div>
            <h3>Internal Communication</h3>
            <ul>
              <li>Management Review Meetings</li>
              <li>Department Briefings</li>
              <li>Team Meetings</li>
              <li>Email Circulars</li>
              <li>Notice Board</li>
            </ul>
          </div>
          <div className="channel-card">
            <div className="channel-icon">🌐</div>
            <h3>External Communication</h3>
            <ul>
              <li>Client Correspondence</li>
              <li>Supplier Communication</li>
              <li>Regulatory Submissions</li>
              <li>Customer Feedback</li>
              <li>Public Announcements</li>
            </ul>
          </div>
          <div className="channel-card">
            <div className="channel-icon">⚓</div>
            <h3>Ship-Shore Communication</h3>
            <ul>
              <li>Vessel Reports</li>
              <li>Crew Welfare Checks</li>
              <li>Operational Updates</li>
              <li>Emergency Notifications</li>
              <li>Performance Monitoring</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search communications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="ALL">All Types</option>
          <option value="MEETING">Meetings</option>
          <option value="CIRCULAR">Circulars</option>
          <option value="NOTICE">Notices</option>
          <option value="MEMO">Memos</option>
          <option value="ANNOUNCEMENT">Announcements</option>
        </select>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <Link href="/documents/communication/new" className="btn-primary">
          <span>➕</span>
          <span>New Communication</span>
        </Link>
      </div>

      <div className="table-container">
        <table className="communications-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Subject</th>
              <th>Audience</th>
              <th>Priority</th>
              <th>Published Date</th>
              <th>Published By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComms.length > 0 ? (
              filteredComms.map((comm) => (
                <tr key={comm.id}>
                  <td>
                    <span className={`type-badge type-${comm.type.toLowerCase()}`}>
                      {comm.type}
                    </span>
                  </td>
                  <td className="comm-title">{comm.title}</td>
                  <td>{comm.subject}</td>
                  <td>{comm.audience}</td>
                  <td>
                    <span className={`priority-badge priority-${comm.priority.toLowerCase()}`}>
                      {comm.priority}
                    </span>
                  </td>
                  <td>{new Date(comm.publishedDate).toLocaleDateString()}</td>
                  <td>{comm.publishedBy}</td>
                  <td>
                    <span className={`status-badge status-${comm.status.toLowerCase()}`}>
                      {comm.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-action" title="View Details">👁️</button>
                    <button className="btn-action" title="Edit">✏️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="no-results">No communications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
