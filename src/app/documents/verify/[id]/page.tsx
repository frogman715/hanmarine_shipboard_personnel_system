"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Certificate = {
  id: number;
  crewId: number;
  type: string;
  issueDate: string | null;
  expiryDate: string | null;
  issuer: string | null;
  documentPath: string | null;
  remarks: string | null;
  crew: {
    id: number;
    fullName: string;
    crewCode: string | null;
    rank: string | null;
  };
};

export default function VerifyCertificatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState('');
  const [editIssueDate, setEditIssueDate] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editIssuer, setEditIssuer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [params.id]);

  async function fetchCertificate() {
    try {
      const res = await fetch(`/api/crew/${params.id}/certificates`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCertificate(data);
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/documents/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: params.id,
          verified,
          verificationNotes: notes
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to verify');
      }

      alert('✅ Certificate verification saved!');
      router.push('/documents');
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileUpload() {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('certificateId', params.id);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload');
      }

      alert('✅ Certificate image uploaded!');
      await fetchCertificate(); // Refresh to show new image
      setSelectedFile(null);
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  function handleStartEdit() {
    setIsEditing(true);
    setEditType(certificate?.type || '');
    setEditIssueDate(certificate?.issueDate || '');
    setEditExpiryDate(certificate?.expiryDate || '');
    setEditIssuer(certificate?.issuer || '');
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleSaveEdit() {
    setSaving(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(params.id),
          type: editType,
          issueDate: editIssueDate || null,
          expiryDate: editExpiryDate || null,
          issuer: editIssuer || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to update certificate');
      
      alert('✅ Certificate updated!');
      await fetchCertificate();
      setIsEditing(false);
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          Loading certificate...
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h2>Certificate not found</h2>
          <button
            onClick={() => router.push('/documents')}
            style={{
              marginTop: 20,
              padding: '10px 20px',
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Back to Documents
          </button>
        </div>
      </main>
    );
  }

  const daysUntilExpiry = certificate.expiryDate
    ? Math.floor((new Date(certificate.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => router.push('/documents')}
          style={{
            padding: '8px 16px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          ← Back to Documents
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: 30
      }}>
        <h1 style={{ margin: 0, marginBottom: 20 }}>Certificate Verification</h1>

        {/* Certificate Info */}
        <div style={{
          background: '#f8fafc',
          padding: 20,
          borderRadius: 8,
          marginBottom: 25,
          border: isEditing ? '2px solid #3b82f6' : '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Certificate Information</h2>
            {!isEditing && (
              <button
                onClick={handleStartEdit}
                style={{
                  padding: '6px 12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Crew Member</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {certificate.crew.fullName}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                  {certificate.crew.crewCode || 'No code'} • {certificate.crew.rank || 'No rank'}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                  Certificate Type *
                </label>
                <input
                  type="text"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                  No Certificate
                </label>
                <input
                  type="text"
                  value={editIssuer}
                  onChange={(e) => setEditIssuer(e.target.value)}
                  placeholder="e.g. 6201234567"
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 15 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={editIssueDate}
                    onChange={(e) => setEditIssueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div style={{ display: 'grid', gap: 15 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Crew Member</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {certificate.crew.fullName}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                  {certificate.crew.crewCode || 'No code'} • {certificate.crew.rank || 'No rank'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Certificate Type</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{certificate.type}</div>
              </div>

              {certificate.issuer && (
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>No Certificate</div>
                  <div style={{ fontSize: 14 }}>{certificate.issuer}</div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Issue Date</div>
                  <div style={{ fontSize: 14 }}>
                    {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Expiry Date</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {certificate.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString() : '-'}
                  </div>
                  {daysUntilExpiry !== null && (
                    <div style={{
                      fontSize: 12,
                      marginTop: 4,
                      color: daysUntilExpiry < 0 ? '#ef4444' : daysUntilExpiry <= 30 ? '#f59e0b' : '#10b981',
                      fontWeight: 600
                    }}>
                      {daysUntilExpiry < 0 ? '❌ EXPIRED' :
                       daysUntilExpiry <= 30 ? `🚨 ${daysUntilExpiry} days left` :
                       daysUntilExpiry <= 60 ? `⚠️ ${daysUntilExpiry} days left` :
                       `✅ ${daysUntilExpiry} days left`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Image Upload */}
        <div style={{
          background: '#f8fafc',
          padding: 20,
          borderRadius: 8,
          marginBottom: 25,
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 15 }}>Certificate Image</h2>
          
          {certificate.documentPath ? (
            <div>
              <img 
                src={certificate.documentPath} 
                alt="Certificate" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 8,
                  cursor: 'pointer',
                  marginBottom: 15
                }}
                onClick={() => window.open(certificate.documentPath!, '_blank')}
              />
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
                Click image to open in new tab
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: 40, 
              textAlign: 'center', 
              background: '#fff', 
              border: '2px dashed #cbd5e1',
              borderRadius: 8,
              marginBottom: 15
            }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📄</div>
              <div style={{ color: '#64748b' }}>No certificate image uploaded</div>
            </div>
          )}

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 15 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              {certificate.documentPath ? 'Replace Certificate Image' : 'Upload Certificate Image'}
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{
                  padding: 10,
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  flex: 1,
                  fontSize: 14
                }}
              />
              <button
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
                style={{
                  padding: '10px 20px',
                  background: selectedFile && !uploading ? '#10b981' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
              Supported formats: JPG, PNG, PDF (Max 10MB)
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div style={{ marginBottom: 25 }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 15,
            background: verified ? '#dcfce7' : '#f8fafc',
            borderRadius: 8,
            border: verified ? '2px solid #10b981' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {verified ? '✅ Certificate Verified' : 'Mark as Verified'}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                {verified ? 'Certificate has been verified and approved' : 'Check this box to verify the certificate'}
              </div>
            </div>
          </label>
        </div>

        <div style={{ marginBottom: 25 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
            Verification Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes about this certificate verification..."
            rows={4}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 14,
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={() => router.push('/documents')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: 'white',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={submitting}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: verified ? '#10b981' : '#0ea5e9',
              color: 'white',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              opacity: submitting ? 0.5 : 1
            }}
          >
            {submitting ? 'Saving...' : verified ? 'Save Verification' : 'Save'}
          </button>
        </div>
      </div>
    </main>
  );
}
