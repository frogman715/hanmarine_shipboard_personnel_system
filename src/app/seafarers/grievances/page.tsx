'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './grievances.css';

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [formData, setFormData] = useState({
    grievanceNumber: '',
    contractId: '',
    seafarerName: '',
    vesselName: '',
    grievanceType: 'WAGE_ISSUE',
    filedDate: new Date().toISOString().split('T')[0],
    description: '',
    investigationNotes: '',
    resolution: '',
    status: 'FILED'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [grievancesRes, crewRes] = await Promise.all([
        fetch('/api/seafarers/grievances'),
        fetch('/api/crew')
      ]);
      
      const [grievancesData, crewData] = await Promise.all([
        grievancesRes.json(),
        crewRes.json()
      ]);

      setGrievances(grievancesData);
      setCrew(crewData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/seafarers/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchData();
        setFormData({
          grievanceNumber: '',
          contractId: '',
          seafarerName: '',
          vesselName: '',
          grievanceType: 'WAGE_ISSUE',
          filedDate: new Date().toISOString().split('T')[0],
          description: '',
          investigationNotes: '',
          resolution: '',
          status: 'FILED'
        });
      }
    } catch (error) {
      console.error('Error creating grievance:', error);
    }
  };

  const handleUpdate = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/seafarers/grievances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchData();
        setSelectedGrievance(null);
      }
    } catch (error) {
      console.error('Error updating grievance:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { emoji: string; color: string }> = {
      FILED: { emoji: '📥', color: '#3b82f6' },
      UNDER_INVESTIGATION: { emoji: '🔍', color: '#f59e0b' },
      RESOLVED: { emoji: '✅', color: '#10b981' },
      ESCALATED: { emoji: '⚠️', color: '#ef4444' },
      CLOSED: { emoji: '✓', color: '#6b7280' }
    };
    const badge = badges[status] || badges.FILED;
    return (
      <span className="status-badge" style={{ color: badge.color, background: `${badge.color}20`, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      WAGE_ISSUE: '💰',
      WORKING_CONDITIONS: '🏢',
      HARASSMENT: '🚫',
      SAFETY_CONCERN: '⚠️',
      CONTRACT_DISPUTE: '📄',
      DISCRIMINATION: '⚖️',
      LEAVE_ISSUE: '📅',
      OTHER: '📝'
    };
    return icons[type] || '📝';
  };

  const getDaysOpen = (filedDate: string) => {
    const reported = new Date(filedDate);
    const today = new Date();
    const diff = Math.ceil((today.getTime() - reported.getTime()) / (1000 * 3600 * 24));
    return diff;
  };

  const stats = {
    total: grievances.length,
    filed: grievances.filter((g: any) => g.status === 'FILED').length,
    investigating: grievances.filter((g: any) => g.status === 'UNDER_INVESTIGATION').length,
    resolved: grievances.filter((g: any) => g.status === 'RESOLVED').length,
    escalated: grievances.filter((g: any) => g.status === 'ESCALATED').length
  };

  if (loading) {
    return <div className="loading">Loading grievances...</div>;
  }

  return (
    <div className="grievances-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'Grievance System', href: '/seafarers/grievances', icon: '⚖️' }
      ]} />
      
      <div className="page-header">
        <div className="header-left">
          <h1>⚖️ Seafarer Grievance System</h1>
          <p className="subtitle">MLC 2006 Regulation 5.1.5 - On-board Complaint Procedures</p>
          <p className="subtitle">Fair, effective and expeditious procedures for handling complaints</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📊 Grievance Report</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ File Grievance
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Grievances</div>
          </div>
        </div>
        <div className="stat-card filed">
          <div className="stat-icon">📥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.filed}</div>
            <div className="stat-label">New Filed</div>
          </div>
        </div>
        <div className="stat-card investigating">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <div className="stat-value">{stats.investigating}</div>
            <div className="stat-label">Under Investigation</div>
          </div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card escalated">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.escalated}</div>
            <div className="stat-label">Escalated</div>
          </div>
        </div>
      </div>

      <div className="grievances-grid">
        {grievances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚖️</div>
            <h3>No Grievances Filed</h3>
            <p>MLC 2006 requires fair and effective complaint handling procedures.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ File First Grievance
            </button>
          </div>
        ) : (
          grievances.map((grievance: any) => {
            const daysOpen = getDaysOpen(grievance.filedDate);
            const isUrgent = daysOpen > 30 && grievance.status !== 'RESOLVED' && grievance.status !== 'CLOSED';
            
            return (
              <div 
                key={grievance.id} 
                className={`grievance-card ${isUrgent ? 'urgent' : ''}`}
                onClick={() => setSelectedGrievance(grievance)}
              >
                <div className="grievance-header">
                  <div className="grievance-number">
                    {getTypeIcon(grievance.grievanceType)} {grievance.grievanceNumber}
                  </div>
                  {getStatusBadge(grievance.status)}
                </div>

                <div className="grievance-type-badge">
                  {grievance.grievanceType.replace(/_/g, ' ')}
                </div>

                <div className="crew-info">
                  <h3 className="crew-name">👤 {grievance.seafarerName}</h3>
                  <span className="crew-rank">🚢 {grievance.vesselName}</span>
                </div>

                <div className="grievance-description">
                  <strong>Description:</strong>
                  <p>{grievance.description}</p>
                </div>

                <div className="grievance-meta">
                  <div className="meta-item">
                    <span className="meta-label">📅 Filed:</span>
                    <span className="meta-value">{new Date(grievance.filedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⏱️ Days Open:</span>
                    <span className={`meta-value ${isUrgent ? 'urgent-text' : ''}`}>
                      {daysOpen} days {isUrgent && '⚠️'}
                    </span>
                  </div>
                </div>

                {grievance.investigationNotes && (
                  <div className="investigation-notes">
                    <strong>🔍 Investigation:</strong>
                    <p>{grievance.investigationNotes}</p>
                  </div>
                )}

                {grievance.resolution && (
                  <div className="resolution-box">
                    <strong>✅ Resolution:</strong>
                    <p>{grievance.resolution}</p>
                  </div>
                )}

                <div className="mlc-badge">
                  ⚖️ MLC 2006 Reg 5.1.5 Compliant
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚖️ File New Grievance</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box mlc">
                <strong>MLC 2006 Regulation 5.1.5:</strong><br/>
                All seafarers have the right to fair treatment and effective procedures for handling complaints on board ship. 
                Complaints shall be dealt with fairly, quickly and as close to their source as possible.
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Grievance Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.grievanceNumber}
                    onChange={(e) => setFormData({...formData, grievanceNumber: e.target.value})}
                    placeholder="GRV-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label>Contract ID *</label>
                  <input
                    type="number"
                    required
                    value={formData.contractId}
                    onChange={(e) => setFormData({...formData, contractId: e.target.value})}
                    placeholder="Contract ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Seafarer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.seafarerName}
                    onChange={(e) => setFormData({...formData, seafarerName: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label>Vessel Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vesselName}
                    onChange={(e) => setFormData({...formData, vesselName: e.target.value})}
                    placeholder="Vessel name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Grievance Type *</label>
                  <select
                    required
                    value={formData.grievanceType}
                    onChange={(e) => setFormData({...formData, grievanceType: e.target.value})}
                  >
                    <option value="WAGE_ISSUE">💰 Wage Issue</option>
                    <option value="WORKING_CONDITIONS">🏢 Working Conditions</option>
                    <option value="HARASSMENT">🚫 Harassment</option>
                    <option value="SAFETY_CONCERN">⚠️ Safety Concern</option>
                    <option value="CONTRACT_DISPUTE">📄 Contract Dispute</option>
                    <option value="DISCRIMINATION">⚖️ Discrimination</option>
                    <option value="LEAVE_ISSUE">📅 Leave Issue</option>
                    <option value="OTHER">📝 Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date Filed *</label>
                  <input
                    type="date"
                    required
                    value={formData.filedDate}
                    onChange={(e) => setFormData({...formData, filedDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description of Complaint *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide detailed description of the grievance, including dates, witnesses, and specific incidents..."
                />
              </div>

              <div className="confidentiality-notice">
                <strong>🔒 Confidentiality Notice:</strong><br/>
                All grievances are handled confidentially in accordance with MLC 2006 standards. 
                No victimization or reprisal against complainants.
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  File Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGrievance && (
        <div className="modal-overlay" onClick={() => setSelectedGrievance(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚖️ Grievance Details</h2>
              <button className="modal-close" onClick={() => setSelectedGrievance(null)}>×</button>
            </div>
            <div className="grievance-details">
              <div className="detail-header">
                <div className="detail-number">
                  {getTypeIcon(selectedGrievance.grievanceType)} {selectedGrievance.grievanceNumber}
                </div>
                {getStatusBadge(selectedGrievance.status)}
              </div>

              <div className="detail-section">
                <h3>Complainant Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span>{selectedGrievance.seafarerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vessel:</span>
                    <span>{selectedGrievance.vesselName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span>{selectedGrievance.grievanceType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date Filed:</span>
                    <span>{new Date(selectedGrievance.filedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Complaint Description</h3>
                <p className="detail-text">{selectedGrievance.description}</p>
              </div>

              {selectedGrievance.investigationNotes && (
                <div className="detail-section">
                  <h3>🔍 Investigation Notes</h3>
                  <p className="detail-text">{selectedGrievance.investigationNotes}</p>
                </div>
              )}

              {selectedGrievance.resolution && (
                <div className="detail-section">
                  <h3>✅ Resolution</h3>
                  <p className="detail-text success">{selectedGrievance.resolution}</p>
                </div>
              )}

              <div className="action-section">
                <h3>Update Status</h3>
                <div className="action-buttons">
                  {selectedGrievance.status === 'FILED' && (
                    <button 
                      className="btn-action investigate"
                      onClick={() => handleUpdate(selectedGrievance.id, { status: 'UNDER_INVESTIGATION' })}
                    >
                      🔍 Start Investigation
                    </button>
                  )}
                  {selectedGrievance.status === 'UNDER_INVESTIGATION' && (
                    <>
                      <button 
                        className="btn-action resolve"
                        onClick={() => handleUpdate(selectedGrievance.id, { status: 'RESOLVED' })}
                      >
                        ✅ Mark Resolved
                      </button>
                      <button 
                        className="btn-action escalate"
                        onClick={() => handleUpdate(selectedGrievance.id, { status: 'ESCALATED' })}
                      >
                        ⚠️ Escalate
                      </button>
                    </>
                  )}
                  {(selectedGrievance.status === 'RESOLVED' || selectedGrievance.status === 'ESCALATED') && (
                    <button 
                      className="btn-action close"
                      onClick={() => handleUpdate(selectedGrievance.id, { status: 'CLOSED' })}
                    >
                      ✓ Close Case
                    </button>
                  )}
                </div>
              </div>

              <div className="mlc-compliance-box">
                ⚖️ This grievance is handled in accordance with MLC 2006 Regulation 5.1.5 - 
                Fair treatment and on-board complaint procedures
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
