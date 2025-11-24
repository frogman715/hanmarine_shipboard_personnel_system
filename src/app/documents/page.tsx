"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Certificate = {
  id: number;
  crewId: number;
  type: string;
  issueDate: string | null;
  expiryDate: string | null;
  issuer: string | null;
  documentPath: string | null;
  daysUntilExpiry: number | null;
  status: 'VALID' | 'WARNING' | 'CRITICAL' | 'EXPIRED' | 'NO_DATE';
  crew: {
    id: number;
    fullName: string;
    crewCode: string | null;
    rank: string | null;
    crewStatus: string;
  };
};

type Stats = {
  total: number;
  expired: number;
  critical: number;
  warning: number;
  valid: number;
  noDate: number;
};

export default function DocumentsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'EXPIRED' | 'CRITICAL' | 'WARNING'>('ALL');
  const [alertOnly, setAlertOnly] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, [alertOnly]);

  async function fetchCertificates() {
    setLoading(true);
    try {
      const url = alertOnly 
        ? '/api/documents/certificates?alertOnly=true&daysAhead=60'
        : '/api/documents/certificates';
      
      const res = await fetch(url);
      const data = await res.json();
      setCertificates(data.certificates);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'ALL') return true;
    return cert.status === filter;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      VALID: '#10b981',
      WARNING: '#f59e0b',
      CRITICAL: '#ef4444',
      EXPIRED: '#991b1b',
      NO_DATE: '#64748b'
    };
    return colors[status] || '#64748b';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; icon: string }> = {
      VALID: { label: 'Valid', icon: '✅' },
      WARNING: { label: 'Expiring Soon', icon: '⚠️' },
      CRITICAL: { label: 'Critical', icon: '🚨' },
      EXPIRED: { label: 'Expired', icon: '❌' },
      NO_DATE: { label: 'No Date', icon: '❓' }
    };
    return badges[status] || { label: status, icon: '❓' };
  };

  return (
    <main style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Document Management</h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          Certificate expiry tracking and verification
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 15,
          marginBottom: 25
        }}>
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              Total Certificates
            </div>
          </div>
          
          <div style={{
            background: '#fee2e2',
            padding: 20,
            borderRadius: 12,
            border: '2px solid #ef4444',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('EXPIRED')}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#991b1b' }}>
              {stats.expired}
            </div>
            <div style={{ fontSize: 13, color: '#991b1b', marginTop: 4, fontWeight: 600 }}>
              ❌ Expired
            </div>
          </div>

          <div style={{
            background: '#fef3c7',
            padding: 20,
            borderRadius: 12,
            border: '2px solid #f59e0b',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('CRITICAL')}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#92400e' }}>
              {stats.critical}
            </div>
            <div style={{ fontSize: 13, color: '#92400e', marginTop: 4, fontWeight: 600 }}>
              🚨 Critical (≤30d)
            </div>
          </div>

          <div style={{
            background: '#fef9c3',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #f59e0b',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('WARNING')}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#92400e' }}>
              {stats.warning}
            </div>
            <div style={{ fontSize: 13, color: '#92400e', marginTop: 4, fontWeight: 600 }}>
              ⚠️ Warning (≤60d)
            </div>
          </div>

          <div style={{
            background: '#dcfce7',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #10b981'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#166534' }}>
              {stats.valid}
            </div>
            <div style={{ fontSize: 13, color: '#166534', marginTop: 4, fontWeight: 600 }}>
              ✅ Valid
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 15,
        marginBottom: 20,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'EXPIRED', 'CRITICAL', 'WARNING'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: filter === f ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                background: filter === f ? '#e0f2fe' : 'white',
                color: filter === f ? '#0c4a6e' : '#64748b',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          marginLeft: 'auto'
        }}>
          <input
            type="checkbox"
            checked={alertOnly}
            onChange={(e) => setAlertOnly(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            Show Alerts Only (≤60 days)
          </span>
        </label>
      </div>

      {/* Certificates Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading certificates...
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
            No certificates found
          </div>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>
            Try adjusting your filters
          </div>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Crew
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Certificate Type
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Issue Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Expiry Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Days Left
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map(cert => {
                const badge = getStatusBadge(cert.status);
                return (
                  <tr key={cert.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/crew/${cert.crewId}`} style={{ textDecoration: 'none', color: '#0369a1', fontWeight: 700 }}>
                        {cert.crew.fullName}
                      </Link>
                      <div style={{ fontSize: 12, color: '#1e293b', marginTop: 2, fontWeight: 500 }}>
                        {cert.crew.crewCode || 'No code'} • {cert.crew.rank || 'No rank'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      {cert.type}
                      {cert.documentPath && (
                        <span style={{ marginLeft: 8, fontSize: 16 }} title="Has certificate image">
                          📎
                        </span>
                      )}
                      {cert.issuer && (
                        <div style={{ fontSize: 12, color: '#334155', marginTop: 2, fontWeight: 500 }}>
                          {cert.issuer}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                      {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700 }}>
                      {cert.daysUntilExpiry !== null ? (
                        <span style={{ color: getStatusColor(cert.status) }}>
                          {cert.daysUntilExpiry > 0 ? cert.daysUntilExpiry : '0'}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '5px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        background: `${getStatusColor(cert.status)}20`,
                        color: getStatusColor(cert.status),
                        border: `2px solid ${getStatusColor(cert.status)}40`
                      }}>
                        {badge.icon} {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Link href={`/documents/verify/${cert.id}`}>
                        <button style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: '1px solid #0ea5e9',
                          background: 'white',
                          color: '#0ea5e9',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>
                          Verify
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
