'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './suppliers.css';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [formData, setFormData] = useState({
    name: '',
    type: 'TICKETING_AGENT',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    services: '',
    registrationNumber: '',
    taxId: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/qms/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/qms/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchSuppliers();
        setFormData({
          name: '',
          type: 'TICKETING_AGENT',
          contactPerson: '',
          email: '',
          phone: '',
          address: '',
          services: '',
          registrationNumber: '',
          taxId: ''
        });
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      APPROVED: { emoji: '✅', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      CONDITIONAL: { emoji: '⚠️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      SUSPENDED: { emoji: '⏸️', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
      BLACKLISTED: { emoji: '🚫', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' }
    };
    const badge = badges[status] || badges.APPROVED;
    return (
      <span className="status-badge" style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status}
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

  const filteredSuppliers = suppliers.filter(supplier => {
    if (filterType !== 'ALL' && supplier.type !== filterType) return false;
    if (filterStatus !== 'ALL' && supplier.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: suppliers.length,
    approved: suppliers.filter(s => s.status === 'APPROVED').length,
    needsEvaluation: suppliers.filter(s => !s.evaluations || s.evaluations.length === 0).length
  };

  if (loading) {
    return <div className="loading">Loading suppliers...</div>;
  }

  return (
    <div className="suppliers-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'QMS Dashboard', href: '/qms', icon: '📊' },
        { label: 'Suppliers', href: '/qms/suppliers', icon: '🤝' }
      ]} />
      <div className="page-header">
        <div className="header-left">
          <h1>📋 Supplier Management</h1>
          <p className="subtitle">ISO 9001:2015 Clause 8.4 - Control of Externally Provided Processes, Products and Services</p>
          <p className="subtitle">Forms: HCF-AD-03 (Assessment), HCF-AD-04 (Re-evaluation)</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📊 View Evaluations</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add Supplier
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="TICKETING_AGENT">Ticketing Agent</option>
            <option value="CREW_HANDLING">Crew Handling</option>
            <option value="MEDICAL_CLINIC">Medical Clinic</option>
            <option value="TRAINING_CENTER">Training Center</option>
            <option value="CERTIFICATION_BODY">Certification Body</option>
            <option value="COURIER_SERVICE">Courier Service</option>
            <option value="TRANSLATOR">Translator</option>
            <option value="OTHER">Other</option>
          </select>
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="CONDITIONAL">Conditional</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approved:</span>
            <span className="stat-value approved-count">{stats.approved}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Needs Eval:</span>
            <span className="stat-value needs-eval-count">{stats.needsEvaluation}</span>
          </div>
        </div>
      </div>

      <div className="suppliers-grid">
        {filteredSuppliers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Suppliers Found</h3>
            <p>Add your first supplier to start tracking external providers.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Add First Supplier
            </button>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card">
              <div className="supplier-header">
                <div>
                  <h3 className="supplier-name">{supplier.name}</h3>
                  {getTypeTag(supplier.type)}
                </div>
                {getStatusBadge(supplier.status)}
              </div>

              <div className="supplier-info">
                <div className="info-row">
                  <span className="info-label">👤 Contact:</span>
                  <span>{supplier.contactPerson || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📧 Email:</span>
                  <span>{supplier.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📞 Phone:</span>
                  <span>{supplier.phone || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📍 Address:</span>
                  <span>{supplier.address || 'N/A'}</span>
                </div>
              </div>

              {supplier.services && (
                <div className="supplier-services">
                  <strong>Services:</strong>
                  <p>{supplier.services}</p>
                </div>
              )}

              <div className="supplier-registration">
                {supplier.registrationNumber && (
                  <span className="reg-badge">Reg: {supplier.registrationNumber}</span>
                )}
                {supplier.taxId && (
                  <span className="reg-badge">Tax: {supplier.taxId}</span>
                )}
              </div>

              <div className="supplier-footer">
                <div className="evaluation-info">
                  <span>Last Eval: {supplier.lastEvaluationDate ? new Date(supplier.lastEvaluationDate).toLocaleDateString() : 'Never'}</span>
                  {supplier.lastEvaluationScore && (
                    <span className="eval-score">Score: {supplier.lastEvaluationScore}/100</span>
                  )}
                </div>
                <button className="btn-action">📊 Evaluate</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Supplier</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>Supplier Assessment Process (HCF-AD-03):</strong><br/>
                1. Initial assessment before engagement<br/>
                2. Annual re-evaluation (HCF-AD-04)<br/>
                3. Performance monitoring and scoring<br/>
                4. Status update based on performance
              </div>

              <div className="form-group">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter supplier company name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="TICKETING_AGENT">Ticketing Agent</option>
                    <option value="CREW_HANDLING">Crew Handling</option>
                    <option value="MEDICAL_CLINIC">Medical Clinic</option>
                    <option value="TRAINING_CENTER">Training Center</option>
                    <option value="CERTIFICATION_BODY">Certification Body</option>
                    <option value="COURIER_SERVICE">Courier Service</option>
                    <option value="TRANSLATOR">Translator</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="Contact name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@supplier.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+62 xxx xxx xxx"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Full business address"
                />
              </div>

              <div className="form-group">
                <label>Services Provided</label>
                <textarea
                  value={formData.services}
                  onChange={(e) => setFormData({...formData, services: e.target.value})}
                  placeholder="Describe services provided by this supplier"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    placeholder="Company registration"
                  />
                </div>
                <div className="form-group">
                  <label>Tax ID / NPWP</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    placeholder="Tax identification"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
