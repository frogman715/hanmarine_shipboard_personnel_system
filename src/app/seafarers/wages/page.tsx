import prisma from '@/lib/prisma'
import Breadcrumb from '@/components/Breadcrumb'
import './wages.css'

export default async function SeafarersWagesPage() {
  // Get all crew with their contracts
  const crews = await prisma.crew.findMany({
    include: {
      contracts: {
        orderBy: { signOnDate: 'desc' },
        take: 1,
      },
    },
    orderBy: { fullName: 'asc' },
  })

  return (
    <div className="wages-page">
      <div className="page-container">
        
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Maritime Compliance', href: '#' },
            { label: 'Seafarers Wages', href: '/seafarers/wages' },
          ]}
        />

        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1>
                <span className="icon">💰</span>
                Seafarers Wages Management
              </h1>
              <p className="subtitle">
                MLC 2006 Regulation 2.2 - Wages and Financial Records
              </p>
            </div>
            <div className="header-actions">
              <a href="/seafarers/wages/payment-record" className="action-btn primary">
                <span className="icon">📝</span>
                Record Payment
              </a>
              <a href="/seafarers/wages/reports" className="action-btn secondary">
                <span className="icon">📊</span>
                Generate Report
              </a>
            </div>
          </div>
        </div>

        {/* MLC Compliance Notice */}
        <div className="mlc-notice">
          <div className="notice-icon">⚖️</div>
          <div className="notice-content">
            <h3>MLC 2006 Compliance Requirements</h3>
            <p>
              <strong>Regulation 2.2:</strong> Seafarers shall be paid for their work regularly and in full in accordance with their employment agreements. 
              Payment must be made at no greater than monthly intervals and seafarers must receive a monthly account of payments due and amounts paid.
            </p>
            <ul>
              <li>✓ Regular monthly payments required</li>
              <li>✓ Monthly account statements provided</li>
              <li>✓ Allotment system for family remittance</li>
              <li>✓ No deductions except as permitted</li>
              <li>✓ Fair rates of exchange applied</li>
            </ul>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-label">Active Seafarers</div>
              <div className="stat-value">{crews.filter((c: any) => c.crewStatus === 'ONBOARD' || c.crewStatus === 'ACTIVE').length}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-label">With Contracts</div>
              <div className="stat-value">{crews.filter((c: any) => c.contracts.length > 0).length}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-label">Payment Due</div>
              <div className="stat-value">{crews.filter((c: any) => c.crewStatus === 'ONBOARD').length}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-label">MLC Compliant</div>
              <div className="stat-value">{crews.filter((c: any) => c.contracts.length > 0 && c.crewStatus === 'ONBOARD').length}</div>
            </div>
          </div>
        </div>

        {/* Crew Wages Table */}
        <div className="content-card">
          <div className="card-header">
            <div className="card-title">
              <span className="icon">💵</span>
              <h2>Seafarer Wages Overview</h2>
            </div>
            <div className="card-filters">
              <select className="filter-select" aria-label="Filter by status">
                <option value="all">All Status</option>
                <option value="onboard">Onboard</option>
                <option value="active">Active</option>
                <option value="available">Available</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="wages-table">
              <thead>
                <tr>
                  <th>Crew Code</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Vessel</th>
                  <th>Basic Wage</th>
                  <th>Contract</th>
                  <th>Last Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {crews.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty-state">
                      <div className="empty-icon">💰</div>
                      <div>No seafarers found</div>
                    </td>
                  </tr>
                ) : (
                  crews.map((crew: any) => {
                    const latestContract = crew.contracts[0]
                    return (
                      <tr key={crew.id}>
                        <td>
                          <span className="crew-code">{crew.crewCode || 'N/A'}</span>
                        </td>
                        <td>
                          <a href={`/crew/${crew.id}`} className="crew-name-link">
                            {crew.fullName}
                          </a>
                        </td>
                        <td>{crew.rank || '-'}</td>
                        <td>
                          <span className={`status-badge ${crew.crewStatus.toLowerCase()}`}>
                            {crew.crewStatus}
                          </span>
                        </td>
                        <td>{crew.vessel || '-'}</td>
                        <td>
                          {latestContract ? (
                            <span className="wage-amount">
                              {latestContract.currency || 'USD'} {latestContract.basicWage?.toLocaleString() || '0'}
                            </span>
                          ) : (
                            <span className="no-contract">No contract</span>
                          )}
                        </td>
                        <td>
                          {latestContract ? (
                            <div className="contract-info">
                              <div className="contract-date">
                                {new Date(latestContract.signOnDate).toLocaleDateString()}
                              </div>
                              {latestContract.signOffDate && (
                                <div className="contract-end">
                                  to {new Date(latestContract.signOffDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="no-contract">-</span>
                          )}
                        </td>
                        <td>
                          <span className="payment-pending">Pending</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <a href={`/seafarers/wages/${crew.id}/payment`} className="btn-action">
                              💵 Pay
                            </a>
                            <a href={`/seafarers/wages/${crew.id}/history`} className="btn-action">
                              📜 History
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-header">
              <span className="icon">📋</span>
              <h3>Payment Schedule</h3>
            </div>
            <div className="info-content">
              <p>Wages must be paid at no greater than <strong>monthly intervals</strong> in accordance with MLC 2006 Regulation 2.2.</p>
              <ul>
                <li>Monthly payment cycle: 1st of each month</li>
                <li>Payment method: Bank transfer to designated accounts</li>
                <li>Allotments processed within 7 days of payment</li>
              </ul>
            </div>
          </div>

          <div className="info-card">
            <div className="info-header">
              <span className="icon">💱</span>
              <h3>Currency & Exchange</h3>
            </div>
            <div className="info-content">
              <p>All seafarers receive wages in the currency specified in their employment agreements with <strong>fair rates of exchange</strong>.</p>
              <ul>
                <li>Primary currencies: USD, EUR, IDR</li>
                <li>Exchange rates updated daily</li>
                <li>Transparent rate calculation</li>
              </ul>
            </div>
          </div>

          <div className="info-card">
            <div className="info-header">
              <span className="icon">🏦</span>
              <h3>Allotment System</h3>
            </div>
            <div className="info-content">
              <p>Seafarers can designate <strong>allotments</strong> to be sent directly to their families or nominated persons.</p>
              <ul>
                <li>Allotment percentage: Up to 100% of wages</li>
                <li>Multiple beneficiaries supported</li>
                <li>Secure bank-to-bank transfers</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
