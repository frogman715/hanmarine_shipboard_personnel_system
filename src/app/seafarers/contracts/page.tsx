'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './contracts.css';

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [crew, setCrew] = useState([]);
  const [cbas, setCbas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    contractNumber: '',
    crewId: '',
    vesselName: '',
    rank: '',
    signOnDate: '',
    signOffDate: '',
    basicWage: '',
    fixedOvertime: '',
    currency: 'USD',
    leavePerMonth: '2.5',
    cbaId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contractsRes, crewRes, cbasRes] = await Promise.all([
        fetch('/api/seafarers/contracts'),
        fetch('/api/crew'),
        fetch('/api/seafarers/cba')
      ]);
      
      const [contractsData, crewData, cbasData] = await Promise.all([
        contractsRes.json(),
        crewRes.json(),
        cbasRes.json()
      ]);

      setContracts(contractsData);
      setCrew(crewData);
      setCbas(cbasData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalWage = (parseFloat(formData.basicWage) || 0) + (parseFloat(formData.fixedOvertime) || 0);
      
      const response = await fetch('/api/seafarers/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalWage
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchData();
        setFormData({
          contractNumber: '',
          crewId: '',
          vesselName: '',
          rank: '',
          signOnDate: '',
          signOffDate: '',
          basicWage: '',
          fixedOvertime: '',
          currency: 'USD',
          leavePerMonth: '2.5',
          cbaId: ''
        });
      }
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { emoji: string; color: string }> = {
      ACTIVE: { emoji: '✅', color: '#10b981' },
      COMPLETED: { emoji: '✓', color: '#6b7280' },
      TERMINATED: { emoji: '❌', color: '#dc2626' },
      EXTENDED: { emoji: '↗️', color: '#f59e0b' }
    };
    const badge = badges[status] || badges.ACTIVE;
    return (
      <span className="status-badge" style={{ color: badge.color, background: `${badge.color}20`, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status}
      </span>
    );
  };

  const calculateDuration = (signOn: string, signOff: string) => {
    const start = new Date(signOn);
    const end = new Date(signOff);
    const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 30));
    return months;
  };

  const getCrewName = (crewId: string) => {
    const crewMember = crew.find((c: any) => c.id === crewId);
    return crewMember ? crewMember.fullName : 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading contracts...</div>;
  }

  return (
    <div className="contracts-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'Seafarer Contracts', href: '/seafarers/contracts', icon: '📋' }
      ]} />
      
      <div className="page-header">
        <div className="header-left">
          <h1>📋 Seafarer Employment Contracts</h1>
          <p className="subtitle">MLC 2006 Compliant - Contract Management & Wage Calculation</p>
          <p className="subtitle">Track sign-on/off dates, wages, leave accrual, and contract status</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📊 Contract Report</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ New Contract
          </button>
        </div>
      </div>

      <div className="contracts-grid">
        {contracts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Contracts Found</h3>
            <p>Create your first seafarer employment contract.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Create First Contract
            </button>
          </div>
        ) : (
          contracts.map((contract: any) => {
            const duration = calculateDuration(contract.signOnDate, contract.signOffDate);
            const crewName = getCrewName(contract.crewId);
            
            return (
              <div key={contract.id} className="contract-card">
                <div className="contract-header">
                  <div className="contract-number">{contract.contractNumber}</div>
                  {getStatusBadge(contract.status)}
                </div>

                <div className="crew-info">
                  <h3 className="crew-name">👤 {crewName}</h3>
                  <div className="crew-details">
                    <span className="rank-badge">{contract.rank}</span>
                    <span className="vessel-name">🚢 {contract.vesselName}</span>
                  </div>
                </div>

                <div className="contract-dates">
                  <div className="date-box">
                    <span className="date-label">Sign On</span>
                    <span className="date-value">{new Date(contract.signOnDate).toLocaleDateString()}</span>
                  </div>
                  <div className="duration-arrow">
                    <span>{duration} months</span>
                  </div>
                  <div className="date-box">
                    <span className="date-label">Sign Off</span>
                    <span className="date-value">{new Date(contract.signOffDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="wage-info">
                  <div className="wage-breakdown">
                    <div className="wage-item">
                      <span className="wage-label">💰 Basic Wage</span>
                      <span className="wage-value">${contract.basicWage?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="wage-operator">+</div>
                    <div className="wage-item">
                      <span className="wage-label">⏰ Fixed OT</span>
                      <span className="wage-value">${contract.fixedOvertime?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="wage-operator">=</div>
                    <div className="wage-item total">
                      <span className="wage-label">📊 Total Wage</span>
                      <span className="wage-value total-value">${contract.totalWage?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                  <div className="currency-badge">{contract.currency}</div>
                </div>

                <div className="leave-info">
                  <div className="leave-item">
                    <span className="leave-label">🏖️ Leave/Month:</span>
                    <span className="leave-value">{contract.leavePerMonth || 2.5} days</span>
                  </div>
                  <div className="leave-item">
                    <span className="leave-label">📅 Total Accrued:</span>
                    <span className="leave-value accent">{contract.accruedLeave || 0} days</span>
                  </div>
                </div>

                {contract.mlcCompliant && (
                  <div className="mlc-badge">✓ MLC 2006 Compliant</div>
                )}

                <div className="contract-actions">
                  <button className="btn-action">📄 View Details</button>
                  <button className="btn-action">📝 Edit</button>
                  <button className="btn-action">💰 Wages</button>
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
              <h2>📋 New Seafarer Contract</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>MLC 2006 Compliance:</strong><br/>
                Employment contracts must specify wages, hours of work, leave entitlements, and repatriation rights.
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contract Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                    placeholder="CTR-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label>Crew Member *</label>
                  <select
                    required
                    value={formData.crewId}
                    onChange={(e) => setFormData({...formData, crewId: e.target.value})}
                  >
                    <option value="">Select crew member</option>
                    {crew.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.fullName} - {c.crewCode}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vessel Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vesselName}
                    onChange={(e) => setFormData({...formData, vesselName: e.target.value})}
                    placeholder="Enter vessel name"
                  />
                </div>
                <div className="form-group">
                  <label>Rank *</label>
                  <input
                    type="text"
                    required
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    placeholder="e.g., Captain, Chief Engineer"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sign On Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.signOnDate}
                    onChange={(e) => setFormData({...formData, signOnDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Sign Off Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.signOffDate}
                    onChange={(e) => setFormData({...formData, signOffDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Basic Wage (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.basicWage}
                    onChange={(e) => setFormData({...formData, basicWage: e.target.value})}
                    placeholder="Monthly basic wage"
                  />
                </div>
                <div className="form-group">
                  <label>Fixed Overtime (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fixedOvertime}
                    onChange={(e) => setFormData({...formData, fixedOvertime: e.target.value})}
                    placeholder="Monthly fixed OT"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Leave Per Month (days)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.leavePerMonth}
                    onChange={(e) => setFormData({...formData, leavePerMonth: e.target.value})}
                    placeholder="2.5 (MLC standard)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Linked CBA (Optional)</label>
                <select
                  value={formData.cbaId}
                  onChange={(e) => setFormData({...formData, cbaId: e.target.value})}
                >
                  <option value="">No CBA</option>
                  {cbas.map((cba: any) => (
                    <option key={cba.id} value={cba.id}>{cba.cbaCode} - {cba.cbaTitle}</option>
                  ))}
                </select>
              </div>

              <div className="wage-preview">
                <strong>💰 Total Wage:</strong> $
                {((parseFloat(formData.basicWage) || 0) + (parseFloat(formData.fixedOvertime) || 0)).toFixed(2)}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
