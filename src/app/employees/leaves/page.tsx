'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import './leaves.css';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: '',
    medicalCertAttached: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, employeesRes] = await Promise.all([
        fetch('/api/employees/leaves'),
        fetch('/api/employees')
      ]);
      
      const [leavesData, employeesData] = await Promise.all([
        leavesRes.json(),
        employeesRes.json()
      ]);

      setLeaves(leavesData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  useEffect(() => {
    const days = calculateDays(formData.startDate, formData.endDate);
    setFormData(prev => ({ ...prev, totalDays: days }));
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchData();
        setFormData({
          employeeId: '',
          leaveType: 'ANNUAL',
          startDate: '',
          endDate: '',
          totalDays: 0,
          reason: '',
          medicalCertAttached: false
        });
      }
    } catch (error) {
      console.error('Error creating leave:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { emoji: string; color: string }> = {
      PENDING: { emoji: '⏳', color: '#f59e0b' },
      APPROVED: { emoji: '✅', color: '#10b981' },
      REJECTED: { emoji: '❌', color: '#ef4444' },
      CANCELLED: { emoji: '🚫', color: '#6b7280' }
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className="status-badge" style={{ color: badge.color, background: `${badge.color}20`, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status}
      </span>
    );
  };

  const getLeaveTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      SICK: '🤒',
      EMERGENCY: '🚨',
      BEREAVEMENT: '🕊️',
      ANNUAL: '🏖️',
      UNPAID: '📝',
      MATERNITY: '👶',
      PATERNITY: '👨‍👶'
    };
    return icons[type] || '📝';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee: any = employees.find((e: any) => e.id === employeeId);
    return employee ? employee.fullName : 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading leaves...</div>;
  }

  return (
    <div className="leaves-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'Employee Management', href: '/employees', icon: '👥' },
        { label: 'Leave Management', href: '/employees/leaves', icon: '📅' }
      ]} />
      
      <div className="page-header">
        <div className="header-left">
          <h1>📅 Employee Leave Management</h1>
          <p className="subtitle">Track and approve employee leave requests</p>
          <p className="subtitle">Annual, Sick, Emergency, Bereavement, and Special Leaves</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📊 Leave Report</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ New Leave Request
          </button>
        </div>
      </div>

      <div className="leaves-grid">
        {leaves.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Leave Requests Found</h3>
            <p>Create your first leave request.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Create First Leave Request
            </button>
          </div>
        ) : (
          leaves.map((leave: any) => (
            <div key={leave.id} className="leave-card">
              <div className="leave-header">
                <div className="leave-type">
                  <span className="type-icon">{getLeaveTypeIcon(leave.leaveType)}</span>
                  <span className="type-name">{leave.leaveType.replace(/_/g, ' ')}</span>
                </div>
                {getStatusBadge(leave.status)}
              </div>

              <div className="employee-info">
                <h3 className="employee-name">👤 {getEmployeeName(leave.employeeId)}</h3>
              </div>

              <div className="leave-dates">
                <div className="date-item">
                  <span className="date-label">Start Date</span>
                  <span className="date-value">{new Date(leave.startDate).toLocaleDateString()}</span>
                </div>
                <div className="duration-badge">
                  <span className="duration-days">{leave.totalDays}</span>
                  <span className="duration-label">days</span>
                </div>
                <div className="date-item">
                  <span className="date-label">End Date</span>
                  <span className="date-value">{new Date(leave.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {leave.reason && (
                <div className="leave-reason">
                  <strong>Reason:</strong> {leave.reason}
                </div>
              )}

              {leave.medicalCertAttached && (
                <div className="medical-cert-badge">
                  📋 Medical Certificate Attached
                </div>
              )}

              {leave.approvedBy && (
                <div className="approval-info">
                  <div className="approval-item">
                    <span>✓ Approved by:</span>
                    <strong>{leave.approvedBy}</strong>
                  </div>
                  <div className="approval-date">
                    {new Date(leave.approvalDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="leave-actions">
                <button className="btn-action">📄 View Details</button>
                {leave.status === 'PENDING' && (
                  <>
                    <button className="btn-action approve">✅ Approve</button>
                    <button className="btn-action reject">❌ Reject</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 New Leave Request</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>Leave Request Guidelines:</strong><br/>
                Medical certificate required for sick leave exceeding 3 days. Annual leave requires 2 weeks notice.
              </div>

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
                <label>Leave Type *</label>
                <select
                  required
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                >
                  <option value="ANNUAL">🏖️ Annual Leave</option>
                  <option value="SICK">🤒 Sick Leave</option>
                  <option value="EMERGENCY">🚨 Emergency Leave</option>
                  <option value="BEREAVEMENT">🕊️ Bereavement Leave</option>
                  <option value="MATERNITY">👶 Maternity Leave</option>
                  <option value="PATERNITY">👨‍👶 Paternity Leave</option>
                  <option value="UNPAID">📝 Unpaid Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="days-display">
                <strong>Total Days:</strong> {formData.totalDays} days
              </div>

              <div className="form-group">
                <label>Reason *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Explain the reason for leave..."
                />
              </div>

              {formData.leaveType === 'SICK' && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.medicalCertAttached}
                      onChange={(e) => setFormData({...formData, medicalCertAttached: e.target.checked})}
                    />
                    <span>Medical Certificate Attached</span>
                  </label>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
