'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './cba.css';

export default function CBAPage() {
  const [cbas, setCbas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cbaCode: '',
    cbaTitle: '',
    shipOwner: '',
    union: '',
    flagState: '',
    effectiveDate: '',
    expirationDate: '',
    minimumWage: '',
    overtimeRate: '',
    leaveEntitlement: '2.5'
  });

  useEffect(() => {
    fetchCBAs();
  }, []);

  const fetchCBAs = async () => {
    try {
      const response = await fetch('/api/seafarers/cba');
      const data = await response.json();
      setCbas(data);
    } catch (error) {
      console.error('Error fetching CBAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/seafarers/cba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchCBAs();
        setFormData({
          cbaCode: '',
          cbaTitle: '',
          shipOwner: '',
          union: '',
          flagState: '',
          effectiveDate: '',
          expirationDate: '',
          minimumWage: '',
          overtimeRate: '',
          leaveEntitlement: '2.5'
        });
      }
    } catch (error) {
      console.error('Error creating CBA:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { emoji: string; color: string }> = {
      ACTIVE: { emoji: '✅', color: '#10b981' },
      EXPIRED: { emoji: '❌', color: '#dc2626' },
      UNDER_NEGOTIATION: { emoji: '🔄', color: '#f59e0b' },
      SUSPENDED: { emoji: '⏸️', color: '#6b7280' }
    };
    const badge = badges[status] || badges.ACTIVE;
    return (
      <span className="status-badge" style={{ color: badge.color, background: `${badge.color}20`, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getDaysUntilExpiry = (date: string) => {
    const expiry = new Date(date);
    const today = new Date();
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diff;
  };

  if (loading) {
    return <div className="loading">Loading CBAs...</div>;
  }

  return (
    <div className="cba-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'CBA Management', href: '/seafarers/cba', icon: '📜' }
      ]} />
      
      <div className="page-header">
        <div className="header-left">
          <h1>📜 Collective Bargaining Agreement (CBA)</h1>
          <p className="subtitle">MLC 2006 Compliant - Seafarers Rights & Employment Terms</p>
          <p className="subtitle">Manage wage structures, leave entitlements, and working conditions</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📊 CBA Report</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ New CBA
          </button>
        </div>
      </div>

      <div className="cba-grid">
        {cbas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <h3>No CBAs Found</h3>
            <p>Create your first Collective Bargaining Agreement.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Create First CBA
            </button>
          </div>
        ) : (
          cbas.map((cba: any) => {
            const daysLeft = getDaysUntilExpiry(cba.expirationDate);
            const isExpiringSoon = daysLeft > 0 && daysLeft <= 90;
            
            return (
              <div key={cba.id} className={`cba-card ${isExpiringSoon ? 'expiring-soon' : ''}`}>
                <div className="cba-header">
                  <div className="cba-code">{cba.cbaCode}</div>
                  {getStatusBadge(cba.status)}
                </div>

                <h3 className="cba-title">{cba.cbaTitle}</h3>

                <div className="cba-parties">
                  <div className="party-item">
                    <span className="party-label">🚢 Ship Owner:</span>
                    <span>{cba.shipOwner}</span>
                  </div>
                  {cba.union && (
                    <div className="party-item">
                      <span className="party-label">👥 Union:</span>
                      <span>{cba.union}</span>
                    </div>
                  )}
                  <div className="party-item">
                    <span className="party-label">🏴 Flag State:</span>
                    <span>{cba.flagState}</span>
                  </div>
                </div>

                <div className="cba-terms">
                  <div className="term-box">
                    <span className="term-label">💰 Min Wage</span>
                    <span className="term-value">${cba.minimumWage || 'N/A'}</span>
                  </div>
                  <div className="term-box">
                    <span className="term-label">⏰ OT Rate</span>
                    <span className="term-value">${cba.overtimeRate || 'N/A'}/hr</span>
                  </div>
                  <div className="term-box">
                    <span className="term-label">🏖️ Leave</span>
                    <span className="term-value">{cba.leaveEntitlement || '2.5'} days/mo</span>
                  </div>
                </div>

                <div className="cba-validity">
                  <div className="validity-dates">
                    <div>
                      <span className="validity-label">Effective:</span>
                      <span>{new Date(cba.effectiveDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="validity-label">Expires:</span>
                      <span>{new Date(cba.expirationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {daysLeft > 0 && (
                    <div className={`days-left ${isExpiringSoon ? 'warning' : ''}`}>
                      {daysLeft} days left
                    </div>
                  )}
                </div>

                {cba.mlcCompliant && (
                  <div className="mlc-badge">
                    ✓ MLC 2006 Compliant
                  </div>
                )}

                <div className="cba-actions">
                  <button className="btn-action">📄 View Details</button>
                  <button className="btn-action">📝 Edit</button>
                  <button className="btn-action">📊 Contracts</button>
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
              <h2>📜 New Collective Bargaining Agreement</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>MLC 2006 Compliance:</strong><br/>
                CBAs must comply with Maritime Labour Convention 2006, ensuring fair wages, working conditions, and seafarers' rights.
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CBA Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.cbaCode}
                    onChange={(e) => setFormData({...formData, cbaCode: e.target.value})}
                    placeholder="CBA-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label>CBA Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.cbaTitle}
                    onChange={(e) => setFormData({...formData, cbaTitle: e.target.value})}
                    placeholder="Ship Owner - Union Agreement"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ship Owner *</label>
                  <input
                    type="text"
                    required
                    value={formData.shipOwner}
                    onChange={(e) => setFormData({...formData, shipOwner: e.target.value})}
                    placeholder="Company name"
                  />
                </div>
                <div className="form-group">
                  <label>Union</label>
                  <input
                    type="text"
                    value={formData.union}
                    onChange={(e) => setFormData({...formData, union: e.target.value})}
                    placeholder="Union name (optional)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Flag State *</label>
                <input
                  type="text"
                  required
                  value={formData.flagState}
                  onChange={(e) => setFormData({...formData, flagState: e.target.value})}
                  placeholder="e.g., Panama, Liberia, Marshall Islands"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Effective Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Expiration Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Wage (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimumWage}
                    onChange={(e) => setFormData({...formData, minimumWage: e.target.value})}
                    placeholder="Monthly minimum wage"
                  />
                </div>
                <div className="form-group">
                  <label>Overtime Rate (USD/hour)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.overtimeRate}
                    onChange={(e) => setFormData({...formData, overtimeRate: e.target.value})}
                    placeholder="Hourly OT rate"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Leave Entitlement (days/month)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leaveEntitlement}
                  onChange={(e) => setFormData({...formData, leaveEntitlement: e.target.value})}
                  placeholder="2.5 (MLC 2006 standard)"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create CBA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
