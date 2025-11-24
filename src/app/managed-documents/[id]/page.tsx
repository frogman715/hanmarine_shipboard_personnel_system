'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import './detail.css';

interface DocumentRevision {
  id: number;
  revisionNumber: number;
  changeSummary: string | null;
  reasonForChange: string | null;
  revisionDate: string;
  preparedBy: string | null;
  status: string;
}

interface DocumentApproval {
  id: number;
  revisionNumber: number;
  approverRole: string;
  approverName: string | null;
  action: string;
  comments: string | null;
  actionDate: string;
}

interface DocumentDistribution {
  id: number;
  distributedTo: string;
  distributionMethod: string;
  distributedAt: string;
  acknowledgedAt: string | null;
}

interface ManagedDocument {
  id: number;
  documentCode: string;
  documentTitle: string;
  documentType: string;
  category: string;
  description: string | null;
  currentRevision: number;
  revisionDate: string;
  effectiveDate: string | null;
  status: string;
  preparedBy: string | null;
  reviewedBy: string | null;
  approvedBy: string | null;
  retentionPeriod: number | null;
  revisions: DocumentRevision[];
  approvals: DocumentApproval[];
  distributions: DocumentDistribution[];
}

export default function DocumentDetailPage() {
  const params = useParams();
  const [document, setDocument] = useState<ManagedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'revisions' | 'approvals' | 'distribution'>('info');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalComments, setApprovalComments] = useState('');
  const [revisionData, setRevisionData] = useState({
    changeSummary: '',
    reasonForChange: '',
  });
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [distributionData, setDistributionData] = useState({
    distributedTo: '',
    distributionMethod: 'EMAIL',
  });

  useEffect(() => {
    if (params.id) {
      loadDocument();
    }
  }, [params.id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDocument(data.document);
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvalAction) return;

    try {
      const response = await fetch(`/api/documents/${params.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approverRole: 'DIRECTOR', // TODO: Get from user session
          approverName: 'Director Name', // TODO: Get from user session
          action: approvalAction,
          comments: approvalComments || undefined,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Approval action completed successfully!');
        setShowApprovalModal(false);
        setApprovalComments('');
        loadDocument();
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Failed to process approval');
    }
  };

  const handleCreateRevision = async () => {
    if (!revisionData.changeSummary || !revisionData.reasonForChange) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`/api/documents/${params.id}/revise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...revisionData,
          preparedBy: 'QMR Name', // TODO: Get from user session
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('New revision created successfully!');
        setShowRevisionModal(false);
        setRevisionData({ changeSummary: '', reasonForChange: '' });
        loadDocument();
      }
    } catch (error) {
      console.error('Error creating revision:', error);
      alert('Failed to create revision');
    }
  };

  const handleDistribute = async () => {
    if (!distributionData.distributedTo) {
      alert('Please enter recipient name/email');
      return;
    }

    try {
      const response = await fetch(`/api/documents/${params.id}/distribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(distributionData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Document distributed successfully!');
        setShowDistributionModal(false);
        setDistributionData({ distributedTo: '', distributionMethod: 'EMAIL' });
        loadDocument();
      }
    } catch (error) {
      console.error('Error distributing document:', error);
      alert('❌ Failed to distribute document');
    }
  };

  if (loading) {
    return (
      <div className="doc-detail-container">
        <MainNavigation />
        <div className="loading">⏳ Loading document...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="doc-detail-container">
        <MainNavigation />
        <div className="error">❌ Document not found</div>
      </div>
    );
  }

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

  return (
    <div className="doc-detail-container">
      <MainNavigation />
      
      <div className="doc-detail-content">
        <div className="doc-detail-header">
          <div className="header-left">
            <button className="back-button" onClick={() => window.history.back()}>
              ← Back
            </button>
            <div className="doc-title-section">
              <h1 className="doc-code">{document.documentCode}</h1>
              <h2 className="doc-title">{document.documentTitle}</h2>
              <div className="doc-meta">
                <span className={`status-badge ${getStatusBadge(document.status).className}`}>
                  {getStatusBadge(document.status).text}
                </span>
                <span className="meta-item">Rev {document.currentRevision}</span>
                <span className="meta-item">{document.category}</span>
                <span className="meta-item">{document.documentType}</span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {document.status === 'APPROVED' && (
              <>
                <button className="action-button distribute-button" onClick={() => setShowDistributionModal(true)}>
                  📤 Distribute
                </button>
                <button className="action-button revision-button" onClick={() => setShowRevisionModal(true)}>
                  📝 New Revision
                </button>
              </>
            )}
            {(document.status === 'REVIEW' || document.status === 'PENDING_APPROVAL') && (
              <button className="action-button approve-button" onClick={() => setShowApprovalModal(true)}>
                ✅ Process Approval
              </button>
            )}
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📄 Document Info
          </button>
          <button 
            className={`tab ${activeTab === 'revisions' ? 'active' : ''}`}
            onClick={() => setActiveTab('revisions')}
          >
            📋 Revisions ({document.revisions.length})
          </button>
          <button 
            className={`tab ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            ✅ Approvals ({document.approvals.length})
          </button>
          <button 
            className={`tab ${activeTab === 'distribution' ? 'active' : ''}`}
            onClick={() => setActiveTab('distribution')}
          >
            📤 Distribution ({document.distributions.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-grid">
              <div className="info-card">
                <h3>Document Details</h3>
                <div className="info-row">
                  <span className="info-label">Document Code:</span>
                  <span className="info-value">{document.documentCode}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Title:</span>
                  <span className="info-value">{document.documentTitle}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{document.documentType}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{document.category}</span>
                </div>
                {document.description && (
                  <div className="info-row">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{document.description}</span>
                  </div>
                )}
              </div>

              <div className="info-card">
                <h3>Version Information</h3>
                <div className="info-row">
                  <span className="info-label">Current Revision:</span>
                  <span className="info-value">Rev {document.currentRevision}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Revision Date:</span>
                  <span className="info-value">
                    {new Date(document.revisionDate).toLocaleDateString()}
                  </span>
                </div>
                {document.effectiveDate && (
                  <div className="info-row">
                    <span className="info-label">Effective Date:</span>
                    <span className="info-value">
                      {new Date(document.effectiveDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {document.retentionPeriod && (
                  <div className="info-row">
                    <span className="info-label">Retention Period:</span>
                    <span className="info-value">{document.retentionPeriod} years</span>
                  </div>
                )}
              </div>

              <div className="info-card">
                <h3>Approval Chain</h3>
                <div className="info-row">
                  <span className="info-label">Prepared By:</span>
                  <span className="info-value">{document.preparedBy || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Reviewed By:</span>
                  <span className="info-value">{document.reviewedBy || 'Pending'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Approved By:</span>
                  <span className="info-value">{document.approvedBy || 'Pending'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revisions' && (
            <div className="timeline">
              {document.revisions.map((revision) => (
                <div key={revision.id} className="timeline-item">
                  <div className="timeline-marker">Rev {revision.revisionNumber}</div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4>Revision {revision.revisionNumber}</h4>
                      <span className="timeline-date">
                        {new Date(revision.revisionDate).toLocaleDateString()}
                      </span>
                    </div>
                    {revision.changeSummary && (
                      <div className="timeline-detail">
                        <strong>Changes:</strong> {revision.changeSummary}
                      </div>
                    )}
                    {revision.reasonForChange && (
                      <div className="timeline-detail">
                        <strong>Reason:</strong> {revision.reasonForChange}
                      </div>
                    )}
                    {revision.preparedBy && (
                      <div className="timeline-detail">
                        <strong>Prepared by:</strong> {revision.preparedBy}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="approvals-list">
              {document.approvals.map((approval) => (
                <div key={approval.id} className="approval-item">
                  <div className="approval-header">
                    <div className="approval-role">{approval.approverRole}</div>
                    <div className="approval-action">{approval.action}</div>
                    <div className="approval-date">
                      {new Date(approval.actionDate).toLocaleString()}
                    </div>
                  </div>
                  {approval.approverName && (
                    <div className="approval-detail">
                      <strong>By:</strong> {approval.approverName}
                    </div>
                  )}
                  {approval.comments && (
                    <div className="approval-detail">
                      <strong>Comments:</strong> {approval.comments}
                    </div>
                  )}
                  <div className="approval-detail">
                    <strong>Revision:</strong> Rev {approval.revisionNumber}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="distribution-list">
              {document.distributions.length === 0 ? (
                <div className="no-data">No distribution records</div>
              ) : (
                document.distributions.map((dist) => (
                  <div key={dist.id} className="distribution-item">
                    <div className="dist-header">
                      <span className="dist-recipient">{dist.distributedTo}</span>
                      <span className="dist-method">{dist.distributionMethod}</span>
                    </div>
                    <div className="dist-dates">
                      <span>Distributed: {new Date(dist.distributedAt).toLocaleString()}</span>
                      {dist.acknowledgedAt && (
                        <span className="acknowledged">
                          ✅ Acknowledged: {new Date(dist.acknowledgedAt).toLocaleString()}
                        </span>
                      )}
                      {!dist.acknowledgedAt && (
                        <span className="pending">⏳ Pending acknowledgment</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Process Approval</h2>
            <div className="form-group">
              <label>Action:</label>
              <select 
                value={approvalAction} 
                onChange={(e) => setApprovalAction(e.target.value)}
                className="form-select"
              >
                <option value="">Select action...</option>
                <option value="REVIEWED">Review (QMR)</option>
                <option value="APPROVED">Approve (Director)</option>
                <option value="REJECTED">Reject</option>
                <option value="REQUESTED_CHANGES">Request Changes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comments:</label>
              <textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Add comments..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleApprove}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="modal-overlay" onClick={() => setShowRevisionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Revision</h2>
            <div className="form-group">
              <label>Change Summary:</label>
              <input
                type="text"
                value={revisionData.changeSummary}
                onChange={(e) => setRevisionData({...revisionData, changeSummary: e.target.value})}
                className="form-input"
                placeholder="Brief summary of changes..."
              />
            </div>
            <div className="form-group">
              <label>Reason for Change:</label>
              <textarea
                value={revisionData.reasonForChange}
                onChange={(e) => setRevisionData({...revisionData, reasonForChange: e.target.value})}
                className="form-textarea"
                rows={4}
                placeholder="Detailed reason for this revision..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRevisionModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateRevision}>
                Create Revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Modal */}
      {showDistributionModal && (
        <div className="modal-overlay" onClick={() => setShowDistributionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📤 Distribute Document</h2>
            <p className="modal-subtitle">
              Send {document.documentCode} to stakeholders
            </p>
            
            <div className="form-group">
              <label>Recipient Name/Email:</label>
              <input
                type="text"
                value={distributionData.distributedTo}
                onChange={(e) => setDistributionData({...distributionData, distributedTo: e.target.value})}
                className="form-input"
                placeholder="e.g., John Doe or john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Distribution Method:</label>
              <select
                value={distributionData.distributionMethod}
                onChange={(e) => setDistributionData({...distributionData, distributionMethod: e.target.value})}
                className="form-select"
                aria-label="Distribution method"
              >
                <option value="EMAIL">Email</option>
                <option value="PORTAL">Portal Access</option>
                <option value="PRINT">Printed Copy</option>
                <option value="SHARED_DRIVE">Shared Drive</option>
              </select>
            </div>

            <div className="info-box">
              <strong>💡 Note:</strong> Recipients will be notified about this distribution. 
              They can acknowledge receipt through the portal.
            </div>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDistributionModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleDistribute}>
                📤 Distribute Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
