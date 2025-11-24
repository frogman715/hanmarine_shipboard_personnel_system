"use client";
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './MainNavigation.css'
import { 
  FaTachometerAlt, FaClipboardList, FaUserFriends, FaShip, FaUserTie, FaFileAlt, FaChartBar, FaCog, FaExclamationTriangle, FaSearch, FaTools, FaHandshake, FaBullhorn, FaFolderOpen, FaFile, FaBuilding, FaTimesCircle, FaUser, FaSignOutAlt, FaChevronDown, FaChevronUp, FaBook, FaUsers, FaCalendarAlt, FaFileContract, FaBalanceScale, FaGraduationCap, FaMoneyBillWave, FaCommentDots, FaFileImport
} from 'react-icons/fa'
import dynamic from 'next/dynamic'
const WorldClock = dynamic(() => import('./WorldClock'), { ssr: false })

interface User {
  id: number
  fullName: string
  email: string
  role: string
}

export default function MainNavigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  
  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    qms: true, // QMS default open
    crewing: false,
    hr: false,
    maritime: false,
    documents: false,
    reports: false,
    admin: false
  })

  useEffect(() => {
    // Get current user from cookie
    const cookies = document.cookie.split(';')
    const userCookie = cookies.find(c => c.trim().startsWith('user_session='))
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser(userData)
      } catch (e) {
        console.error('Failed to parse user session')
      }
    }

    // Auto-open section based on current path
    if (pathname.startsWith('/qms')) setOpenSections(prev => ({ ...prev, qms: true }))
    else if (pathname.startsWith('/crew') || pathname.startsWith('/applications') || pathname.startsWith('/seafarers') || pathname.startsWith('/replacement')) {
      setOpenSections(prev => ({ ...prev, crewing: true }))
    }
    else if (pathname.startsWith('/hr') || pathname.startsWith('/employees')) setOpenSections(prev => ({ ...prev, hr: true }))
    else if (pathname.startsWith('/vessels') || pathname.startsWith('/owners')) setOpenSections(prev => ({ ...prev, maritime: true }))
    else if (pathname.startsWith('/documents') || pathname.startsWith('/forms') || pathname.startsWith('/managed-documents')) {
      setOpenSections(prev => ({ ...prev, documents: true }))
    }
    else if (pathname.startsWith('/semester') || pathname.startsWith('/cv-generator')) setOpenSections(prev => ({ ...prev, reports: true }))
    else if (pathname.startsWith('/import')) setOpenSections(prev => ({ ...prev, admin: true }))
  }, [pathname])

  const handleLogout = () => {
    document.cookie = 'user_session=; Max-Age=0; path=/'
    window.location.href = '/login'
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <>
      <div className="sidebar-bg-overlay"></div>
      <nav className="main-nav">
        {/* World clock at the top */}
        <div className="nav-clock-top-wrapper">
          <WorldClock />
        </div>
        {/* Header */}
        <div className="nav-header">
          <Link href="/dashboard" className="nav-logo">
            <span className="nav-logo-icon"><FaShip /></span>
            <div className="nav-logo-text">
              <h1 style={{ letterSpacing: 1 }}>HANMARINE</h1>
              <p style={{ fontSize: 13, margin: 0 }}>Personnel System</p>
            </div>
          </Link>
          <div className="nav-compliance-badges">
            <div className="compliance-badge">ISO 9001:2015</div>
            <div className="compliance-badge">MLC 2006</div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="nav-content">

          {/* Dashboard */}
          <div className="nav-section">
            <ul className="nav-links">
              <li>
                <Link href="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <span className="nav-link-icon"><FaTachometerAlt /></span>
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* QUALITY MANAGEMENT (HGQS) - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('qms')}
            >
              <span className="nav-section-icon"><FaClipboardList /></span>
              <span>Quality Management (HGQS)</span>
              <span className={`nav-toggle-arrow ${openSections.qms ? 'open' : ''}`}>{openSections.qms ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.qms && (
              <ul className="nav-links">
                <li>
                  <Link href="/qms/risks" className={`nav-link ${isActive('/qms/risks') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaExclamationTriangle /></span>
                    <span>Risk & Opportunities</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/audits" className={`nav-link ${isActive('/qms/audits') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaSearch /></span>
                    <span>Internal Audits</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/cpar" className={`nav-link ${isActive('/qms/cpar') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaTools /></span>
                    <span>Corrective Actions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/suppliers" className={`nav-link ${isActive('/qms/suppliers') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaHandshake /></span>
                    <span>Supplier Management</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/complaints" className={`nav-link ${isActive('/qms/complaints') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaBullhorn /></span>
                    <span>Customer Complaints</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/document-control" className={`nav-link ${isActive('/qms/document-control') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFolderOpen /></span>
                    <span>Document Control</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/records" className={`nav-link ${isActive('/qms/records') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFile /></span>
                    <span>Records Control</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/infrastructure" className={`nav-link ${isActive('/qms/infrastructure') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaBuilding /></span>
                    <span>Infrastructure</span>
                  </Link>
                </li>
                <li>
                  <Link href="/qms/nonconforming" className={`nav-link ${isActive('/qms/nonconforming') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaTimesCircle /></span>
                    <span>Nonconforming Product</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* CREWING OPERATIONS - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('crewing')}
            >
              <span className="nav-section-icon"><FaUserFriends /></span>
              <span>Crewing Operations</span>
              <span className={`nav-toggle-arrow ${openSections.crewing ? 'open' : ''}`}>{openSections.crewing ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.crewing && (
              <ul className="nav-links">
                <li>
                  <Link href="/crew" className={`nav-link ${isActive('/crew') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaUsers /></span>
                    <span>Crew Database</span>
                  </Link>
                </li>
                <li>
                  <Link href="/applications" className={`nav-link ${isActive('/applications') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaClipboardList /></span>
                    <span>Applications</span>
                  </Link>
                </li>
                <li>
                  <Link href="/replacement-schedule" className={`nav-link ${isActive('/replacement-schedule') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaCalendarAlt /></span>
                    <span>Replacement Schedule</span>
                  </Link>
                </li>
                <li>
                  <Link href="/seafarers/contracts" className={`nav-link ${isActive('/seafarers/contracts') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFileContract /></span>
                    <span>Contracts</span>
                  </Link>
                </li>
                <li>
                  <Link href="/seafarers/cba" className={`nav-link ${isActive('/seafarers/cba') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaBook /></span>
                    <span>CBA Management</span>
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className={`nav-link ${isActive('/certificates') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaGraduationCap /></span>
                    <span>Certificates</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* HR OPERATIONS - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('hr')}
            >
              <span className="nav-section-icon"><FaUserTie /></span>
              <span>HR Operations</span>
              <span className={`nav-toggle-arrow ${openSections.hr ? 'open' : ''}`}>{openSections.hr ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.hr && (
              <ul className="nav-links">
                <li>
                  <Link href="/hr/shore-personnel" className={`nav-link ${isActive('/hr/shore-personnel') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaUserTie /></span>
                    <span>Shore Personnel</span>
                  </Link>
                </li>
                <li>
                  <Link href="/employees" className={`nav-link ${isActive('/employees') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaUser /></span>
                    <span>Employees</span>
                  </Link>
                </li>
                <li>
                  <Link href="/recruitment" className={`nav-link ${isActive('/recruitment') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaBullhorn /></span>
                    <span>Recruitment</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* MARITIME OPERATIONS - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('maritime')}
            >
              <span className="nav-section-icon"><FaShip /></span>
              <span>Maritime Operations</span>
              <span className={`nav-toggle-arrow ${openSections.maritime ? 'open' : ''}`}>{openSections.maritime ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.maritime && (
              <ul className="nav-links">
                <li>
                  <Link href="/vessels" className={`nav-link ${isActive('/vessels') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaShip /></span>
                    <span>Vessels</span>
                  </Link>
                </li>
                <li>
                  <Link href="/owners" className={`nav-link ${isActive('/owners') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaBuilding /></span>
                    <span>Owners</span>
                  </Link>
                </li>
                <li>
                  <Link href="/seafarers/wages" className={`nav-link ${isActive('/seafarers/wages') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaMoneyBillWave /></span>
                    <span>Wages</span>
                  </Link>
                </li>
                <li>
                  <Link href="/seafarers/grievances" className={`nav-link ${isActive('/seafarers/grievances') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaCommentDots /></span>
                    <span>Grievances</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* DOCUMENTS - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('documents')}
            >
              <span className="nav-section-icon"><FaFileAlt /></span>
              <span>Documents</span>
              <span className={`nav-toggle-arrow ${openSections.documents ? 'open' : ''}`}>{openSections.documents ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.documents && (
              <ul className="nav-links">
                <li>
                  <Link href="/managed-documents" className={`nav-link ${isActive('/managed-documents') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFolderOpen /></span>
                    <span>Managed Documents</span>
                  </Link>
                </li>
                <li>
                  <Link href="/documents/communication" className={`nav-link ${isActive('/documents/communication') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaCommentDots /></span>
                    <span>Communication</span>
                  </Link>
                </li>
                <li>
                  <Link href="/forms" className={`nav-link ${isActive('/forms') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFileContract /></span>
                    <span>Forms Library</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* REPORTS - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('reports')}
            >
              <span className="nav-section-icon"><FaChartBar /></span>
              <span>Reports</span>
              <span className={`nav-toggle-arrow ${openSections.reports ? 'open' : ''}`}>{openSections.reports ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.reports && (
              <ul className="nav-links">
                <li>
                  <Link href="/semester-reports" className={`nav-link ${isActive('/semester-reports') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaChartBar /></span>
                    <span>Semester Reports</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cv-generator" className={`nav-link ${isActive('/cv-generator') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFile /></span>
                    <span>CV Generator</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* ADMIN - COLLAPSIBLE */}
          <div className="nav-section">
            <button 
              className="nav-section-toggle" 
              onClick={() => toggleSection('admin')}
            >
              <span className="nav-section-icon"><FaCog /></span>
              <span>Admin</span>
              <span className={`nav-toggle-arrow ${openSections.admin ? 'open' : ''}`}>{openSections.admin ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            
            {openSections.admin && (
              <ul className="nav-links">
                <li>
                  <Link href="/import" className={`nav-link ${isActive('/import') ? 'active' : ''}`}>
                    <span className="nav-link-icon"><FaFileImport /></span>
                    <span>Import Data</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

        </div>

        {/* User Footer - always stick to bottom */}
        <div className="nav-footer">
          {user ? (
            <>
              <div className="nav-user-info">
                <div className="nav-user-avatar"><FaUser /></div>
                <div className="nav-user-details">
                  <div className="nav-user-name">{user.fullName}</div>
                  <div className="nav-user-role">{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="nav-logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <div className="nav-footer-branding">
              <div className="nav-footer-logo"><FaShip /></div>
              <div className="nav-footer-text">HANMARINE<br/>Personnel System</div>
            </div>
          )}
        </div>


      </nav>
    </>
  )
}
