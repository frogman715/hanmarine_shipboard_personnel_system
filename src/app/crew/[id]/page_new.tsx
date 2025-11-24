import prisma from '@/lib/prisma'
import ChecklistForm from './ChecklistForm'
import StatusChanger from './StatusChanger'
import Breadcrumb from '@/components/Breadcrumb'
import './crew-detail.css'

type Props = { params: { id: string } }

export default async function CrewDetail({ params }: Props) {
  const id = Number(params.id)
  if (isNaN(id)) return <main><h3>Invalid crew ID</h3></main>

  const crew = await prisma.crew.findUnique({
    where: { id },
    include: {
      certificates: true,
      seaServices: true,
      applications: { orderBy: { applicationDate: 'desc' } },
      checklists: { orderBy: { id: 'desc' } },
    },
  })

  if (!crew) return <main><h3>Crew not found</h3></main>

  // Helper function to get certificate status
  const getCertStatus = (expiryDate: Date | null) => {
    if (!expiryDate) return 'unknown'
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffMonths = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    
    if (diffMonths < 0) return 'expired'
    if (diffMonths <= 3) return 'expiring-soon'
    return 'valid'
  }

  // Helper function to get status badge class
  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'active',
      'AVAILABLE': 'available',
      'ONBOARD': 'onboard',
      'UNAVAILABLE': 'unavailable',
    }
    return statusMap[status] || 'available'
  }

  return (
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
                  <span className="meta-value">{crew.contactEmail || 'Not provided'}</span>
                </div>
                <div className="meta-item">
                  <span className="icon">📱</span>
                  <span className="meta-label">Phone:</span>
                  <span className="meta-value">{crew.contactPhone || 'Not provided'}</span>
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
        <div className="onboard-forms-section">
          <details>
            <summary className="onboard-forms-header">
              <div className="onboard-forms-title">
                <span className="icon">📋</span>
                Onboard Forms
                <span className="hgqs-compliance-badge">
                  <span className="icon">✓</span>
                  HGQS PM Annex B
                </span>
              </div>
              <span className="collapse-icon">▼</span>
            </summary>
            
            <div className="onboard-forms-content">
              {/* LUNDQVIST REDERIERNA */}
              <div className="company-section">
                <h4 className="company-title">
                  <span className="icon">🚢</span>
                  LUNDQVIST REDERIERNA (Tanker)
                </h4>
                <div className="forms-grid">
                  <div className="form-card">
                    <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/1.SEAFARER'S EMPLOYMENT CONTRACT.docx">
                      <span className="icon">📄</span>
                      <span>Seafarer's Employment Contract</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx">
                      <span className="icon">👨‍👩‍👧</span>
                      <span>Next of Kin Declaration</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/3.LUNDQVIST REDERIERNA.docx">
                      <span className="icon">📝</span>
                      <span>Lundqvist Rederierna Form</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/4.SEAFARER MEDICAL REPORT.docx">
                      <span className="icon">🏥</span>
                      <span>Seafarer Medical Report</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/5.LUNDQVIST CHECKLIST.docx">
                      <span className="icon">✅</span>
                      <span>Lundqvist Checklist</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* INTERGIS CO, LTD */}
              <div className="company-section">
                <h4 className="company-title">
                  <span className="icon">🚢</span>
                  INTERGIS CO, LTD
                </h4>
                <div className="forms-grid">
                  <div className="form-card">
                    <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/1.SEAFARER'S AGREEMENT.docx">
                      <span className="icon">📄</span>
                      <span>Seafarer's Agreement</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/2.NEXT OF KIN.docx">
                      <span className="icon">👨‍👩‍👧</span>
                      <span>Next of Kin</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/3.SEAFARER MEDICAL REPORT.docx">
                      <span className="icon">🏥</span>
                      <span>Seafarer Medical Report</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/4.EDUCATION CERTIFICATE.docx">
                      <span className="icon">🎓</span>
                      <span>Education Certificate</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/5.TRAINING RECORD.docx">
                      <span className="icon">📚</span>
                      <span>Training Record</span>
                    </a>
                  </div>
                  <div className="form-card">
                    <a href="/api/docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/6.SCHEDULE OF PAYMENT.docx">
                      <span className="icon">💰</span>
                      <span>Schedule of Payment</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Main Content Grid */}
        <div className="main-content">
          
          {/* Left Column */}
          <div className="left-column">
            
            {/* Certificates */}
            <div className="content-card">
              <div className="card-header">
                <span className="icon">📜</span>
                <h3>Certificates</h3>
                <span className="card-count">{crew.certificates.length}</span>
                <span className="mlc-compliance-badge">
                  <span className="icon">✓</span>
                  MLC 2006 Reg 1.3
                </span>
              </div>
              
              {crew.certificates.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">📜</div>
                  <div>No certificates on file</div>
                </div>
              ) : (
                <div className="certificates-list">
                  {crew.certificates.map((cert) => {
                    const status = getCertStatus(cert.expiryDate)
                    return (
                      <div key={cert.id} className="cert-item">
                        <div className="cert-header">
                          <div className="cert-type">{cert.type}</div>
                          <div className={`cert-badge ${status}`}>
                            {status === 'valid' && '✓ Valid'}
                            {status === 'expiring-soon' && '⚠ Expiring Soon'}
                            {status === 'expired' && '✗ Expired'}
                          </div>
                        </div>
                        <div className="cert-dates">
                          <div className="cert-date-item">
                            <span>Issued:</span>
                            <span>{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="cert-date-item">
                            <span>Expires:</span>
                            <span>{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sea Service */}
            <div className="content-card">
              <div className="card-header">
                <span className="icon">🌊</span>
                <h3>Sea Service</h3>
                <span className="card-count">{crew.seaServices.length}</span>
              </div>
              
              {crew.seaServices.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🌊</div>
                  <div>No sea service records</div>
                </div>
              ) : (
                <div className="sea-service-list">
                  {crew.seaServices.map((service) => (
                    <div key={service.id} className="service-item">
                      <div className="service-header">
                        <div>
                          <div className="service-vessel">{service.vesselName}</div>
                          <div className="service-rank">Rank: {service.rank}</div>
                        </div>
                      </div>
                      <div className="service-dates">
                        <div className="service-date-item">
                          <span>Sign On:</span>
                          <span>{service.signOn ? new Date(service.signOn).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="service-date-item">
                          <span>Sign Off:</span>
                          <span>{service.signOff ? new Date(service.signOff).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Applications */}
            <div className="content-card">
              <div className="card-header">
                <span className="icon">📝</span>
                <h3>Applications</h3>
                <span className="card-count">{crew.applications.length}</span>
                <span className="hgqs-compliance-badge">
                  <span className="icon">✓</span>
                  HGQS PM Annex B
                </span>
              </div>
              
              {crew.applications.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">📝</div>
                  <div>No applications</div>
                </div>
              ) : (
                <div className="applications-list">
                  {crew.applications.map((app) => (
                    <div key={app.id} className="application-item">
                      <div className="application-header">
                        <div className="application-position">
                          {app.appliedRank || 'Position not specified'}
                        </div>
                        <div className={`application-status-badge ${app.status.toLowerCase()}`}>
                          {app.status}
                        </div>
                      </div>
                      <div className="application-dates">
                        <div className="application-date-item">
                          <span>Applied:</span>
                          <span>{app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Checklist Form */}
          <div className="right-column">
            <div className="checklist-form-wrapper">
              <ChecklistForm crewId={crew.id} />
            </div>

            {/* Recent Checklists */}
            {crew.checklists.length > 0 && (
              <div className="content-card recent-checklists-card">
                <div className="card-header">
                  <span className="icon">📋</span>
                  <h3>Recent Checklists</h3>
                  <span className="card-count">{crew.checklists.length}</span>
                </div>
                
                <div className="certificates-list">
                  {crew.checklists.slice(0, 5).map((checklist) => (
                    <div key={checklist.id} className="checklist-history-item">
                      <div className="checklist-history-header">
                        <div className="checklist-date">
                          Checklist #{checklist.id}
                        </div>
                      </div>
                      
                      <div className="checklist-items">
                        <div className={`checklist-item ${checklist.passportOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.passportOk ? '✓' : '○'}</span>
                          <span>Passport</span>
                        </div>
                        <div className={`checklist-item ${checklist.seamanBookOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.seamanBookOk ? '✓' : '○'}</span>
                          <span>Seaman's Book</span>
                        </div>
                        <div className={`checklist-item ${checklist.cocOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.cocOk ? '✓' : '○'}</span>
                          <span>COC/COP</span>
                        </div>
                        <div className={`checklist-item ${checklist.medicalOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.medicalOk ? '✓' : '○'}</span>
                          <span>Medical</span>
                        </div>
                        <div className={`checklist-item ${checklist.visaOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.visaOk ? '✓' : '○'}</span>
                          <span>Visa</span>
                        </div>
                        <div className={`checklist-item ${checklist.vaccinationOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.vaccinationOk ? '✓' : '○'}</span>
                          <span>Vaccination</span>
                        </div>
                        <div className={`checklist-item ${checklist.photoIdOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.photoIdOk ? '✓' : '○'}</span>
                          <span>Photo ID</span>
                        </div>
                        <div className={`checklist-item ${checklist.policeClearanceOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.policeClearanceOk ? '✓' : '○'}</span>
                          <span>Police Clearance</span>
                        </div>
                        <div className={`checklist-item ${checklist.trainingCertsOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.trainingCertsOk ? '✓' : '○'}</span>
                          <span>Training Certs</span>
                        </div>
                        <div className={`checklist-item ${checklist.covidVaccineOk ? 'checked' : 'unchecked'}`}>
                          <span className="icon">{checklist.covidVaccineOk ? '✓' : '○'}</span>
                          <span>COVID-19</span>
                        </div>
                      </div>
                      
                      {checklist.remarks && (
                        <div className="checklist-remarks">
                          <div className="checklist-remarks-label">Remarks:</div>
                          <div className="checklist-remarks-text">{checklist.remarks}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
