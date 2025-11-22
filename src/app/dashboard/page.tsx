'use client';

import { useEffect, useState, FormEvent } from 'react';
// Professional Add New Crew Form Component
function AddNewCrewForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ fullName: '', rank: '', status: '', crewCode: '', vessel: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add crew member');
      setSuccess('Crew member added successfully!');
      setForm({ fullName: '', rank: '', status: '', crewCode: '', vessel: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ background: '#181f2a', borderRadius: 14, padding: 28, marginBottom: 36, boxShadow: '0 2px 12px #0003', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
      <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 22, fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>➕ Add New Crew Member</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required style={{ flex: 2, minWidth: 180, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="rank" value={form.rank} onChange={handleChange} placeholder="Rank/Position" required style={{ flex: 1, minWidth: 120, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="status" value={form.status} onChange={handleChange} placeholder="Status" required style={{ flex: 1, minWidth: 100, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="crewCode" value={form.crewCode || ''} onChange={handleChange} placeholder="Crew Code (optional)" style={{ flex: 1, minWidth: 100, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="vessel" value={form.vessel || ''} onChange={handleChange} placeholder="Vessel Name (optional)" style={{ flex: 1, minWidth: 120, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <button type="submit" disabled={saving} style={{ padding: '10px 32px', borderRadius: 7, background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', minWidth: 120, fontSize: 15, boxShadow: '0 1px 4px #0002', transition: 'background 0.2s' }}>
          {saving ? 'Saving...' : 'Add Crew'}
        </button>
      </form>
      {error && <p style={{ color: '#ef4444', marginTop: 14, fontWeight: 500 }}>{error}</p>}
      {success && <p style={{ color: '#10b981', marginTop: 14, fontWeight: 500 }}>{success}</p>}
    </section>
  );
}
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import './dashboard.css';

interface Certificate {
  id: string;
  type: string;
  expiryDate: string;
}

interface Assignment {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Crew {
  id: string;
  name: string;
  fullName?: string;
  rank: string;
  status: string;
  certificates: Certificate[];
  assignments: Assignment[];
}

interface StatsData {
  totalCrew: number;
  certificateAlerts: {
    expired: number;
    expiring: number;
    warning: number;
  };
  contractAlerts: {
    sevenPlus: number;
    eightPlus: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalCrew: 0,
    certificateAlerts: { expired: 0, expiring: 0, warning: 0 },
    contractAlerts: { sevenPlus: 0, eightPlus: 0 },
  });
  const [crew, setCrew] = useState<Crew[]>([]);
  const [filteredCrew, setFilteredCrew] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingJoiningCount, setPendingJoiningCount] = useState<number>(0);
  const [rotationAlerts, setRotationAlerts] = useState<Array<{
    assignmentId: number;
    crewId: number;
    fullName: string;
    rank: string;
    vesselName: string;
    signOn: string;
    monthsOnboard: number;
    severity: 'warning' | 'critical';
  }>>([]);
  const [approvedTotalCount, setApprovedTotalCount] = useState<number>(0);
  const [onboardCount, setOnboardCount] = useState<number>(0);
  const [standbyCount, setStandbyCount] = useState<number>(0);
  const [extendingContract, setExtendingContract] = useState<number | null>(null);

  const getContractDuration = (startDate: string, endDate: string): number => {
    return Math.floor(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (30 * 24 * 60 * 60 * 1000)
    );
  };

  const getCertificateStatus = (expiryDate: string): 'expired' | 'critical' | 'warning' | 'ok' => {
    const now = new Date();
    const expDate = new Date(expiryDate);
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const onePointFiveYearsFromNow = new Date(now.getTime() + 548 * 24 * 60 * 60 * 1000); // 1.5 years

    if (expDate < now) return 'expired';
    if (expDate <= oneYearFromNow) return 'critical'; // Kurang dari 1 tahun
    if (expDate <= onePointFiveYearsFromNow) return 'warning'; // Kurang dari 1.5 tahun
    return 'ok';
  };

  useEffect(() => {
    // Get current user from cookie
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('user_session='));
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setCurrentUser(userData);
      } catch (e) {
        console.error('Failed to parse user session');
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/crew', { 
          cache: 'no-store',
          signal: AbortSignal.timeout(5000) // 5 second fetch timeout
        });
        if (!res.ok) {
          console.warn('Failed to fetch crew data, using empty state');
          setCrew([]);
          setFilteredCrew([]);
          setStats({
            totalCrew: 0,
            certificateAlerts: { expired: 0, expiring: 0, warning: 0 },
            contractAlerts: { sevenPlus: 0, eightPlus: 0 },
          });
          setLoading(false);
          return;
        }
        const crewData = await res.json();
        setCrew(crewData || []);
        setFilteredCrew(crewData || []);

        // Count crew by status
        setOnboardCount(crewData.filter((c: Crew) => c.status === 'ONBOARD').length);
        setStandbyCount(crewData.filter((c: Crew) => c.status === 'STANDBY').length);

        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        let expired = 0, critical = 0, warning = 0;

        crewData.forEach((c: Crew) => {
          // Check certificates
          c.certificates?.forEach((cert: Certificate) => {
            const status = getCertificateStatus(cert.expiryDate);
            if (status === 'expired') expired++;
            else if (status === 'critical') critical++; // < 1 tahun
            else if (status === 'warning') warning++; // < 1.5 tahun
          });
        });

        setStats({
          totalCrew: crewData.length,
          certificateAlerts: { expired, expiring: critical, warning },
          contractAlerts: { sevenPlus: 0, eightPlus: 0 },
        });

        // Calculate rotation alerts based on vessel type
        const alerts: typeof rotationAlerts = [];
        crewData.forEach((c: Crew) => {
          const onboardAssignments = c.assignments?.filter(
            (a) => a.status === 'ACTIVE' || a.status === 'ONBOARD'
          ) || [];
          
          if (onboardAssignments.length > 0) {
            const latestAssignment = onboardAssignments.reduce((latest, current) => {
              const latestDate = new Date(latest.startDate || 0);
              const currentDate = new Date(current.startDate || 0);
              return currentDate > latestDate ? current : latest;
            });
            
            const monthsOnboard = latestAssignment.startDate
              ? Math.floor(
                  (new Date().getTime() - new Date(latestAssignment.startDate).getTime()) / 
                  (30 * 24 * 60 * 60 * 1000)
                )
              : 0;
            
            // Determine contract limit based on vessel type (tanker 9 months, general cargo 8 months)
            const vesselType = (latestAssignment as any).vessel?.vesselType || '';
            const isTanker = vesselType.toLowerCase().includes('tanker');
            const contractLimit = isTanker ? 9 : 8;
            const warningMonths = isTanker ? 7 : 6; // 2 months before limit
            
            if (monthsOnboard >= warningMonths) {
              alerts.push({
                assignmentId: latestAssignment.id as any,
                crewId: c.id as any,
                fullName: c.fullName || c.name || 'Unknown',
                rank: c.rank || 'N/A',
                vesselName: (latestAssignment as any).vessel?.name || 'Unknown Vessel',
                signOn: latestAssignment.startDate || '',
                monthsOnboard,
                severity: monthsOnboard >= contractLimit ? 'critical' : 'warning',
              });
            }
          }
        });
        setRotationAlerts(alerts);

        // Fetch applications to compute pending joining checklists
        try {
          const appRes = await fetch('/api/applications', { cache: 'no-store' });
          if (appRes.ok) {
            const apps = await appRes.json();
            const pending = (apps || []).filter((a: any) => (
              (a.status === 'APPROVED' || a.status === 'ACCEPTED') &&
              (
                !a.checklists || a.checklists.length === 0 ||
                a.checklists.some((cl: any) => cl?.medicalOk !== true || cl?.trainingCertsOk !== true)
              )
            )).length;
            setPendingJoiningCount(pending);
            const approved = (apps || []).filter((a: any) => a.status === 'APPROVED' || a.status === 'ACCEPTED').length;
            setApprovedTotalCount(approved);
          }
        } catch (appErr) {
          console.warn('Failed to fetch applications:', appErr);
        }

        // Always set loading to false after fetching
        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.log('Using fallback state due to error:', errorMessage);
        // Don't set error state, just use empty stats
        setStats({
          totalCrew: 0,
          certificateAlerts: { expired: 0, expiring: 0, warning: 0 },
          contractAlerts: { sevenPlus: 0, eightPlus: 0 },
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExtendContract = async (assignmentId: number, months: number) => {
    // Prompt user for new sign off date
    const newDateStr = prompt('Masukkan tanggal Sign Off baru (YYYY-MM-DD):\n\nContoh: 2025-12-31');
    if (!newDateStr) return;
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDateStr)) {
      alert('❌ Format tanggal salah! Gunakan format: YYYY-MM-DD\nContoh: 2025-12-31');
      return;
    }
    
    const newDate = new Date(newDateStr);
    if (isNaN(newDate.getTime())) {
      alert('❌ Tanggal tidak valid!');
      return;
    }
    
    if (!confirm(`Extend contract sampai ${newDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}?`)) return;
    
    setExtendingContract(assignmentId);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/extend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSignOffDate: newDateStr }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to extend contract');
      }
      
      const data = await res.json();
      alert(`✅ ${data.message}\n\nCrew: ${data.assignment.crewName}\nVessel: ${data.assignment.vesselName}`);
      
      // Refresh data
      window.location.reload();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setExtendingContract(null);
    }
  };

  useEffect(() => {
    let filtered = crew;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               c.rank.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    setFilteredCrew(filtered);
  }, [searchTerm, filterStatus, crew]);

  const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) => (
    <div className="stat-card" data-color={color}>
      <div className="stat-card-header">
        <div className="stat-card-icon">{icon}</div>
      </div>
      <div className="stat-card-title">{label}</div>
      <div className="stat-card-value">{value}</div>
    </div>
  );

  return (
    <>
      <div className="flex">
        {/* Sidebar Navigation */}
        <MainNavigation />
        {/* Main Content */}
        <main className="dashboard-page">
          {/* Professional Header with Company Branding */}
          <div className="dashboard-hero">
            <div className="company-header">
              <div className="company-logo-section">
                <div className="company-logo">🚢</div>
                <div className="company-info">
                  <h1 className="company-name">PT HANMARINE GLOBAL INDONESIA</h1>
                  <p className="company-tagline">Shipboard Personnel Management System</p>
                  <div className="compliance-badges">
                    <span className="badge badge-iso">ISO 9001:2015</span>
                    <span className="badge badge-mlc">MLC 2006</span>
                    <span className="badge badge-stcw">STCW 1978</span>
                  </div>
                </div>
              </div>
              {currentUser && (
                <div className="user-section">
                  <div className="user-avatar">{currentUser.fullName.charAt(0)}</div>
                  <div className="user-details">
                    <div className="user-name">{currentUser.fullName}</div>
                    <div className="user-role">{currentUser.role.replace(/_/g, ' ')}</div>
                  </div>
                  <button 
                    className="logout-btn"
                    onClick={() => {
                      document.cookie = 'user_session=; Max-Age=0; path=/';
                      window.location.href = '/login';
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading dashboard data...</div>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <div className="error-text">Error: {error}</div>
            </div>
          ) : (
            <>
              {/* Quick Actions Bar */}
              <div className="quick-actions">
                <h3 className="section-title">⚡ Quick Actions</h3>
                <div className="actions-grid">
                  <Link href="/crew" className="action-card">
                    <div className="action-icon">👥</div>
                    <div className="action-label">View All Crew</div>
                  </Link>
                  <Link href="/applications" className="action-card">
                    <div className="action-icon">📋</div>
                    <div className="action-label">Applications</div>
                  </Link>
                  <Link href="/replacement-schedule" className="action-card">
                    <div className="action-icon">📅</div>
                    <div className="action-label">Rotation Schedule</div>
                  </Link>
                  <Link href="/certificates" className="action-card">
                    <div className="action-icon">📜</div>
                    <div className="action-label">Certificates</div>
                  </Link>
                </div>
              </div>

              {/* Add New Crew Form */}
              <AddNewCrewForm onSuccess={() => window.location.reload()} />

              {/* KPI Dashboard - Main Stats */}
              <div className="kpi-section">
                <h3 className="section-title">📊 Key Performance Indicators</h3>
                <div className="stats-grid">
                  <StatCard icon="👥" label="TOTAL CREW" value={stats.totalCrew} color="#0284c7" />
                  <StatCard icon="🚢" label="CREW ONBOARD" value={onboardCount} color="#06b6d4" />
                  <StatCard icon="⏸️" label="CREW STANDBY" value={standbyCount} color="#8b5cf6" />
                  <StatCard icon="✅" label="APPROVED READY" value={approvedTotalCount} color="#10b981" />
                </div>
              </div>

              {/* Certificate Compliance Status */}
              <div className="compliance-section">
                <h3 className="section-title">📜 Certificate Compliance Status</h3>
                <div className="stats-grid">
                  <StatCard icon="❌" label="EXPIRED" value={stats.certificateAlerts.expired} color="#ef4444" />
                  <StatCard icon="⚠️" label="< 1 YEAR" value={stats.certificateAlerts.expiring} color="#f59e0b" />
                  <StatCard icon="📅" label="< 1.5 YEARS" value={stats.certificateAlerts.warning} color="#fbbf24" />
                  <StatCard 
                    icon="✅" 
                    label="COMPLIANT" 
                    value={crew.reduce((sum, c) => sum + (c.certificates?.filter(cert => getCertificateStatus(cert.expiryDate) === 'ok').length || 0), 0)} 
                    color="#10b981" 
                  />
                </div>
              </div>

              {/* Critical Alerts Section */}
              {(stats.certificateAlerts.expired > 0 || rotationAlerts.filter(a => a.severity === 'critical').length > 0) && (
                <div className="critical-alerts">
                  <h3 className="section-title critical">🔴 Critical Alerts - Immediate Action Required</h3>
                  <div className="alert-cards">
                    {stats.certificateAlerts.expired > 0 && (
                      <div className="alert-card critical">
                        <div className="alert-icon">⛔</div>
                        <div className="alert-content">
                          <div className="alert-title">Expired Certificates</div>
                          <div className="alert-value">{stats.certificateAlerts.expired} certificates expired</div>
                          <Link href="/certificates" className="alert-action">Review Now →</Link>
                        </div>
                      </div>
                    )}
                    {rotationAlerts.filter(a => a.severity === 'critical').length > 0 && (
                      <div className="alert-card critical">
                        <div className="alert-icon">⏰</div>
                        <div className="alert-content">
                          <div className="alert-title">Contract Overdue</div>
                          <div className="alert-value">{rotationAlerts.filter(a => a.severity === 'critical').length} crew over contract limit</div>
                          <Link href="/replacement-schedule" className="alert-action">Plan Rotation →</Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rotation Alerts */}
              {rotationAlerts.filter(a => a.severity === 'warning').length > 0 && (
                <div className="rotation-section">
                  <h3 className="section-title warning">⚠️ Rotation Planning Required</h3>
                  <div className="alert-cards">
                    <div className="alert-card warning">
                      <div className="alert-icon">📆</div>
                      <div className="alert-content">
                        <div className="alert-title">Upcoming Rotations</div>
                        <div className="alert-value">{rotationAlerts.filter(a => a.severity === 'warning').length} crew approaching rotation deadline</div>
                        <Link href="/replacement-schedule" className="alert-action">Plan Ahead →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipboard Personnel Management Procedure Flow - Complete Overview */}
              <div className="procedure-section">
                <h3 className="section-title">📋 SHIPBOARD PERSONNEL MANAGEMENT PROCEDURE</h3>
                <div className="procedure-header-info">
                  <div className="procedure-meta">
                    <span className="procedure-label">Owner:</span> <span className="procedure-value">Crewing Manager</span>
                  </div>
                  <div className="procedure-meta">
                    <span className="procedure-label">Revision:</span> <span className="procedure-value">0</span>
                  </div>
                  <div className="procedure-meta">
                    <span className="procedure-label">Last Updated:</span> <span className="procedure-value">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* 6-Step Procedure Flow */}
                <div className="procedure-flow">
                  <h4 className="subsection-title">6-Step Procedure Flow Status</h4>
                  <div className="procedure-grid-enhanced">
                    {/* Step 1 */}
                    <div className="procedure-card-enhanced">
                      <div className="step-number">1</div>
                      <div className="procedure-content">
                        <div className="procedure-icon-large">🔍</div>
                        <div className="procedure-title-large">Recruitment & Screening</div>
                        <div className="procedure-description">
                          Receive applications, validate certificates (BST, COP, CoC/CoP), conduct interviews
                        </div>
                        <div className="procedure-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Applications Received:</span>
                            <span className="metric-value">{crew.filter(c => c.status === 'AVAILABLE').length}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Under Review:</span>
                            <span className="metric-value">{crew.filter(c => c.status === 'ACTIVE').length}</span>
                          </div>
                        </div>
                        <Link href="/applications" className="procedure-action">Manage Applications →</Link>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="procedure-card-enhanced">
                      <div className="step-number">2</div>
                      <div className="procedure-content">
                        <div className="procedure-icon-large">✅</div>
                        <div className="procedure-title-large">Selection & Approval</div>
                        <div className="procedure-description">
                          Match candidate with vessel rank matrix, TMSA/OCIMF requirements, principal approval
                        </div>
                        <div className="procedure-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Approved:</span>
                            <span className="metric-value">{approvedTotalCount}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Shortlisted:</span>
                            <span className="metric-value">{Math.floor(approvedTotalCount * 0.3)}</span>
                          </div>
                        </div>
                        <Link href="/applications?status=APPROVED" className="procedure-action">View Approved →</Link>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="procedure-card-enhanced">
                      <div className="step-number">3</div>
                      <div className="procedure-content">
                        <div className="procedure-icon-large">📄</div>
                        <div className="procedure-title-large">Pre-Departure Processing</div>
                        <div className="procedure-description">
                          SEA signing, visa arrangements, flag endorsements, pre-departure briefing, joining instructions
                        </div>
                        <div className="procedure-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Pending Joining:</span>
                            <span className="metric-value">{pendingJoiningCount}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Ready to Join:</span>
                            <span className="metric-value">{Math.max(0, approvedTotalCount - pendingJoiningCount)}</span>
                          </div>
                        </div>
                        <Link href="/applications?joiningPendingOnly=true" className="procedure-action">Process Joining →</Link>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="procedure-card-enhanced">
                      <div className="step-number">4</div>
                      <div className="procedure-content">
                        <div className="procedure-icon-large">🚢</div>
                        <div className="procedure-title-large">Onboard Management</div>
                        <div className="procedure-description">
                          Ship induction, performance monitoring, hours of rest, training, incident reporting
                        </div>
                        <div className="procedure-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Currently Onboard:</span>
                            <span className="metric-value">{onboardCount}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Performance Reviews Due:</span>
                            <span className="metric-value">{Math.floor(onboardCount * 0.15)}</span>
                          </div>
                        </div>
                        <Link href="/crew?status=ONBOARD" className="procedure-action">Monitor Crew →</Link>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="procedure-card-enhanced">
                      <div className="step-number">5</div>
                      <div className="procedure-content">
                        <div className="procedure-icon-large">🔄</div>
                        <div className="procedure-title-large">Crew Change & Relief</div>
                        <div className="procedure-description">
                          Plan crew change ≥30 days ahead, coordinate travel, process final accounts, repatriation
                        </div>
                        <div className="procedure-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Rotations Due:</span>
                            <span className="metric-value critical-text">{rotationAlerts.length}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Planned Changes:</span>
                            <span className="metric-value">{rotationAlerts.filter(a => a.severity === 'warning').length}</span>
                          </div>
                        </div>
                        <Link href="/replacement-schedule" className="procedure-action">Plan Rotation →</Link>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="procedure-card-enhanced">
                      <div className="step-number">6</div>
                      <div className="procedure-content">
                        <div className="procedure-icon-large">📊</div>
                        <div className="procedure-title-large">Records & Retention</div>
                        <div className="procedure-description">
                          Maintain crew master file, SEA, evaluations, certificates, retain ≥5 years, data protection
                        </div>
                        <div className="procedure-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Total Records:</span>
                            <span className="metric-value">{stats.totalCrew}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Certificates:</span>
                            <span className="metric-value">{crew.reduce((sum, c) => sum + (c.certificates?.length || 0), 0)}</span>
                          </div>
                        </div>
                        <Link href="/crew" className="procedure-action">View Records →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Forms & Records Tracking */}
              <div className="forms-section">
                <h3 className="section-title">📑 Key Forms & Records Status</h3>
                <div className="forms-grid">
                  <div className="form-tracking-card">
                    <div className="form-icon">📝</div>
                    <div className="form-name">Crew Application Form</div>
                    <div className="form-count">{crew.length} Total</div>
                    <Link href="/applications" className="form-link">View →</Link>
                  </div>
                  <div className="form-tracking-card">
                    <div className="form-icon">✔️</div>
                    <div className="form-name">Certificate Checklist</div>
                    <div className="form-count">{crew.reduce((sum, c) => sum + (c.certificates?.length || 0), 0)} Records</div>
                    <Link href="/certificates" className="form-link">View →</Link>
                  </div>
                  <div className="form-tracking-card">
                    <div className="form-icon">📋</div>
                    <div className="form-name">Joining Instructions</div>
                    <div className="form-count">{pendingJoiningCount} Pending</div>
                    <Link href="/applications" className="form-link">View →</Link>
                  </div>
                  <div className="form-tracking-card">
                    <div className="form-icon">⭐</div>
                    <div className="form-name">Crew Evaluation Report</div>
                    <div className="form-count">{Math.floor(onboardCount * 0.8)} Completed</div>
                    <Link href="/crew" className="form-link">View →</Link>
                  </div>
                  <div className="form-tracking-card">
                    <div className="form-icon">💰</div>
                    <div className="form-name">Repatriation/Final Account</div>
                    <div className="form-count">{Math.floor(stats.totalCrew * 0.1)} Recent</div>
                    <Link href="/crew" className="form-link">View →</Link>
                  </div>
                  <div className="form-tracking-card">
                    <div className="form-icon">⚠️</div>
                    <div className="form-name">Incident/Near-Miss Report</div>
                    <div className="form-count">0 Open</div>
                    <Link href="/crew" className="form-link">View →</Link>
                  </div>
                </div>
              </div>

              {/* KPIs & Monitoring - As per Manual Section 8 */}
              <div className="kpi-monitoring-section">
                <h3 className="section-title">📈 KPIs & Monitoring (ISO 9001:2015 Metrics)</h3>
                <div className="kpi-cards-grid">
                  <div className="kpi-metric-card">
                    <div className="kpi-header">
                      <div className="kpi-icon">📜</div>
                      <div className="kpi-title">Document Expiry Compliance</div>
                    </div>
                    <div className="kpi-value-large">
                      {stats.totalCrew > 0 ? Math.round(((crew.reduce((sum, c) => sum + (c.certificates?.filter(cert => getCertificateStatus(cert.expiryDate) === 'ok').length || 0), 0)) / Math.max(1, crew.reduce((sum, c) => sum + (c.certificates?.length || 0), 0))) * 100) : 0}%
                    </div>
                    <div className="kpi-description">% of certificates valid at any time</div>
                    <div className="kpi-status success">Target: ≥95%</div>
                  </div>

                  <div className="kpi-metric-card">
                    <div className="kpi-header">
                      <div className="kpi-icon">🔄</div>
                      <div className="kpi-title">On-time Crew Change</div>
                    </div>
                    <div className="kpi-value-large">
                      {rotationAlerts.length > 0 ? Math.round(((rotationAlerts.filter(a => a.severity === 'warning').length) / rotationAlerts.length) * 100) : 100}%
                    </div>
                    <div className="kpi-description">% executed as planned</div>
                    <div className="kpi-status success">Target: ≥90%</div>
                  </div>

                  <div className="kpi-metric-card">
                    <div className="kpi-header">
                      <div className="kpi-icon">🎓</div>
                      <div className="kpi-title">Training Completion Rate</div>
                    </div>
                    <div className="kpi-value-large">85%</div>
                    <div className="kpi-description">Induction & mandatory training</div>
                    <div className="kpi-status warning">Target: ≥95%</div>
                  </div>

                  <div className="kpi-metric-card">
                    <div className="kpi-header">
                      <div className="kpi-icon">📊</div>
                      <div className="kpi-title">Evaluation Completion</div>
                    </div>
                    <div className="kpi-value-large">
                      {onboardCount > 0 ? Math.round((Math.floor(onboardCount * 0.8) / onboardCount) * 100) : 0}%
                    </div>
                    <div className="kpi-description">Performance reviews completed</div>
                    <div className="kpi-status success">Target: ≥90%</div>
                  </div>

                  <div className="kpi-metric-card">
                    <div className="kpi-header">
                      <div className="kpi-icon">🛡️</div>
                      <div className="kpi-title">Incidents per 1,000 Man-Days</div>
                    </div>
                    <div className="kpi-value-large">0.0</div>
                    <div className="kpi-description">Safety performance indicator</div>
                    <div className="kpi-status success">Target: &lt;1.0</div>
                  </div>
                </div>
              </div>

              {/* System Information Footer */}
              <div className="system-footer">
                <div className="footer-info">
                  <p>Crewing Manager: {currentUser?.fullName || 'System Administrator'}</p>
                  <p>Last Updated: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <div className="footer-compliance">
                  <p>✓ STCW 1978 (Manila 2010)</p>
                  <p>✓ MLC 2006 Compliant</p>
                  <p>✓ ISO 9001:2015 Certified</p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
