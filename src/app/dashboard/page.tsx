'use client';

import { useEffect, useState, FormEvent } from 'react';
// Komponen Formulir Add New Crew (profesional, modern, responsif)
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
      if (!res.ok) throw new Error('Gagal menambah crew');
      setSuccess('Crew berhasil ditambahkan!');
      setForm({ fullName: '', rank: '', status: '', crewCode: '', vessel: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ background: '#181f2a', borderRadius: 14, padding: 28, marginBottom: 36, boxShadow: '0 2px 12px #0003', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
      <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 22, fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>➕ Tambah Crew Baru</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nama Lengkap" required style={{ flex: 2, minWidth: 180, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="rank" value={form.rank} onChange={handleChange} placeholder="Rank/Jabatan" required style={{ flex: 1, minWidth: 120, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="status" value={form.status} onChange={handleChange} placeholder="Status" required style={{ flex: 1, minWidth: 100, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="crewCode" value={form.crewCode || ''} onChange={handleChange} placeholder="Crew Code (opsional)" style={{ flex: 1, minWidth: 100, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <input name="vessel" value={form.vessel || ''} onChange={handleChange} placeholder="Vessel/Kapal (opsional)" style={{ flex: 1, minWidth: 120, padding: 10, borderRadius: 7, border: '1px solid #334155', fontSize: 15 }} />
        <button type="submit" disabled={saving} style={{ padding: '10px 32px', borderRadius: 7, background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', minWidth: 120, fontSize: 15, boxShadow: '0 1px 4px #0002', transition: 'background 0.2s' }}>
          {saving ? 'Menyimpan...' : 'Tambah Crew'}
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
          {/* User Greeting */}
          {currentUser && (
            <div className="dashboard-header-top">
              <div className="user-greeting">
                <div className="user-avatar">{currentUser.fullName.charAt(0)}</div>
                <div className="user-info">
                  <h2>Welcome back, {currentUser.fullName}!</h2>
                  <p>{currentUser.role.replace(/_/g, ' ')} • {currentUser.email}</p>
                </div>
              </div>
              <button 
                className="logout-btn"
                onClick={() => {
                  document.cookie = 'user_session=; Max-Age=0; path=/';
                  window.location.href = '/login';
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
          {loading ? (
            <div className="loading-state">
              <div className="loading-icon">⏳</div>
              <div className="loading-text">Loading dashboard...</div>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <div className="error-text">Error: {error}</div>
            </div>
          ) : (
            <>
              {/* Tambah Crew Baru */}
              <AddNewCrewForm onSuccess={() => window.location.reload()} />
              <div className="stats-grid">
                <StatCard icon="👥" label="TOTAL CREW" value={stats.totalCrew} color="#0284c7" />
                <StatCard icon="🚢" label="CREW ONBOARD" value={onboardCount} color="#06b6d4" />
                <StatCard icon="⏸️" label="CREW STANDBY" value={standbyCount} color="#8b5cf6" />
                <StatCard icon="⚠️" label="CERT < 1 TAHUN" value={stats.certificateAlerts.expiring} color="#f59e0b" />
                <StatCard icon="📅" label="CERT < 1.5 TAHUN" value={stats.certificateAlerts.warning} color="#fbbf24" />
                <StatCard icon="❌" label="CERT EXPIRED" value={stats.certificateAlerts.expired} color="#ef4444" />
              </div>
              {/* ...rest of dashboard content remains unchanged... */}
              {/* ...existing code... */}
            </>
          )}
        </main>
      </div>
    </>
  );
}
