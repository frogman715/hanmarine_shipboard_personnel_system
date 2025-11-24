'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';
import './risks.css';

interface Risk {
  id: number;
  type: 'RISK' | 'OPPORTUNITY';
  source: string;
  description: string;
  likelihood?: 'LOW' | 'MEDIUM' | 'HIGH';
  impact?: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore?: number;
  actions: string;
  responsiblePerson?: string;
  targetDate?: string;
  status: 'IDENTIFIED' | 'UNDER_TREATMENT' | 'COMPLETED' | 'MONITORING';
  residualRisk?: string;
  createdBy: string;
  createdAt: string;
}

export default function RiskManagementPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'RISK' | 'OPPORTUNITY'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'RISK',
    source: '',
    description: '',
    likelihood: 'MEDIUM',
    impact: 'MEDIUM',
    actions: '',
    responsiblePerson: '',
    targetDate: '',
    residualRisk: ''
  });

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await fetch('/api/qms/risks');
      if (response.ok) {
        const data = await response.json();
        setRisks(data);
      }
    } catch (error) {
      console.error('Error fetching risks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/qms/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: 'QMR' // TODO: Get from session
        })
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchRisks();
        alert('Risk/Opportunity added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add risk/opportunity');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add risk/opportunity');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'RISK',
      source: '',
      description: '',
      likelihood: 'MEDIUM',
      impact: 'MEDIUM',
      actions: '',
      responsiblePerson: '',
      targetDate: '',
      residualRisk: ''
    });
  };

  const calculateRiskScore = (likelihood?: string, impact?: string) => {
    const levelMap: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    if (!likelihood || !impact) return 0;
    return levelMap[likelihood] * levelMap[impact];
  };

  const getRiskScoreColor = (score?: number) => {
    if (!score) return 'gray';
    if (score >= 7) return '#dc2626'; // High risk
    if (score >= 4) return '#f59e0b'; // Medium risk
    return '#10b981'; // Low risk
  };

  const filteredRisks = risks.filter(risk => {
    const matchesType = filter === 'ALL' || risk.type === filter;
    const matchesStatus = statusFilter === 'ALL' || risk.status === statusFilter;
    return matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="risks-page">
        <div className="loading">Loading risk register...</div>
      </div>
    );
  }

  return (
    <div className="risks-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'QMS Dashboard', href: '/qms', icon: '📊' },
        { label: 'Risk Management', href: '/qms/risks', icon: '⚠️' }
      ]} />
      <div className="page-header">
        <div className="header-left">
          <h1>⚠️ Risk & Opportunity Management</h1>
          <p className="subtitle">ISO 9001:2015 Clause 6.1.2 - Actions to address risks and opportunities</p>
        </div>
        <div className="header-actions">
          <Link href="/qms" className="btn-secondary">
            ← Back to QMS
          </Link>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            ➕ Add Risk/Opportunity
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="ALL">All</option>
            <option value="RISK">⚠️ Risks Only</option>
            <option value="OPPORTUNITY">✨ Opportunities Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="IDENTIFIED">Identified</option>
            <option value="UNDER_TREATMENT">Under Treatment</option>
            <option value="COMPLETED">Completed</option>
            <option value="MONITORING">Monitoring</option>
          </select>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{filteredRisks.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Risks:</span>
            <span className="stat-value risk-count">
              {filteredRisks.filter(r => r.type === 'RISK').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Opportunities:</span>
            <span className="stat-value opportunity-count">
              {filteredRisks.filter(r => r.type === 'OPPORTUNITY').length}
            </span>
          </div>
        </div>
      </div>

      <div className="risk-table-container">
        <table className="risk-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No.</th>
              <th style={{ width: '80px' }}>Type</th>
              <th style={{ width: '150px' }}>Source</th>
              <th style={{ width: '200px' }}>Identification</th>
              <th style={{ width: '120px' }}>Analysis</th>
              <th style={{ width: '250px' }}>Actions</th>
              <th style={{ width: '120px' }}>Responsible</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '80px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredRisks.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  No risks or opportunities found. Click "+ Add Risk/Opportunity" to create one.
                </td>
              </tr>
            ) : (
              filteredRisks.map((risk, index) => (
                <tr key={risk.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className={`type-badge ${risk.type.toLowerCase()}`}>
                      {risk.type === 'RISK' ? '⚠️ Risk' : '✨ Opportunity'}
                    </span>
                  </td>
                  <td>{risk.source}</td>
                  <td className="description-cell">{risk.description}</td>
                  <td>
                    {risk.type === 'RISK' ? (
                      <div className="risk-analysis">
                        <div className="analysis-item">
                          <strong>L:</strong> {risk.likelihood || 'N/A'}
                        </div>
                        <div className="analysis-item">
                          <strong>I:</strong> {risk.impact || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <span className="opportunity-indicator">Opportunity</span>
                    )}
                  </td>
                  <td className="actions-cell">{risk.actions}</td>
                  <td>{risk.responsiblePerson || 'Not assigned'}</td>
                  <td>
                    <span className={`status-badge status-${risk.status.toLowerCase()}`}>
                      {risk.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {risk.type === 'RISK' ? (
                      <div 
                        className="risk-score"
                        style={{ 
                          backgroundColor: getRiskScoreColor(calculateRiskScore(risk.likelihood, risk.impact)),
                          color: 'white'
                        }}
                      >
                        {calculateRiskScore(risk.likelihood, risk.impact)}
                      </div>
                    ) : (
                      <span className="opportunity-score">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Risk or Opportunity</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Type *</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="RISK">⚠️ Risk</option>
                  <option value="OPPORTUNITY">✨ Opportunity</option>
                </select>
              </div>

              <div className="form-group">
                <label>Source of Risk/Opportunity *</label>
                <input
                  type="text"
                  placeholder="e.g., Internal audit, Customer feedback, Market analysis"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Identification *</label>
                <textarea
                  placeholder="Describe the risk or opportunity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {formData.type === 'RISK' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Likelihood *</label>
                    <select 
                      value={formData.likelihood}
                      onChange={(e) => setFormData({ ...formData, likelihood: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Impact *</label>
                    <select 
                      value={formData.impact}
                      onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Risk Score</label>
                    <div 
                      className="risk-score-display"
                      style={{ 
                        backgroundColor: getRiskScoreColor(
                          calculateRiskScore(formData.likelihood, formData.impact)
                        )
                      }}
                    >
                      {calculateRiskScore(formData.likelihood, formData.impact)}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Actions to Address *</label>
                <textarea
                  placeholder="Actions for eliminating/minimizing risks or pursuing opportunities..."
                  value={formData.actions}
                  onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Responsible Person</label>
                  <input
                    type="text"
                    placeholder="Name of responsible person"
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

              {formData.type === 'RISK' && (
                <div className="form-group">
                  <label>Residual Risk</label>
                  <textarea
                    placeholder="Remaining risk after actions are taken..."
                    value={formData.residualRisk}
                    onChange={(e) => setFormData({ ...formData, residualRisk: e.target.value })}
                    rows={2}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add {formData.type === 'RISK' ? 'Risk' : 'Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
