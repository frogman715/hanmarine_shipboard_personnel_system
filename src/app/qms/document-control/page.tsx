'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './document-control.css'

interface Document {
  id: number
  docNumber: string
  title: string
  version: string
  status: 'DRAFT' | 'APPROVED' | 'OBSOLETE'
  approvedBy: string
  approvedDate: string
  department: string
  category: string
}

export default function DocumentControlPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')

  useEffect(() => {
    // Mock data - replace with actual API call
    setDocuments([
      {
        id: 1,
        docNumber: 'HGQS-PM-01',
        title: 'Control of Contract Review',
        version: 'Rev 00',
        status: 'APPROVED',
        approvedBy: 'QMR',
        approvedDate: '2023-07-03',
        department: 'Quality',
        category: 'Procedure'
      },
      {
        id: 2,
        docNumber: 'HGQS-MM-01',
        title: 'Main Manual',
        version: 'Rev 01',
        status: 'APPROVED',
        approvedBy: 'Director',
        approvedDate: '2024-01-15',
        department: 'Quality',
        category: 'Manual'
      }
    ])
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus
    const matchesCategory = filterCategory === 'ALL' || doc.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    draft: documents.filter(d => d.status === 'DRAFT').length,
    obsolete: documents.filter(d => d.status === 'OBSOLETE').length
  }

  return (
    <div className="document-control-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quality Management', href: '/qms' },
        { label: 'Document Control' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">📁</span>
            Document Control System
          </h1>
          <p className="page-subtitle">Control of Documented Information - ISO 9001:2015 Section 7.5</p>
        </div>
        <div className="compliance-badges">
          <span className="badge iso-badge">ISO 7.5</span>
          <span className="badge hgqs-badge">HGQS PM-5</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-label">Total Documents</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Approved</div>
          <div className="stat-value status-approved">{stats.approved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-label">Draft</div>
          <div className="stat-value status-draft">{stats.draft}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗑️</div>
          <div className="stat-label">Obsolete</div>
          <div className="stat-value status-obsolete">{stats.obsolete}</div>
        </div>
      </div>

      {/* ISO Requirements */}
      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">ℹ️</span>
          ISO 9001:2015 Requirements - Section 7.5
        </h2>
        <div className="requirements-grid">
          <div className="requirement-card">
            <h3>7.5.1 General</h3>
            <p>Organization's QMS must include documented information required by ISO 9001 and determined necessary for effectiveness.</p>
          </div>
          <div className="requirement-card">
            <h3>7.5.2 Creating & Updating</h3>
            <p>Identification, format, review, approval, and version control of documented information.</p>
          </div>
          <div className="requirement-card">
            <h3>7.5.3 Control</h3>
            <p>Ensure availability, protection, distribution, storage, preservation, and disposal control.</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search documents by title or number..."
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
          <option value="APPROVED">Approved</option>
          <option value="DRAFT">Draft</option>
          <option value="OBSOLETE">Obsolete</option>
        </select>
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="ALL">All Categories</option>
          <option value="Manual">Manual</option>
          <option value="Procedure">Procedure</option>
          <option value="Form">Form</option>
          <option value="Record">Record</option>
        </select>
        <Link href="/documents/new" className="btn-primary">
          <span>➕</span>
          <span>New Document</span>
        </Link>
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <table className="documents-table">
          <thead>
            <tr>
              <th>Doc Number</th>
              <th>Title</th>
              <th>Version</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="doc-number">{doc.docNumber}</td>
                  <td className="doc-title">{doc.title}</td>
                  <td>{doc.version}</td>
                  <td>
                    <span className={`status-badge status-${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>{doc.approvedBy}</td>
                  <td>{new Date(doc.approvedDate).toLocaleDateString()}</td>
                  <td>{doc.category}</td>
                  <td className="actions-cell">
                    <button className="btn-action btn-view" title="View Document">
                      👁️
                    </button>
                    <button className="btn-action btn-edit" title="Edit Document">
                      ✏️
                    </button>
                    <button className="btn-action btn-history" title="Version History">
                      📜
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-results">
                  No documents found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Document Workflow */}
      <div className="workflow-section">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          Document Approval Workflow
        </h2>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Draft Creation</h3>
              <p>Document created by responsible person</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>QMR Review</h3>
              <p>Quality Management Representative reviews</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Director Approval</h3>
              <p>Final approval by company director</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Distribution</h3>
              <p>Controlled distribution to relevant parties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
