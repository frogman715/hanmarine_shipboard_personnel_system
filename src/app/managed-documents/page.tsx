'use client';

import { useState, useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import './managed-documents.css';

interface ManagedDocument {
  id: number;
  documentCode: string;
  documentTitle: string;
  documentType: string;
  category: string;
  currentRevision: number;
  revisionDate: string;
  effectiveDate: string | null;
  status: string;
  preparedBy: string | null;
  reviewedBy: string | null;
  approvedBy: string | null;
  _count: {
    revisions: number;
    approvals: number;
    distributions: number;
  };
}

export default function ManagedDocumentsPage() {
  const [documents, setDocuments] = useState<ManagedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    documentCode: '',
    documentTitle: '',
    documentType: 'FORM',
    category: 'Crewing',
    description: '',
    preparedBy: '',
    retentionPeriod: 5,
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [statusFilter, categoryFilter, searchQuery]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/documents?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!createData.documentCode || !createData.documentTitle || !createData.preparedBy) {
      alert('Please fill in required fields: Code, Title, and Prepared By');
      return;
    }

    try {
      setUploading(true);

      // First upload file if exists
      let filePath = null;
      if (createData.file) {
        const formData = new FormData();
        formData.append('file', createData.file);
        formData.append('documentCode', createData.documentCode);

        const uploadResponse = await fetch('/api/documents/upload-file', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          filePath = uploadData.filePath;
        } else {
          throw new Error('File upload failed');
        }
      }

      // Then create document
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createData,
          file: undefined,
          filePath,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Document created successfully!');
        setShowCreateModal(false);
        setCreateData({
          documentCode: '',
          documentTitle: '',
          documentType: 'FORM',
          category: 'Crewing',
          description: '',
          preparedBy: '',
          retentionPeriod: 5,
          file: null,
        });
        loadDocuments();
      }
    } catch (error) {
      console.error('Error creating document:', error);
      alert('❌ Failed to create document');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCreateData({ ...createData, file: e.target.files[0] });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      DRAFT: { text: 'Draft', className: 'status-draft' },
      REVIEW: { text: 'In Review', className: 'status-review' },
      PENDING_APPROVAL: { text: 'Pending Approval', className: 'status-pending' },
      APPROVED: { text: 'Approved', className: 'status-approved' },
      OBSOLETE: { text: 'Obsolete', className: 'status-obsolete' },
      ARCHIVED: { text: 'Archived', className: 'status-archived' },
    };
    return badges[status] || { text: status, className: 'status-default' };
  };

  const stats = {
    total: documents.length,
    draft: documents.filter(d => d.status === 'DRAFT').length,
    pending: documents.filter(d => d.status === 'PENDING_APPROVAL' || d.status === 'REVIEW').length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
  };

  return (
    <div className="managed-docs-container">
      <MainNavigation />
      
      <div className="managed-docs-content">
        <div className="managed-docs-header">
          <div className="header-text">
            <h1 className="managed-docs-title">Document Management System</h1>
            <p className="managed-docs-subtitle">
              ISO 9001:2015 Section 7.5 - Control of Documented Information
            </p>
          </div>
          <button className="create-button" onClick={() => setShowCreateModal(true)}>
            + New Document
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Documents</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✏️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.draft}</div>
              <div className="stat-label">Draft</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
        </div>

        <div className="controls-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="filters">
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">In Review</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="OBSOLETE">Obsolete</option>
            </select>

            <select 
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Crewing">Crewing</option>
              <option value="Admin">Admin</option>
              <option value="Accounting">Accounting</option>
              <option value="Operations">Operations</option>
              <option value="Quality">Quality</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">⏳ Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📋</div>
            <div className="no-results-title">No documents found</div>
            <div className="no-results-text">
              Create your first document or adjust filters
            </div>
          </div>
        ) : (
          <div className="managed-docs-table">
            <table>
              <thead>
                <tr>
                  <th>Document Code</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Revision</th>
                  <th>Status</th>
                  <th>Prepared By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="doc-code">{doc.documentCode}</td>
                    <td className="doc-title">{doc.documentTitle}</td>
                    <td>{doc.documentType}</td>
                    <td>{doc.category}</td>
                    <td className="revision-cell">
                      Rev {doc.currentRevision}
                      {doc._count.revisions > 1 && (
                        <span className="revision-count">
                          ({doc._count.revisions} total)
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(doc.status).className}`}>
                        {getStatusBadge(doc.status).text}
                      </span>
                    </td>
                    <td>{doc.preparedBy || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => window.location.href = `/managed-documents/${doc.id}`}
                        >
                          View
                        </button>
                        {doc.status === 'DRAFT' && (
                          <button className="action-btn edit-btn">
                            Edit
                          </button>
                        )}
                        {(doc.status === 'REVIEW' || doc.status === 'PENDING_APPROVAL') && (
                          <button className="action-btn approve-btn">
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="workflow-info">
          <h3>Approval Workflow</h3>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-info">
                <strong>Draft</strong>
                <p>Document prepared by staff/QMR</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-info">
                <strong>Review</strong>
                <p>QMR reviews and verifies</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-info">
                <strong>Approval</strong>
                <p>Director approves</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-info">
                <strong>Effective</strong>
                <p>Document becomes active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content create-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Document</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Document Code: *</label>
                <input
                  type="text"
                  value={createData.documentCode}
                  onChange={(e) => setCreateData({...createData, documentCode: e.target.value})}
                  className="form-input"
                  placeholder="e.g., HGF-CR-01"
                />
              </div>

              <div className="form-group">
                <label>Document Title: *</label>
                <input
                  type="text"
                  value={createData.documentTitle}
                  onChange={(e) => setCreateData({...createData, documentTitle: e.target.value})}
                  className="form-input"
                  placeholder="Enter document title"
                />
              </div>

              <div className="form-group">
                <label>Document Type:</label>
                <select
                  value={createData.documentType}
                  onChange={(e) => setCreateData({...createData, documentType: e.target.value})}
                  className="form-select"
                >
                  <option value="FORM">Form</option>
                  <option value="PROCEDURE">Procedure</option>
                  <option value="WORK_INSTRUCTION">Work Instruction</option>
                  <option value="RECORD">Record</option>
                  <option value="MANUAL">Manual</option>
                  <option value="TEMPLATE">Template</option>
                  <option value="EXTERNAL">External Document</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category:</label>
                <select
                  value={createData.category}
                  onChange={(e) => setCreateData({...createData, category: e.target.value})}
                  className="form-select"
                >
                  <option value="Crewing">Crewing</option>
                  <option value="Admin">Admin</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Operations">Operations</option>
                  <option value="Quality">Quality</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description:</label>
                <textarea
                  value={createData.description}
                  onChange={(e) => setCreateData({...createData, description: e.target.value})}
                  className="form-textarea"
                  rows={3}
                  placeholder="Brief description of the document"
                />
              </div>

              <div className="form-group">
                <label>Prepared By: *</label>
                <input
                  type="text"
                  value={createData.preparedBy}
                  onChange={(e) => setCreateData({...createData, preparedBy: e.target.value})}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Retention Period (years):</label>
                <input
                  type="number"
                  value={createData.retentionPeriod}
                  onChange={(e) => setCreateData({...createData, retentionPeriod: parseInt(e.target.value)})}
                  className="form-input"
                  min="1"
                  max="50"
                />
              </div>

              <div className="form-group full-width">
                <label>Upload Document File:</label>
                <div className="file-upload">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <label htmlFor="file-upload" className="file-label">
                    {createData.file ? (
                      <span>📎 {createData.file.name}</span>
                    ) : (
                      <span>📁 Choose file (PDF, Word, Excel)</span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)} disabled={uploading}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateDocument} disabled={uploading}>
                {uploading ? '⏳ Creating...' : '✅ Create Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
