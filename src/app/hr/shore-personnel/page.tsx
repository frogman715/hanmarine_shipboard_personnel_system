'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './shore-personnel.css'

interface Applicant {
  id: number
  name: string
  position: string
  department: string
  status: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED'
  appliedDate: string
  email: string
  phone: string
}

export default function ShorePersonnelPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    setApplicants([
      {
        id: 1,
        name: 'Sarah Johnson',
        position: 'HR Assistant',
        department: 'Human Resources',
        status: 'INTERVIEW',
        appliedDate: '2024-01-10',
        email: 'sarah.j@email.com',
        phone: '+62-812-3456-7890'
      },
      {
        id: 2,
        name: 'Michael Chen',
        position: 'QA Inspector',
        department: 'Quality Assurance',
        status: 'SCREENING',
        appliedDate: '2024-01-15',
        email: 'michael.c@email.com',
        phone: '+62-813-9876-5432'
      }
    ])
  }, [])

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: applicants.length,
    screening: applicants.filter(a => a.status === 'SCREENING').length,
    interview: applicants.filter(a => a.status === 'INTERVIEW').length,
    offered: applicants.filter(a => a.status === 'OFFERED').length
  }

  return (
    <div className="shore-personnel-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'HR & Administration', href: '/hr' },
        { label: 'Shore Personnel Hiring' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">👔</span>
            Shore Personnel Hiring Process
          </h1>
          <p className="page-subtitle">Recruitment & Selection - HGQS Procedure 3</p>
        </div>
        <div className="compliance-badges">
          <span className="badge hgqs-badge">HGQS P-3</span>
          <span className="badge iso-badge">ISO 7.1.2</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-label">Total Applicants</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-label">Screening</div>
          <div className="stat-value status-screening">{stats.screening}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-label">Interview</div>
          <div className="stat-value status-interview">{stats.interview}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-label">Offered</div>
          <div className="stat-value status-offered">{stats.offered}</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          Hiring Process Flow
        </h2>
        <div className="process-flow">
          <div className="flow-step">
            <div className="step-number">1</div>
            <h3>Job Requisition</h3>
            <p>Department submits hiring request with job description</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">2</div>
            <h3>Advertisement</h3>
            <p>Post vacancy on job portals and company website</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">3</div>
            <h3>Screening</h3>
            <p>HR reviews applications and shortlists candidates</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">4</div>
            <h3>Interview</h3>
            <p>Department head conducts technical interview</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">5</div>
            <h3>Offer</h3>
            <p>HR prepares employment offer letter</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">6</div>
            <h3>Onboarding</h3>
            <p>New employee orientation and training</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search applicants..."
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
          <option value="APPLIED">Applied</option>
          <option value="SCREENING">Screening</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFERED">Offered</option>
          <option value="HIRED">Hired</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <Link href="/hr/shore-personnel/new" className="btn-primary">
          <span>➕</span>
          <span>Add Applicant</span>
        </Link>
      </div>

      <div className="table-container">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td className="applicant-name">{applicant.name}</td>
                  <td>{applicant.position}</td>
                  <td>{applicant.department}</td>
                  <td>
                    <span className={`status-badge status-${applicant.status.toLowerCase()}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td>{new Date(applicant.appliedDate).toLocaleDateString()}</td>
                  <td>
                    <div className="contact-info">
                      <div>{applicant.email}</div>
                      <div className="phone">{applicant.phone}</div>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-action" title="View Application">👁️</button>
                    <button className="btn-action" title="Schedule Interview">📅</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-results">No applicants found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="open-positions">
        <h2 className="section-title">
          <span className="section-icon">📢</span>
          Open Positions
        </h2>
        <div className="positions-grid">
          <div className="position-card">
            <h3>Crewing Officer</h3>
            <p className="department">Crewing Operations</p>
            <p className="description">Managing seafarer applications and placements</p>
            <div className="position-meta">
              <span>Full-time</span>
              <span>2-3 years exp</span>
            </div>
          </div>
          <div className="position-card">
            <h3>Quality Auditor</h3>
            <p className="department">Quality Management</p>
            <p className="description">Conducting internal audits and compliance checks</p>
            <div className="position-meta">
              <span>Full-time</span>
              <span>ISO 9001 certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
