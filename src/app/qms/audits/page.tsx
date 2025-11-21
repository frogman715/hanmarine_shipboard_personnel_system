'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';
import './audits.css';

interface Audit {
  id: number;
  auditNumber: string;
  auditDate: string;
  auditType: string;
  auditScope: string;
  leadAuditor: string;
  auditors: string[];
  auditee?: string;
  status: string;
  nonConformities?: number;
  summary?: string;
  createdAt: string;
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    auditDate: '',
    auditType: 'INTERNAL',
    auditScope: '',
    leadAuditor: '',
    auditors: '',
    auditee: ''
  });

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await fetch('/api/qms/audits');
      if (response.ok) {
        const data = await response.json();
        setAudits(data);
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
      const response = await fetch('/api/qms/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          auditors: formData.auditors.split(',').map(a => a.trim()).filter(Boolean),
          createdBy: 'QMR'
        })
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchAudits();
        alert('Audit scheduled successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to schedule audit');
    }
  };

  const resetForm = () => {
    setFormData({
      auditDate: '',
      auditType: 'INTERNAL',
      auditScope: '',
      leadAuditor: '',
      auditors: '',
      auditee: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      PLANNED: { color: '#3b82f6', label: 'Planned' },
      IN_PROGRESS: { color: '#f59e0b', label: 'In Progress' },
      COMPLETED: { color: '#10b981', label: 'Completed' },
      REPORT_ISSUED: { color: '#8b5cf6', label: 'Report Issued' },
      CLOSED: { color: '#64748b', label: 'Closed' }
    };
    return badges[status] || badges.PLANNED;
  };

  const filteredAudits = audits.filter(audit => 
    statusFilter === 'ALL' || audit.status === statusFilter
  );

  if (loading) return <div className="audits-page"><div className="loading">Loading audits...</div></div>;

  return (
    <div className="audits-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'QMS Dashboard', href: '/qms', icon: '📊' },
        { label: 'Internal Audits', href: '/qms/audits', icon: '📋' }
      ]} />
      <div className="page-header">
        <div className="header-left">
          <h1>🔍 Internal Audit System</h1>
          <p className="subtitle">ISO 9001:2015 Clause 9.2 - Internal audits scheduled every April and October</p>
        </div>
        <div className="header-actions">
          <Link href="/qms" className="btn-secondary">← Back to QMS</Link>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            📅 Schedule Audit
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REPORT_ISSUED">Report Issued</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Audits:</span>
            <span className="stat-value">{filteredAudits.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">This Year:</span>
            <span className="stat-value">
              {filteredAudits.filter(a => new Date(a.auditDate).getFullYear() === 2025).length}
            </span>
          </div>
        </div>
      </div>

      <div className="audit-grid">
        {filteredAudits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No audits scheduled</h3>
            <p>Click "Schedule Audit" to plan your next internal audit</p>
          </div>
        ) : (
          filteredAudits.map((audit) => {
            const badge = getStatusBadge(audit.status);
            return (
              <div key={audit.id} className="audit-card">
                <div className="audit-header">
                  <div className="audit-number">{audit.auditNumber}</div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: `${badge.color}20`, color: badge.color, border: `1px solid ${badge.color}` }}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="audit-date">
                  📅 {new Date(audit.auditDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                <div className="audit-type">
                  <span className={`type-tag ${audit.auditType.toLowerCase()}`}>
                    {audit.auditType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="audit-info">
                  <div className="info-row">
                    <strong>Scope:</strong>
                    <span>{audit.auditScope}</span>
                  </div>
                  <div className="info-row">
                    <strong>Lead Auditor:</strong>
                    <span>{audit.leadAuditor}</span>
                  </div>
                  {audit.auditors && audit.auditors.length > 0 && (
                    <div className="info-row">
                      <strong>Team:</strong>
                      <span>{audit.auditors.join(', ')}</span>
                    </div>
                  )}
                  {audit.auditee && (
                    <div className="info-row">
                      <strong>Auditee:</strong>
                      <span>{audit.auditee}</span>
                    </div>
                  )}
                  {audit.nonConformities !== undefined && audit.nonConformities > 0 && (
                    <div className="info-row nc-row">
                      <strong>Non-Conformities:</strong>
                      <span className="nc-count">{audit.nonConformities}</span>
                    </div>
                  )}
                </div>

                {audit.summary && (
                  <div className="audit-summary">{audit.summary}</div>
                )}

                <div className="audit-actions">
                  <button className="btn-action">View Details</button>
                  {audit.status === 'PLANNED' && (
                    <button className="btn-action">Start Audit</button>
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
              <h2>Schedule Internal Audit</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Audit Date *</label>
                  <input
                    type="date"
                    value={formData.auditDate}
                    onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Audit Type *</label>
                  <select 
                    value={formData.auditType}
                    onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                    required
                  >
                    <option value="INTERNAL">Internal</option>
                    <option value="EXTERNAL">External</option>
                    <option value="SURVEILLANCE">Surveillance</option>
                    <option value="SPECIAL">Special</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Audit Scope *</label>
                <textarea
                  placeholder="e.g., Crewing Department, Document Control, All QMS Processes"
                  value={formData.auditScope}
                  onChange={(e) => setFormData({ ...formData, auditScope: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Lead Auditor *</label>
                  <input
                    type="text"
                    placeholder="Name of lead auditor"
                    value={formData.leadAuditor}
                    onChange={(e) => setFormData({ ...formData, leadAuditor: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Auditors</label>
                  <input
                    type="text"
                    placeholder="Names separated by commas"
                    value={formData.auditors}
                    onChange={(e) => setFormData({ ...formData, auditors: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Auditee (Department/Person)</label>
                <input
                  type="text"
                  placeholder="Who/what is being audited"
                  value={formData.auditee}
                  onChange={(e) => setFormData({ ...formData, auditee: e.target.value })}
                />
              </div>

              <div className="info-box">
                <strong>📋 Note:</strong> Internal audits are scheduled every April and October per HGQS procedures.
                Use forms HCF-AD-07 (Guide), HCF-AD-08 (Plan), HCF-AD-09 (Report).
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Schedule Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
