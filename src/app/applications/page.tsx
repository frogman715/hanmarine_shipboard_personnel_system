'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MainNavigation from '@/components/MainNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import './applications.css'

interface Application {
  id: number
  crewId: number
  appliedRank: string | null
  applicationDate: string | null
  status: string
  notes: string | null
  crew?: {
    fullName: string
  }
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, statusFilter, searchQuery])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      
      // Check if data is array
      if (!Array.isArray(data)) {
        console.error('API returned non-array data:', data)
        setApplications([])
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 })
        setLoading(false)
        return
      }
      
      setApplications(data)
      
      // Calculate stats
      const calculatedStats = {
        total: data.length,
        pending: data.filter((a: Application) => a.status === 'APPLIED' || a.status === 'SHORTLISTED').length,
        approved: data.filter((a: Application) => a.status === 'APPROVED' || a.status === 'ACCEPTED' || a.status === 'OFFERED').length,
        rejected: data.filter((a: Application) => a.status === 'REJECTED').length,
      }
      setStats(calculatedStats)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      setApplications([])
      setStats({ total: 0, pending: 0, approved: 0, rejected: 0 })
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.crew?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.appliedRank && app.appliedRank.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredApps(filtered)
  }

  const getStatusBadgeClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      'APPLIED': 'pending',
      'SHORTLISTED': 'pending',
      'INTERVIEW': 'interview',
      'APPROVED': 'approved',
      'OFFERED': 'approved',
      'ACCEPTED': 'approved',
      'REJECTED': 'rejected',
    };
    return statusMap[status] || 'pending';
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <MainNavigation />
      <div className="applications-page">
        <div className="applications-container">
          
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Applications' }
            ]}
          />

          {/* Page Header */}
          <div className="applications-header">
            <div className="applications-header-top">
              <div>
                <h1 className="applications-title">
                  📋 Applications
                </h1>
                <p className="applications-subtitle">
                  Manage crew applications and submissions
                </p>
              </div>
              <div className="applications-actions">
                <button 
                  className="btn-refresh"
                  onClick={fetchApplications}
                >
                  🔄 Refresh
                </button>
                <Link href="/applications/new" className="btn-new-application">
                  ➕ New Application
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="applications-stats">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Total Applications</span>
                <span className="stat-card-icon">📊</span>
              </div>
              <p className="stat-card-value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Pending Review</span>
                <span className="stat-card-icon">⏳</span>
              </div>
              <p className="stat-card-value">{stats.pending}</p>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Approved</span>
                <span className="stat-card-icon">✅</span>
              </div>
              <p className="stat-card-value">{stats.approved}</p>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Rejected</span>
                <span className="stat-card-icon">❌</span>
              </div>
              <p className="stat-card-value">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="applications-filters">
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="search">Search</label>
                <input
                  id="search"
                  type="text"
                  className="filter-input"
                  placeholder="Search by name or rank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="approved">Approved</option>
                  <option value="offered">Offered</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="applications-table-container">
            {loading ? (
              <div className="applications-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading applications...</p>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="applications-empty">
                <div className="applications-empty-icon">📋</div>
                <h3 className="applications-empty-title">No Applications Found</h3>
                <p className="applications-empty-text">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No applications submitted yet. Click "New Application" to add one.'}
                </p>
              </div>
            ) : (
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Crew Name</th>
                    <th>Applied Rank</th>
                    <th>Application Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td>{app.crew?.fullName || 'N/A'}</td>
                      <td>
                        <span className="position-badge">{app.appliedRank || 'Not Specified'}</span>
                      </td>
                      <td>{formatDate(app.applicationDate)}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="notes-cell">
                        {app.notes || '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link href={`/applications/${app.id}`} className="btn-action btn-view">
                            👁️ View
                          </Link>
                          <Link href={`/applications/${app.id}/edit`} className="btn-action btn-edit">
                            ✏️ Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
