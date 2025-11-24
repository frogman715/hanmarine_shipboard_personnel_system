'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';
import './cpar.css';

interface CPAR {
  id: number;
  carNumber: string;
  source: string;
  problemDescription: string;
  detectedDate: string;
  detectedBy: string;
  rootCauseAnalysis?: string;
  category?: string;
  proposedAction?: string;
  responsiblePerson?: string;
  targetDate?: string;
  status: string;
  createdAt: string;
}

export default function CPARPage() {
  const [cpars, setCpars] = useState<CPAR[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    source: 'INTERNAL_AUDIT',
    problemDescription: '',
    detectedBy: '',
    rootCauseAnalysis: '',
    category: 'PROCESS_FAILURE',
    proposedAction: '',
    responsiblePerson: '',
    targetDate: ''
  });

  useEffect(() => {
    fetchCPARs();
  }, []);

  const fetchCPARs = async () => {
    try {
      const response = await fetch('/api/qms/cpar');
      if (response.ok) {
        const data = await response.json();
        setCpars(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/qms/cpar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchCPARs();
        alert('CPAR created successfully!');
      }
    } catch (error) {
      alert('Failed to create CPAR');
    }
  };

  const resetForm = () => {
    setFormData({
      source: 'INTERNAL_AUDIT',
      problemDescription: '',
      detectedBy: '',
      rootCauseAnalysis: '',
      category: 'PROCESS_FAILURE',
      proposedAction: '',
      responsiblePerson: '',
      targetDate: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      OPEN: { color: '#dc2626', label: '🔴 Open' },
      IN_PROGRESS: { color: '#f59e0b', label: '🟡 In Progress' },
      PENDING_VERIFICATION: { color: '#3b82f6', label: '🔵 Pending Verification' },
      VERIFIED_EFFECTIVE: { color: '#10b981', label: '🟢 Verified Effective' },
      VERIFIED_INEFFECTIVE: { color: '#dc2626', label: '🔴 Ineffective' },
      CLOSED: { color: '#64748b', label: '⚫ Closed' }
    };
    return badges[status] || badges.OPEN;
  };

  const filteredCPARs = cpars.filter(cpar => 
    statusFilter === 'ALL' || cpar.status === statusFilter
  );

  if (loading) return <div className="cpar-page"><div className="loading">Loading CPARs...</div></div>;

  return (
    <div className="cpar-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'QMS Dashboard', href: '/qms', icon: '📊' },
        { label: 'CPAR', href: '/qms/cpar', icon: '🔧' }
      ]} />
      <div className="page-header">
        <div className="header-left">
          <h1>🔧 CPAR System</h1>
          <p className="subtitle">Corrective & Preventive Action Request (ISO 9001:2015 Clause 10.2)</p>
        </div>
        <div className="header-actions">
          <Link href="/qms" className="btn-secondary">← Back to QMS</Link>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            ➕ New CPAR
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="VERIFIED_EFFECTIVE">Verified Effective</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total CPARs:</span>
            <span className="stat-value">{filteredCPARs.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Open:</span>
            <span className="stat-value open-count">
              {filteredCPARs.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length}
            </span>
          </div>
        </div>
      </div>

      <div className="cpar-grid">
        {filteredCPARs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔧</div>
            <h3>No CPARs found</h3>
            <p>Click "New CPAR" to create a corrective/preventive action request</p>
          </div>
        ) : (
          filteredCPARs.map((cpar) => {
            const badge = getStatusBadge(cpar.status);
            return (
              <div key={cpar.id} className="cpar-card">
                <div className="cpar-header">
                  <div className="cpar-number">{cpar.carNumber}</div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: `${badge.color}20`, color: badge.color, border: `1px solid ${badge.color}` }}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="cpar-source">
                  <span className="source-tag">
                    {cpar.source.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="cpar-problem">{cpar.problemDescription}</div>

                <div className="cpar-info">
                  <div className="info-row">
                    <strong>Detected by:</strong>
                    <span>{cpar.detectedBy}</span>
                  </div>
                  <div className="info-row">
                    <strong>Date:</strong>
                    <span>{new Date(cpar.detectedDate).toLocaleDateString()}</span>
                  </div>
                  {cpar.category && (
                    <div className="info-row">
                      <strong>Category:</strong>
                      <span>{cpar.category.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {cpar.responsiblePerson && (
                    <div className="info-row">
                      <strong>Responsible:</strong>
                      <span>{cpar.responsiblePerson}</span>
                    </div>
                  )}
                  {cpar.targetDate && (
                    <div className="info-row">
                      <strong>Target Date:</strong>
                      <span>{new Date(cpar.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {cpar.rootCauseAnalysis && (
                  <div className="cpar-section">
                    <strong>Root Cause:</strong>
                    <p>{cpar.rootCauseAnalysis}</p>
                  </div>
                )}

                {cpar.proposedAction && (
                  <div className="cpar-section">
                    <strong>Proposed Action:</strong>
                    <p>{cpar.proposedAction}</p>
                  </div>
                )}

                <div className="cpar-actions">
                  <button className="btn-action">View Details</button>
                  {cpar.status === 'OPEN' && (
                    <button className="btn-action">Start Work</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create CPAR</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Source *</label>
                <select 
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  required
                >
                  <option value="INTERNAL_AUDIT">Internal Audit</option>
                  <option value="EXTERNAL_AUDIT">External Audit</option>
                  <option value="CUSTOMER_COMPLAINT">Customer Complaint</option>
                  <option value="CREW_COMPLAINT">Crew Complaint</option>
                  <option value="MANAGEMENT_REVIEW">Management Review</option>
                  <option value="NONCONFORMING_PRODUCT">Nonconforming Product</option>
                  <option value="DATA_ANALYSIS">Data Analysis</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Problem Description *</label>
                <textarea
                  placeholder="Describe the non-conformity or problem..."
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Detected By *</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.detectedBy}
                    onChange={(e) => setFormData({ ...formData, detectedBy: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="DOCUMENT_CONTROL">Document Control</option>
                    <option value="RECORD_KEEPING">Record Keeping</option>
                    <option value="TRAINING">Training</option>
                    <option value="COMPETENCE">Competence</option>
                    <option value="COMMUNICATION">Communication</option>
                    <option value="CUSTOMER_REQUIREMENTS">Customer Requirements</option>
                    <option value="SUPPLIER_ISSUE">Supplier Issue</option>
                    <option value="PROCESS_FAILURE">Process Failure</option>
                    <option value="EQUIPMENT_FAILURE">Equipment Failure</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Root Cause Analysis</label>
                <textarea
                  placeholder="Why did this happen? What is the root cause?"
                  value={formData.rootCauseAnalysis}
                  onChange={(e) => setFormData({ ...formData, rootCauseAnalysis: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Proposed Corrective Action</label>
                <textarea
                  placeholder="What actions will be taken to prevent recurrence?"
                  value={formData.proposedAction}
                  onChange={(e) => setFormData({ ...formData, proposedAction: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Responsible Person</label>
                  <input
                    type="text"
                    placeholder="Who will implement the action?"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="info-box">
                <strong>📋 Forms:</strong> HCF-AD-10 (Request), HCF-AD-11 (Report), HCF-AD-15 (Non-conformity)
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create CPAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
