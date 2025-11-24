"use client";

import { useState, useEffect } from 'react';

type StatusChangerProps = {
  crewId: number;
  currentStatus: string;
};

type TransitionData = {
  currentStatus: string;
  availableTransitions: string[];
  canTransition: boolean;
  userRole: string;
};

export default function StatusChanger({ crewId, currentStatus }: StatusChangerProps) {
  const [transitionData, setTransitionData] = useState<TransitionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransitions();
  }, [crewId]);

  async function fetchTransitions() {
    try {
      const res = await fetch(`/api/crew/${crewId}/status`);
      if (res.ok) {
        const data = await res.json();
        setTransitionData(data);
      }
    } catch (err) {
      console.error('Failed to fetch transitions:', err);
    }
  }

  async function handleStatusChange() {
    if (!selectedStatus) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/crew/${crewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: selectedStatus,
          reason: reason.trim() || undefined
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change status');
      }

      const result = await res.json();
      alert(`✅ Status changed from ${result.previousStatus} to ${result.newStatus}`);
      
      // Refresh page to show new status
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to change status');
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      APPLICANT: '#64748b',
      APPROVED: '#0ea5e9',
      STANDBY: '#10b981',
      ONBOARD: '#3b82f6',
      SIGN_OFF: '#f59e0b',
      VACATION: '#8b5cf6',
      EX_CREW: '#6b7280',
      BLACKLISTED: '#ef4444'
    };
    return colors[status] || '#94a3b8';
  }

  function getStatusLabel(status: string) {
    return status.replace(/_/g, ' ');
  }

  function requiresReason(status: string) {
    return ['EX_CREW', 'BLACKLISTED'].includes(status);
  }

  if (!transitionData || !transitionData.canTransition) {
    return null; // User doesn't have permission to change status
  }

  if (transitionData.availableTransitions.length === 0) {
    return null; // No available transitions
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '8px 12px',
          background: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        🔄 Change Status
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 30,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginTop: 0 }}>Change Crew Status</h2>

            <div style={{ marginBottom: 20 }}>
              <div style={{
                padding: 12,
                background: '#f8fafc',
                borderRadius: 8,
                marginBottom: 15
              }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Current Status</div>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: 4,
                  background: getStatusColor(transitionData.currentStatus),
                  color: 'white',
                  fontWeight: 600
                }}>
                  {getStatusLabel(transitionData.currentStatus)}
                </div>
              </div>

              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  fontSize: 14
                }}
              >
                <option value="">Select new status...</option>
                {transitionData.availableTransitions.map(status => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            {selectedStatus && requiresReason(selectedStatus) && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                  Reason (Required)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for status change..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    fontSize: 14,
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}

            {selectedStatus && !requiresReason(selectedStatus) && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    fontSize: 14,
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}

            {error && (
              <div style={{
                padding: 12,
                background: '#fee2e2',
                color: '#991b1b',
                borderRadius: 6,
                marginBottom: 15,
                fontSize: 14
              }}>
                {error}
              </div>
            )}

            <div style={{
              padding: 12,
              background: '#fef3c7',
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 20,
              border: '1px solid #fbbf24'
            }}>
              <strong>⚠️ Status Change Info:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                {selectedStatus === 'VACATION' && <li>Will set "Reported to Office" to YES</li>}
                {selectedStatus === 'SIGN_OFF' && <li>Will record last offboard date</li>}
                {selectedStatus === 'EX_CREW' && <li>Crew becomes inactive</li>}
                {selectedStatus === 'BLACKLISTED' && <li>⚠️ Crew will be banned from rehiring</li>}
                {selectedStatus === 'STANDBY' && transitionData.currentStatus === 'EX_CREW' && <li>Will clear inactive reason and reactivate crew</li>}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedStatus('');
                  setReason('');
                  setError('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={loading || !selectedStatus || (requiresReason(selectedStatus) && !reason.trim())}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading || !selectedStatus || (requiresReason(selectedStatus) && !reason.trim()) ? 'not-allowed' : 'pointer',
                  opacity: loading || !selectedStatus || (requiresReason(selectedStatus) && !reason.trim()) ? 0.5 : 1
                }}
              >
                {loading ? 'Changing...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
