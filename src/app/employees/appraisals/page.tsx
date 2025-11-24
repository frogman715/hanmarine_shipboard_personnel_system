'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './appraisals.css';

export default function AppraisalsPage() {
  const [appraisals, setAppraisals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    appraisalPeriod: '',
    appraisalDate: new Date().toISOString().split('T')[0],
    qualityOfWork: 3,
    productivity: 3,
    jobKnowledge: 3,
    reliability: 3,
    initiative: 3,
    teamwork: 3,
    strengths: '',
    areasForImprovement: '',
    goals: '',
    evaluatorName: '',
    evaluatorPosition: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appraisalsRes, employeesRes] = await Promise.all([
        fetch('/api/employees/appraisals'),
        fetch('/api/employees')
      ]);
      
      const [appraisalsData, employeesData] = await Promise.all([
        appraisalsRes.json(),
        employeesRes.json()
      ]);

      setAppraisals(appraisalsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = () => {
    const scores = [
      formData.qualityOfWork,
      formData.productivity,
      formData.jobKnowledge,
      formData.reliability,
      formData.initiative,
      formData.teamwork
    ];
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / 6).toFixed(2);
  };

  const getOverallRating = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const overallScore = parseFloat(calculateOverallScore());
      const overallRating = getOverallRating(overallScore);

      const response = await fetch('/api/employees/appraisals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          overallScore,
          overallRating
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating appraisal:', error);
    }
  };

  const getRatingBadge = (rating: string) => {
    const badges: Record<string, { color: string; emoji: string }> = {
      'Excellent': { color: '#10b981', emoji: '⭐' },
      'Good': { color: '#3b82f6', emoji: '👍' },
      'Satisfactory': { color: '#f59e0b', emoji: '✓' },
      'Needs Improvement': { color: '#ef4444', emoji: '⚠️' }
    };
    const badge = badges[rating] || badges['Satisfactory'];
    return (
      <span className="rating-badge" style={{ background: badge.color }}>
        {badge.emoji} {rating}
      </span>
    );
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e: any) => e.id === employeeId);
    return employee ? employee.fullName : 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading appraisals...</div>;
  }

  return (
    <div className="appraisals-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'Employee Management', href: '/employees', icon: '👥' },
        { label: 'Performance Appraisal', href: '/employees/appraisals', icon: '📊' }
      ]} />
      
      <div className="page-header">
        <div className="header-left">
          <h1>📊 Employee Performance Appraisal</h1>
          <p className="subtitle">Form HCF-AD-06 - Annual Performance Review System</p>
          <p className="subtitle">Evaluate employee performance across 6 key criteria</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📈 Performance Report</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ New Appraisal
          </button>
        </div>
      </div>

      <div className="appraisals-grid">
        {appraisals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Appraisals Found</h3>
            <p>Create your first performance appraisal.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Create First Appraisal
            </button>
          </div>
        ) : (
          appraisals.map((appraisal: any) => (
            <div key={appraisal.id} className="appraisal-card">
              <div className="appraisal-header">
                <div className="employee-info">
                  <h3 className="employee-name">👤 {getEmployeeName(appraisal.employeeId)}</h3>
                  <span className="appraisal-period">{appraisal.appraisalPeriod}</span>
                </div>
                {getRatingBadge(appraisal.overallRating)}
              </div>

              <div className="score-display">
                <div className="score-circle">
                  <span className="score-value">{appraisal.overallScore?.toFixed(1)}</span>
                  <span className="score-max">/5.0</span>
                </div>
              </div>

              <div className="criteria-grid">
                <div className="criterion-item">
                  <span className="criterion-label">Quality</span>
                  <span className="criterion-score">{appraisal.qualityOfWork}/5</span>
                </div>
                <div className="criterion-item">
                  <span className="criterion-label">Productivity</span>
                  <span className="criterion-score">{appraisal.productivity}/5</span>
                </div>
                <div className="criterion-item">
                  <span className="criterion-label">Knowledge</span>
                  <span className="criterion-score">{appraisal.jobKnowledge}/5</span>
                </div>
                <div className="criterion-item">
                  <span className="criterion-label">Reliability</span>
                  <span className="criterion-score">{appraisal.reliability}/5</span>
                </div>
                <div className="criterion-item">
                  <span className="criterion-label">Initiative</span>
                  <span className="criterion-score">{appraisal.initiative}/5</span>
                </div>
                <div className="criterion-item">
                  <span className="criterion-label">Teamwork</span>
                  <span className="criterion-score">{appraisal.teamwork}/5</span>
                </div>
              </div>

              <div className="appraisal-date">
                📅 Evaluated on: {new Date(appraisal.appraisalDate).toLocaleDateString()}
              </div>

              <div className="appraisal-actions">
                <button className="btn-action">📄 View Details</button>
                <button className="btn-action">📝 Edit</button>
                <button className="btn-action">📊 History</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 New Performance Appraisal (HCF-AD-06)</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>Performance Appraisal Guidelines:</strong><br/>
                Rate each criterion from 1 (Poor) to 5 (Excellent). Overall rating calculated automatically.
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Employee *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} - {emp.employeeCode}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Appraisal Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.appraisalPeriod}
                    onChange={(e) => setFormData({...formData, appraisalPeriod: e.target.value})}
                    placeholder="e.g., Q1 2024, Annual 2024"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Appraisal Date *</label>
                <input
                  type="date"
                  required
                  value={formData.appraisalDate}
                  onChange={(e) => setFormData({...formData, appraisalDate: e.target.value})}
                />
              </div>

              <div className="rating-section">
                <h3>Performance Criteria (1-5 scale)</h3>
                
                {[
                  { key: 'qualityOfWork', label: 'Quality of Work' },
                  { key: 'productivity', label: 'Productivity' },
                  { key: 'jobKnowledge', label: 'Job Knowledge' },
                  { key: 'reliability', label: 'Reliability' },
                  { key: 'initiative', label: 'Initiative' },
                  { key: 'teamwork', label: 'Teamwork' }
                ].map(({ key, label }) => (
                  <div key={key} className="rating-item">
                    <label>{label}</label>
                    <div className="rating-controls">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          className={`rating-btn ${formData[key as keyof typeof formData] === score ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, [key]: score})}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="score-preview">
                <strong>Overall Score:</strong> {calculateOverallScore()} / 5.0
                <span className="preview-rating">
                  {getRatingBadge(getOverallRating(parseFloat(calculateOverallScore())))}
                </span>
              </div>

              <div className="form-group">
                <label>Strengths</label>
                <textarea
                  rows={3}
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  placeholder="Key strengths and positive contributions..."
                />
              </div>

              <div className="form-group">
                <label>Areas for Improvement</label>
                <textarea
                  rows={3}
                  value={formData.areasForImprovement}
                  onChange={(e) => setFormData({...formData, areasForImprovement: e.target.value})}
                  placeholder="Areas that need development..."
                />
              </div>

              <div className="form-group">
                <label>Goals for Next Period</label>
                <textarea
                  rows={3}
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  placeholder="Objectives and targets..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Evaluator Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.evaluatorName}
                    onChange={(e) => setFormData({...formData, evaluatorName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Evaluator Position *</label>
                  <input
                    type="text"
                    required
                    value={formData.evaluatorPosition}
                    onChange={(e) => setFormData({...formData, evaluatorPosition: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
