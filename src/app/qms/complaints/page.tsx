'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './complaints.css';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [formData, setFormData] = useState({
    complainantType: 'SEAFARER',
    complainantName: '',
    complainantContact: '',
    category: 'CREW_CONDUCT',
    description: '',
    vesselInvolved: '',
    dateOfIncident: '',
    priority: 'MEDIUM'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/qms/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/qms/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchComplaints();
        setFormData({
          complainantType: 'SEAFARER',
          complainantName: '',
          complainantContact: '',
          category: 'CREW_CONDUCT',
          description: '',
          vesselInvolved: '',
          dateOfIncident: '',
          priority: 'MEDIUM'
        });
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      RECEIVED: { emoji: '📨', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      UNDER_INVESTIGATION: { emoji: '🔍', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      RESOLVED: { emoji: '✅', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      CLOSED: { emoji: '🔒', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' }
    };
    const badge = badges[status] || badges.RECEIVED;
    return (
      <span className="status-badge" style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      LOW: { emoji: '🟢', color: '#10b981' },
      MEDIUM: { emoji: '🟡', color: '#f59e0b' },
      HIGH: { emoji: '🔴', color: '#dc2626' }
    };
    const badge = badges[priority] || badges.MEDIUM;
    return (
      <span className="priority-badge" style={{ color: badge.color }}>
        {badge.emoji} {priority}
      </span>
    );
  };

  const getTypeTag = (type) => {
    return (
      <span className="type-tag">
        {type.replace(/_/g, ' ')}
      </span>
    );
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filterType !== 'ALL' && complaint.complainantType !== filterType) return false;
    if (filterStatus !== 'ALL' && complaint.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'RECEIVED' || c.status === 'UNDER_INVESTIGATION').length,
    highPriority: complaints.filter(c => c.priority === 'HIGH').length
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  return (
    <div className="complaints-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'QMS Dashboard', href: '/qms', icon: '📊' },
        { label: 'Complaints', href: '/qms/complaints', icon: '📢' }
      ]} />
      <div className="page-header">
        <div className="header-left">
          <h1>📢 Complaint Management</h1>
          <p className="subtitle">MLC 2006 Regulation 5.1.5 - On-board Complaint Procedures</p>
          <p className="subtitle">ISO 9001:2015 Clause 9.1.2 - Customer Satisfaction Monitoring</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📋 Contact Directory</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ Log Complaint
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Complainant:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="CUSTOMER">Customer</option>
            <option value="SEAFARER">Seafarer</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="MEDIA">Media</option>
            <option value="AUTHORITY">Authority</option>
            <option value="OTHER">Other</option>
          </select>
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="RECEIVED">Received</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Open:</span>
            <span className="stat-value open-count">{stats.open}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">High Priority:</span>
            <span className="stat-value high-priority-count">{stats.highPriority}</span>
          </div>
        </div>
      </div>

      <div className="complaints-grid">
        {filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <h3>No Complaints Logged</h3>
            <p>Log complaints to track and resolve issues effectively.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Log First Complaint
            </button>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              <div className="complaint-header">
                <div className="header-info">
                  <span className="complaint-number">{complaint.complaintNumber}</span>
                  {getPriorityBadge(complaint.priority)}
                </div>
                {getStatusBadge(complaint.status)}
              </div>

              <div className="complaint-meta">
                {getTypeTag(complaint.complainantType)}
                <span className="category-tag">{complaint.category.replace(/_/g, ' ')}</span>
              </div>

              <div className="complaint-description">
                {complaint.description}
              </div>

              <div className="complaint-info">
                <div className="info-row">
                  <span className="info-label">👤 Complainant:</span>
                  <span>{complaint.complainantName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📞 Contact:</span>
                  <span>{complaint.complainantContact || 'N/A'}</span>
                </div>
                {complaint.vesselInvolved && (
                  <div className="info-row">
                    <span className="info-label">🚢 Vessel:</span>
                    <span>{complaint.vesselInvolved}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">📅 Incident Date:</span>
                  <span>{complaint.dateOfIncident ? new Date(complaint.dateOfIncident).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📨 Received:</span>
                  <span>{new Date(complaint.receivedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {complaint.investigation && (
                <div className="investigation-section">
                  <strong>🔍 Investigation:</strong>
                  <p>{complaint.investigation}</p>
                </div>
              )}

              {complaint.resolution && (
                <div className="resolution-section">
                  <strong>✅ Resolution:</strong>
                  <p>{complaint.resolution}</p>
                </div>
              )}

              <div className="complaint-actions">
                <button className="btn-action">🔍 Investigate</button>
                <button className="btn-action">✅ Resolve</button>
                <button className="btn-action">📋 Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📢 Log New Complaint</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>MLC 2006 On-board Complaint Procedures:</strong><br/>
                All complaints must be logged and investigated promptly. Seafarers have the right to make complaints directly to the captain, ship owner, or competent authority. Contact Directory available in Annex C (HGQS Manual page 41).
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Complainant Type *</label>
                  <select
                    value={formData.complainantType}
                    onChange={(e) => setFormData({...formData, complainantType: e.target.value})}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="SEAFARER">Seafarer</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MEDIA">Media</option>
                    <option value="AUTHORITY">Authority</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Complainant Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.complainantName}
                    onChange={(e) => setFormData({...formData, complainantName: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Information</label>
                  <input
                    type="text"
                    value={formData.complainantContact}
                    onChange={(e) => setFormData({...formData, complainantContact: e.target.value})}
                    placeholder="Phone/Email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="SERVICE_QUALITY">Service Quality</option>
                    <option value="CREW_CONDUCT">Crew Conduct</option>
                    <option value="HARASSMENT">Harassment</option>
                    <option value="SAFETY_CONCERN">Safety Concern</option>
                    <option value="HEALTH_ISSUE">Health Issue</option>
                    <option value="CONTRACT_DISPUTE">Contract Dispute</option>
                    <option value="PAYMENT_ISSUE">Payment Issue</option>
                    <option value="DISCRIMINATION">Discrimination</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Incident</label>
                  <input
                    type="date"
                    value={formData.dateOfIncident}
                    onChange={(e) => setFormData({...formData, dateOfIncident: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Vessel Involved (if applicable)</label>
                <input
                  type="text"
                  value={formData.vesselInvolved}
                  onChange={(e) => setFormData({...formData, vesselInvolved: e.target.value})}
                  placeholder="Vessel name"
                />
              </div>

              <div className="form-group">
                <label>Complaint Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide detailed description of the complaint"
                  rows={5}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Log Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
