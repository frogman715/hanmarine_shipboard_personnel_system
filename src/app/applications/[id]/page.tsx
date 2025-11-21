"use client";

import React, { useEffect, useState } from 'react';

type Application = any;
type ApprovalChain = {
  level: number;
  role: string;
  status: string;
  date: string | null;
  comments: string | null;
};

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [approvalData, setApprovalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [approvalComments, setApprovalComments] = useState('');

  const id = params.id;

  useEffect(() => {
    fetchApplication();
    fetchApprovalStatus();
  }, [id]);

  async function fetchApplication() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications?crewId=${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const found = Array.isArray(data) ? data.find((a:any)=>String(a.id)===String(id)) || data[0] : data;
      setApplication(found || null);
    } catch (err:any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchApprovalStatus() {
    try {
      const res = await fetch(`/api/applications/${id}/approve`);
      if (res.ok) {
        const data = await res.json();
        setApprovalData(data);
      }
    } catch (err) {
      console.error('Failed to fetch approval status:', err);
    }
  }

  async function handleApproval() {
    if (!application) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: approvalAction,
          comments: approvalComments
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process approval');
      }
      
      const result = await res.json();
      alert(result.message);
      
      // Refresh data
      await fetchApplication();
      await fetchApprovalStatus();
      setShowApprovalModal(false);
      setApprovalComments('');
    } catch (err: any) {
      setError(err.message || 'Error processing approval');
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      PENDING: '#94a3b8',
      APPROVED: '#10b981',
      REJECTED: '#ef4444'
    };
    return colors[status] || '#94a3b8';
  }

  function getLevelIcon(level: number, currentLevel: number) {
    if (level < currentLevel) return '✅';
    if (level === currentLevel) return '⏳';
    return '⏸️';
  }

  if(loading && !application) return <div style={{padding:20}}>Loading...</div>;
  if(error) return <div style={{color:'red', padding:20}}>Error: {error}</div>;
  if(!application) return <div style={{padding:20}}>No application found.</div>;

  return (
    <div style={{padding:20, maxWidth:1200, margin:'0 auto'}}>
      <h1>Application #{application.id}</h1>
      
      <div style={{
        background: '#f8fafc',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        border: '1px solid #e2e8f0'
      }}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:15}}>
          <div>
            <div style={{fontSize:12, color:'#64748b', marginBottom:4}}>Crew Name</div>
            <div style={{fontWeight:600}}>{application.crew?.fullName || application.crewId}</div>
          </div>
          <div>
            <div style={{fontSize:12, color:'#64748b', marginBottom:4}}>Applied Rank</div>
            <div style={{fontWeight:600}}>{application.appliedRank}</div>
          </div>
          <div>
            <div style={{fontSize:12, color:'#64748b', marginBottom:4}}>Status</div>
            <div style={{
              display:'inline-block',
              padding:'4px 12px',
              borderRadius:4,
              fontSize:12,
              fontWeight:600,
              background: application.status === 'ACCEPTED' ? '#dcfce7' : 
                         application.status === 'REJECTED' ? '#fee2e2' : '#dbeafe',
              color: application.status === 'ACCEPTED' ? '#166534' : 
                    application.status === 'REJECTED' ? '#991b1b' : '#1e40af'
            }}>
              {application.status}
            </div>
          </div>
          <div>
            <div style={{fontSize:12, color:'#64748b', marginBottom:4}}>Application Date</div>
            <div>{application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : '-'}</div>
          </div>
        </div>
        
        {application.notes && (
          <div style={{marginTop:15, paddingTop:15, borderTop:'1px solid #e2e8f0'}}>
            <div style={{fontSize:12, color:'#64748b', marginBottom:4}}>Notes</div>
            <div>{application.notes}</div>
          </div>
        )}
      </div>

      {/* Approval Chain */}
      {approvalData && (
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 20,
          marginBottom: 20
        }}>
          <h2 style={{marginTop:0, marginBottom:20}}>Approval Chain</h2>
          
          <div style={{position:'relative'}}>
            {/* Timeline line */}
            <div style={{
              position:'absolute',
              left:15,
              top:25,
              bottom:25,
              width:2,
              background:'#e2e8f0'
            }}></div>
            
            {approvalData.approvalChain.map((approval: ApprovalChain, idx: number) => (
              <div key={approval.level} style={{
                position:'relative',
                paddingLeft:50,
                paddingBottom:30
              }}>
                {/* Timeline dot */}
                <div style={{
                  position:'absolute',
                  left:6,
                  top:8,
                  width:20,
                  height:20,
                  borderRadius:'50%',
                  background: getStatusColor(approval.status),
                  border: '3px solid white',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:10,
                  zIndex:1
                }}>
                  {approval.status === 'APPROVED' ? '✓' : 
                   approval.status === 'REJECTED' ? '✕' : 
                   approval.level === approvalData.application.currentApprovalLevel ? '⏳' : ''}
                </div>

                <div style={{
                  background: approval.level === approvalData.application.currentApprovalLevel ? '#f0f9ff' : '#f8fafc',
                  padding:15,
                  borderRadius:8,
                  border: approval.level === approvalData.application.currentApprovalLevel ? 
                    '2px solid #0ea5e9' : '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginBottom:8
                  }}>
                    <div>
                      <div style={{fontWeight:600, fontSize:14}}>{approval.role}</div>
                      <div style={{fontSize:12, color:'#64748b'}}>Level {approval.level}</div>
                    </div>
                    <div style={{
                      padding:'4px 10px',
                      borderRadius:4,
                      fontSize:11,
                      fontWeight:600,
                      background: getStatusColor(approval.status),
                      color: 'white'
                    }}>
                      {approval.status}
                    </div>
                  </div>
                  
                  {approval.date && (
                    <div style={{fontSize:12, color:'#64748b', marginBottom:4}}>
                      📅 {new Date(approval.date).toLocaleString()}
                    </div>
                  )}
                  
                  {approval.comments && (
                    <div style={{
                      marginTop:8,
                      padding:10,
                      background:'white',
                      borderRadius:4,
                      fontSize:13,
                      borderLeft:'3px solid #0ea5e9'
                    }}>
                      💬 {approval.comments}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Approval Action Button */}
          {approvalData.canApprove && (
            <div style={{
              marginTop:20,
              padding:15,
              background:'#fef3c7',
              borderRadius:8,
              border:'1px solid #fbbf24'
            }}>
              <div style={{fontWeight:600, marginBottom:10}}>
                ⚠️ Awaiting Your Approval
              </div>
              <div style={{fontSize:13, color:'#92400e', marginBottom:15}}>
                You are authorized to approve/reject this application at Level {approvalData.application.currentApprovalLevel}
              </div>
              <button 
                onClick={() => setShowApprovalModal(true)}
                style={{
                  padding:'10px 20px',
                  borderRadius:6,
                  background:'#0ea5e9',
                  color:'white',
                  fontWeight:600,
                  border:'none',
                  cursor:'pointer'
                }}
              >
                Process Approval
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interview Section */}
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 20
      }}>
        <h3 style={{marginTop:0}}>Interview Information</h3>
        <div style={{display:'grid', gap:10}}>
          <div>
            <strong>Date:</strong> {application.interviewDate ? new Date(application.interviewDate).toLocaleString() : '-'}
          </div>
          <div>
            <strong>Notes:</strong> {application.interviewNotes || '-'}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000
        }}>
          <div style={{
            background:'white',
            borderRadius:12,
            padding:30,
            maxWidth:500,
            width:'90%',
            maxHeight:'90vh',
            overflow:'auto'
          }}>
            <h2 style={{marginTop:0}}>Process Application</h2>
            
            <div style={{marginBottom:20}}>
              <div style={{fontWeight:600, marginBottom:8}}>Decision</div>
              <div style={{display:'flex', gap:10}}>
                <button
                  onClick={() => setApprovalAction('APPROVED')}
                  style={{
                    flex:1,
                    padding:12,
                    borderRadius:6,
                    border: approvalAction === 'APPROVED' ? '2px solid #10b981' : '1px solid #e2e8f0',
                    background: approvalAction === 'APPROVED' ? '#dcfce7' : 'white',
                    color: approvalAction === 'APPROVED' ? '#166534' : '#64748b',
                    fontWeight:600,
                    cursor:'pointer'
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setApprovalAction('REJECTED')}
                  style={{
                    flex:1,
                    padding:12,
                    borderRadius:6,
                    border: approvalAction === 'REJECTED' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    background: approvalAction === 'REJECTED' ? '#fee2e2' : 'white',
                    color: approvalAction === 'REJECTED' ? '#991b1b' : '#64748b',
                    fontWeight:600,
                    cursor:'pointer'
                  }}
                >
                  ✕ Reject
                </button>
              </div>
            </div>

            <div style={{marginBottom:20}}>
              <label style={{display:'block', fontWeight:600, marginBottom:8}}>
                Comments {approvalAction === 'REJECTED' && '(Required)'}
              </label>
              <textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Enter your comments or reason..."
                rows={4}
                style={{
                  width:'100%',
                  padding:10,
                  borderRadius:6,
                  border:'1px solid #e2e8f0',
                  fontSize:14,
                  fontFamily:'inherit'
                }}
              />
            </div>

            <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComments('');
                }}
                style={{
                  padding:'10px 20px',
                  borderRadius:6,
                  border:'1px solid #e2e8f0',
                  background:'white',
                  cursor:'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApproval}
                disabled={loading || (approvalAction === 'REJECTED' && !approvalComments.trim())}
                style={{
                  padding:'10px 20px',
                  borderRadius:6,
                  background: approvalAction === 'APPROVED' ? '#10b981' : '#ef4444',
                  color:'white',
                  fontWeight:600,
                  border:'none',
                  cursor: loading || (approvalAction === 'REJECTED' && !approvalComments.trim()) ? 'not-allowed' : 'pointer',
                  opacity: loading || (approvalAction === 'REJECTED' && !approvalComments.trim()) ? 0.5 : 1
                }}
              >
                {loading ? 'Processing...' : `Confirm ${approvalAction === 'APPROVED' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
