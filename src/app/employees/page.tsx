'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import './employees.css';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: '',
    employmentType: 'REGULAR',
    basicSalary: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: 'Admin'
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchEmployees();
        // Reset form
        setFormData({
          employeeCode: '',
          fullName: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          hireDate: '',
          employmentType: 'REGULAR',
          basicSalary: ''
        });
      }
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { emoji: string; color: string; bg: string }> = {
      ACTIVE: { emoji: '✅', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      ON_LEAVE: { emoji: '🏖️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      SUSPENDED: { emoji: '⏸️', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
      RESIGNED: { emoji: '👋', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
      TERMINATED: { emoji: '🚫', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' }
    };
    const badge = badges[status] || badges.ACTIVE;
    return (
      <span className="status-badge" style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.color}` }}>
        {badge.emoji} {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      REGULAR: '#10b981',
      PROBATIONARY: '#f59e0b',
      CASUAL: '#6366f1',
      CONTRACT: '#8b5cf6'
    };
    return (
      <span className="type-badge" style={{ background: `${colors[type]}20`, color: colors[type], border: `1px solid ${colors[type]}` }}>
        {type}
      </span>
    );
  };

  const filteredEmployees = employees.filter((emp: any) => {
    if (filterStatus !== 'ALL' && emp.status !== filterStatus) return false;
    if (filterDepartment !== 'ALL' && emp.department !== filterDepartment) return false;
    return true;
  });

  const departments = ['ALL', ...new Set(employees.map((e: any) => e.department))];
  
  const stats = {
    total: employees.length,
    active: employees.filter((e: any) => e.status === 'ACTIVE').length,
    onLeave: employees.filter((e: any) => e.status === 'ON_LEAVE').length
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="employees-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { label: 'Employee Management', href: '/employees', icon: '👥' }
      ]} />
      
      <div className="page-header">
        <div className="header-left">
          <h1>👥 Employee Management</h1>
          <p className="subtitle">HGQS Management Guideline for Office Employees</p>
          <p className="subtitle">Performance Appraisal (HCF-AD-06) | Leave Management | Discipline Tracking</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📊 Performance Reviews</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add Employee
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Department:</label>
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="RESIGNED">Resigned</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active:</span>
            <span className="stat-value active-count">{stats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">On Leave:</span>
            <span className="stat-value leave-count">{stats.onLeave}</span>
          </div>
        </div>
      </div>

      <div className="employees-grid">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Employees Found</h3>
            <p>Add your first employee to start HR management.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ➕ Add First Employee
            </button>
          </div>
        ) : (
          filteredEmployees.map((employee: any) => (
            <div key={employee.id} className="employee-card">
              <div className="employee-header">
                <div className="employee-info">
                  <h3 className="employee-name">{employee.fullName}</h3>
                  <span className="employee-code">{employee.employeeCode}</span>
                </div>
                {getStatusBadge(employee.status)}
              </div>

              <div className="employee-details">
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span>{employee.email || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📞 Phone:</span>
                  <span>{employee.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">💼 Position:</span>
                  <span>{employee.position}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🏢 Department:</span>
                  <span>{employee.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Hire Date:</span>
                  <span>{new Date(employee.hireDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  {getEmploymentTypeBadge(employee.employmentType)}
                </div>
              </div>

              <div className="employee-actions">
                <button className="btn-action">👤 Profile</button>
                <button className="btn-action">📊 Performance</button>
                <button className="btn-action">📅 Leave</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Employee</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="info-box">
                <strong>Employee Management System:</strong><br/>
                Track employee information, performance appraisals (HCF-AD-06), leave management, and discipline records per HGQS Management Guideline.
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Employee Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
                    placeholder="EMP-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Full legal name"
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
                    placeholder="employee@hanmarine.com"
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

              <div className="form-row">
                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="e.g., Recruitment Officer"
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    <option value="Crewing">Crewing</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="QMS">QMS</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hire Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Employment Type *</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="PROBATIONARY">Probationary</option>
                    <option value="CASUAL">Casual</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Basic Salary (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                  placeholder="Monthly basic salary"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
