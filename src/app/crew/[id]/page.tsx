
import prisma from '@/lib/prisma';
import ChecklistForm from './ChecklistForm';
import StatusChanger from './StatusChanger';
import Breadcrumb from '@/components/Breadcrumb';
import './crew-detail.css';

function getStatusClass(status) {
  switch (status) {
    case 'Active':
      return 'active';
    case 'Inactive':
      return 'inactive';
    case 'Onboard':
      return 'onboard';
    default:
      return '';
  }
}

export default async function CrewDetailPage({ params }) {
  const crew = await prisma.crew.findUnique({
    where: { id: Number(params.id) },
    include: {
      checklists: true,
      certificates: true,
      seaServices: true,
      applications: true,
    },
  });
  if (!crew) return <main><h3>Crew not found</h3></main>;

  // Helper function to get certificate status
  const getCertStatus = (expiryDate: Date | null): string => {
    if (!expiryDate) return 'unknown';
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMonths = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (diffMonths < 0) return 'expired';
    if (diffMonths <= 3) return 'expiring-soon';
    return 'valid';
  };

  // Helper function to get status badge class
  const getStatusClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'active',
      'AVAILABLE': 'available',
      'ONBOARD': 'onboard',
      'UNAVAILABLE': 'unavailable',
    };
    return statusMap[status] || 'available';
  };

  return (
    <main>
      <div className="crew-detail-page">
        <div className="page-container">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-wrapper">
            <Breadcrumb
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Crew Management', href: '/crew' },
                { label: 'Crew List', href: '/crew' },
                { label: crew.fullName, href: `/crew/${crew.id}` },
              ]}
            />
          </div>

          <h1>
            <span className="icon">👤</span>
            {crew.fullName}
          </h1>
          {crew.crewCode && (
            <div className="crew-code">Crew Code: {crew.crewCode}</div>
          )}
          <div className="crew-meta">
            <div className="meta-item">
              <span className="icon">🎖️</span>
              <span className="meta-label">Rank:</span>
              <span className="meta-value">{crew.rank || 'Not specified'}</span>
            </div>
            <div className="meta-item">
              <span className="icon">🚢</span>
              <span className="meta-label">Vessel:</span>
              <span className="meta-value">{crew.vessel || 'Not assigned'}</span>
            </div>
            <div className="meta-item">
              <span className="icon">📧</span>
              <span className="meta-label">Email:</span>
              <span className="meta-value">{crew.email || 'Not provided'}</span>
            </div>
            <div className="meta-item">
              <span className="icon">📱</span>
              <span className="meta-label">Phone:</span>
              <span className="meta-value">{crew.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="action-buttons">
            <StatusChanger crewId={crew.id} currentStatus={crew.crewStatus} />
            <a href={`/api/crew/${crew.id}/cv-pdf`} download className="action-btn primary">
              <span className="icon">📄</span>
              Download CV (PDF)
            </a>
            <a href={`/crew/${crew.id}/edit`} className="action-btn secondary">
              <span className="icon">✏️</span>
              Edit Crew
            </a>
            <a href={`/crew/${crew.id}/joining-instruction`} className="action-btn primary">
              <span className="icon">📋</span>
              Joining Instruction
            </a>
            <a href={`/crew/${crew.id}/document-checklist`} className="action-btn warning">
              <span className="icon">📄</span>
              Document Checklist
            </a>
            <a href={`/crew/${crew.id}/sea-service`} className="action-btn secondary">
              <span className="icon">🌊</span>
              Sea Service
            </a>
            <a href={`/crew/${crew.id}/certificates`} className="action-btn secondary">
              <span className="icon">📜</span>
              Manage Certificates
            </a>
          </div>

          <div className="crew-status-badge">
            <div className={`status-badge ${getStatusClass(crew.crewStatus)}`}>{crew.crewStatus}</div>
          </div>

          {/* Onboard Forms Section */}
          {/* ...You can re-add the Onboard Forms and other sections here as needed... */}

          <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0 }}>Certificates</h3>
                  <a href={`/crew/${crew.id}/certificates/upload`} style={{ padding: '6px 12px', background: '#10b981', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}>➕ Upload</a>
                </div>
                {crew.certificates.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>Tidak ada certificate terdaftar.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {crew.certificates.map((cert) => (
                      <li key={cert.id} style={{ marginBottom: 6 }}>{cert.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <h3 style={{ marginBottom: 6 }}>Sea Service</h3>
                {crew.seaServices.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>Tidak ada sea service terdaftar.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {crew.seaServices.map((s) => (
                      <li key={s.id} style={{ marginBottom: 6 }}>
                        <strong>{s.vesselName}</strong> — {s.rank} ({s.signOn ? new Date(s.signOn).getFullYear() : 'unknown'})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3>Applications</h3>
                {crew.applications.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>Belum ada aplikasi.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {crew.applications.map((a) => (
                      <li key={a.id} style={{ marginBottom: 6 }}>
                        Rank: <strong>{a.appliedRank || 'unspecified'}</strong> on {a.applicationDate ? new Date(a.applicationDate).toLocaleDateString('id-ID') : 'unknown date'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <aside style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb', height: 'fit-content' }}>
              <ChecklistForm crewId={crew.id} />
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '2px solid rgba(255,255,255,0.2)' }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '1rem', fontWeight: 600 }}>📚 Recent Checklists</h4>
                {crew.checklists.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>No checklist saved yet</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.85rem', color: 'white' }}>
                    {crew.checklists.map((ch) => (
                      <li key={ch.id} style={{ marginBottom: 8, background: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 6 }}>
                        <strong>#{ch.id}</strong>: {ch.passportOk ? '✅ Passport' : '❌ Passport'} {ch.remarks ? `• ${ch.remarks.substring(0, 30)}...` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </section>
        </div>
<<<<<<< Updated upstream

        {/* Crew Header */}
        <div className="crew-header">
          <div className="crew-header-top">
            <div className="crew-main-info">
              <h1>
                <span className="icon">👤</span>
                {crew.fullName}
              </h1>
              
              {crew.crewCode && (
                <div className="crew-code">
                  Crew Code: {crew.crewCode}
                </div>
              )}
              
              <div className="crew-meta">
                <div className="meta-item">
                  <span className="icon">🎖️</span>
                  <span className="meta-label">Rank:</span>
                  <span className="meta-value">{crew.rank || 'Not specified'}</span>
                </div>
                <div className="meta-item">
                  <span className="icon">🚢</span>
                  <span className="meta-label">Vessel:</span>
                  <span className="meta-value">{crew.vessel || 'Not assigned'}</span>
                </div>
                <div className="meta-item">
                  <span className="icon">📧</span>
                  <span className="meta-label">Email:</span>
                  <span className="meta-value">{crew.email || 'Not provided'}</span>
                </div>
                <div className="meta-item">
                  <span className="icon">📱</span>
                  <span className="meta-label">Phone:</span>
                  <span className="meta-value">{crew.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <div className="action-buttons">
                <StatusChanger crewId={crew.id} currentStatus={crew.crewStatus} />
                <a 
                  href={`/api/crew/${crew.id}/cv-pdf`} 
                  download
                  className="action-btn primary"
                >
                  <span className="icon">📄</span>
                  Download CV (PDF)
                </a>
                <a href={`/crew/${crew.id}/edit`} className="action-btn secondary">
                  <span className="icon">✏️</span>
                  Edit Crew
                </a>
                <a href={`/crew/${crew.id}/joining-instruction`} className="action-btn primary">
                  <span className="icon">📋</span>
                  Joining Instruction
                </a>
                <a href={`/crew/${crew.id}/document-checklist`} className="action-btn warning">
                  <span className="icon">📄</span>
                  Document Checklist
                </a>
                <a href={`/crew/${crew.id}/sea-service`} className="action-btn secondary">
                  <span className="icon">🌊</span>
                  Sea Service
                </a>
                <a href={`/crew/${crew.id}/certificates`} className="action-btn secondary">
                  <span className="icon">📜</span>
                  Manage Certificates
                </a>
              </div>
            </div>
            
            <div className="crew-status-badge">
              <div className={`status-badge ${getStatusClass(crew.crewStatus)}`}>
                {crew.crewStatus}
              </div>
            </div>
          </div>
        </div>

      {/* Onboard Forms Section */}
      <details style={{ marginBottom: 24 }}>
        <summary style={{ padding: 16, background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem', color: '#134e4a' }}>
          📋 Onboard Forms
        </summary>
        
        <div style={{ marginTop: 12, padding: 16, background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 8 }}>
          <details style={{ marginBottom: 16 }}>
            <summary style={{ padding: 12, background: 'rgba(20, 184, 166, 0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '1rem', color: '#134e4a' }}>
              🚢 LUNDQVIST REDERIERNA (Tanker)
            </summary>
            
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              
              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(20, 184, 166, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0f766e' }}>Seafarer's Employment Contract</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/1.SEAFARER'S EMPLOYMENT CONTRACT.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/crew/${crew.id}/generate-form?form=lundqvist-contract`} style={{ flex: 1, padding: '8px 12px', background: '#14b8a6', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(20, 184, 166, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0f766e' }}>Next of Kin Declaration</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=lundqvist-nok`} style={{ flex: 1, padding: '8px 12px', background: '#14b8a6', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(20, 184, 166, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0f766e' }}>Lundqvist Rederierna Form</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/3.LUNDQVIST REDERIERNA.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=lundqvist-form`} style={{ flex: 1, padding: '8px 12px', background: '#14b8a6', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(20, 184, 166, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0f766e' }}>Medical History Checklist</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/3.MEDICAL HISTORY CHECKING LIST.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=lundqvist-medical`} style={{ flex: 1, padding: '8px 12px', background: '#14b8a6', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(20, 184, 166, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0f766e' }}>Checklist Penerimaan Dokumen (Excel)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/5.CHECK LIST PENERIMAAN DOCUMEN CREW.xls" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📊 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=lundqvist-checklist`} style={{ flex: 1, padding: '8px 12px', background: '#14b8a6', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

            </div>
          </details>

          <details>
            <summary style={{ padding: 12, background: 'rgba(6, 182, 212, 0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '1rem', color: '#134e4a' }}>
              🚢 INTERGIS CO, LTD
            </summary>
            
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              
              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0e7490' }}>Seafarer Employment Agreement</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/1.SEAFARER EMPLOYMENT AGREEMENT.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=intergis-contract`} style={{ flex: 1, padding: '8px 12px', background: '#06b6d4', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0e7490' }}>Next of Kin Declaration</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=intergis-nok`} style={{ flex: 1, padding: '8px 12px', background: '#06b6d4', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0e7490' }}>Medical History Checklist</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/3.MEDICAL HISTORY CHECKING LIST.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=intergis-medical`} style={{ flex: 1, padding: '8px 12px', background: '#06b6d4', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0e7490' }}>Report of General Education</div>
                <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/Report of General Education for Foreigner.doc" style={{ display: 'block', padding: '8px 12px', background: '#06b6d4', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Download</a>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0e7490' }}>Training Record (Excel)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/Training record INTERGIS.xlsx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📊 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=intergis-training-record`} style={{ flex: 1, padding: '8px 12px', background: '#06b6d4', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

              <div style={{ padding: 12, background: 'white', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#0e7490' }}>Training Schedule</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/Training Schedule for Foreigner.docx" style={{ flex: 1, padding: '8px 12px', background: '#94a3b8', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>📄 Template</a>
                  <a href={`/api/crew/${crew.id}/generate-form?form=intergis-training-schedule`} style={{ flex: 1, padding: '8px 12px', background: '#06b6d4', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>✨ Generate</a>
                </div>
              </div>

            </div>
          </details>
        </div>
      </details>

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 }}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Certificates</h3>
              <a 
                href={`/crew/${crew.id}/certificates/upload`}
                style={{ padding: '6px 12px', background: '#10b981', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}
              >
                ➕ Upload
              </a>
            </div>
            {crew.certificates.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>Tidak ada certificate terdaftar.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {crew.certificates.map((c) => (
                  <li key={c.id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{c.type}</strong> — exp: {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('id-ID') : 'No date'}
                      {c.documentPath && <span style={{ marginLeft: 8, color: '#10b981', fontSize: '0.85rem' }}>📎</span>}
                    </div>
                    {c.documentPath && (
                      <a 
                        href={c.documentPath} 
                        download 
                        style={{ padding: '2px 8px', background: '#0ea5e9', color: 'white', textDecoration: 'none', borderRadius: 3, fontSize: '0.75rem' }}
                      >
                        📥 Download
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <h3 style={{ marginBottom: 6 }}>Sea Service</h3>
            {crew.seaServices.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>Tidak ada sea service terdaftar.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {crew.seaServices.map((s) => (
                  <li key={s.id} style={{ marginBottom: 6 }}>
                    <strong>{s.vesselName}</strong> — {s.rank} ({s.signOn ? new Date(s.signOn).getFullYear() : 'unknown'})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3>Applications</h3>
            {crew.applications.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>Belum ada aplikasi.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {crew.applications.map((a) => (
                  <li key={a.id} style={{ marginBottom: 6 }}>
                    Rank: <strong>{a.appliedRank || 'unspecified'}</strong> on {a.applicationDate ? new Date(a.applicationDate).toLocaleDateString('id-ID') : 'unknown date'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb', height: 'fit-content' }}>
          <ChecklistForm crewId={crew.id} />

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '2px solid rgba(255,255,255,0.2)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '1rem', fontWeight: 600 }}>📚 Recent Checklists</h4>
            {crew.checklists.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>No checklist saved yet</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.85rem', color: 'white' }}>
                {crew.checklists.map((ch) => (
                  <li key={ch.id} style={{ marginBottom: 8, background: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 6 }}>
                    <strong>#{ch.id}</strong>: {ch.passportOk ? '✅ Passport' : '❌ Passport'} {ch.remarks ? `• ${ch.remarks.substring(0, 30)}...` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>
      </div>
    </div>
  )
=======
      </div>
    </main>
  );
>>>>>>> Stashed changes
}
