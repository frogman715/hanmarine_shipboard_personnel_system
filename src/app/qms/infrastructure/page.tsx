'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import './infrastructure.css'

interface Asset {
  id: number
  assetNumber: string
  name: string
  category: string
  location: string
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'CALIBRATION_DUE' | 'OUT_OF_SERVICE'
  lastMaintenance: string
  nextMaintenance: string
}

export default function InfrastructurePage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    setAssets([
      {
        id: 1,
        assetNumber: 'AST-IT-001',
        name: 'HGQS Server',
        category: 'IT Infrastructure',
        location: 'Main Office - Server Room',
        status: 'OPERATIONAL',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-07-10'
      },
      {
        id: 2,
        assetNumber: 'AST-CAL-002',
        name: 'Temperature Calibrator',
        category: 'Calibration Equipment',
        location: 'Equipment Room',
        status: 'CALIBRATION_DUE',
        lastMaintenance: '2023-06-15',
        nextMaintenance: '2024-06-15'
      }
    ])
  }, [])

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: assets.length,
    operational: assets.filter(a => a.status === 'OPERATIONAL').length,
    maintenance: assets.filter(a => a.status === 'MAINTENANCE').length,
    calibrationDue: assets.filter(a => a.status === 'CALIBRATION_DUE').length
  }

  return (
    <div className="infrastructure-page">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quality Management', href: '/qms' },
        { label: 'Infrastructure' }
      ]} />

      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🏗️</span>
            Infrastructure & Work Environment
          </h1>
          <p className="page-subtitle">Infrastructure Management - ISO 9001:2015 Section 7.1.3 & 7.1.4</p>
        </div>
        <div className="compliance-badges">
          <span className="badge iso-badge">ISO 7.1.3</span>
          <span className="badge iso-badge">ISO 7.1.4</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-label">Total Assets</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Operational</div>
          <div className="stat-value status-operational">{stats.operational}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-label">Under Maintenance</div>
          <div className="stat-value status-maintenance">{stats.maintenance}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Calibration Due</div>
          <div className="stat-value status-calibration">{stats.calibrationDue}</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          ISO 9001:2015 Requirements
        </h2>
        <div className="requirements-grid">
          <div className="requirement-card">
            <h3>7.1.3 Infrastructure</h3>
            <p>Buildings, workspace, equipment, transportation, IT systems necessary for operation and conformity of products/services.</p>
          </div>
          <div className="requirement-card">
            <h3>7.1.4 Work Environment</h3>
            <p>Suitable environment considering social, psychological, and physical factors affecting conformity.</p>
          </div>
          <div className="requirement-card">
            <h3>Maintenance & Calibration</h3>
            <p>Regular maintenance schedules, calibration tracking, and performance monitoring of critical equipment.</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Status</option>
          <option value="OPERATIONAL">Operational</option>
          <option value="MAINTENANCE">Under Maintenance</option>
          <option value="CALIBRATION_DUE">Calibration Due</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>
        <Link href="/qms/infrastructure/new" className="btn-primary">
          <span>➕</span>
          <span>Register Asset</span>
        </Link>
      </div>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>Asset Number</th>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Maintenance</th>
              <th>Next Maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td className="asset-number">{asset.assetNumber}</td>
                  <td className="asset-name">{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.location}</td>
                  <td>
                    <span className={`status-badge status-${asset.status.toLowerCase().replace('_', '-')}`}>
                      {asset.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(asset.lastMaintenance).toLocaleDateString()}</td>
                  <td>{new Date(asset.nextMaintenance).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="btn-action" title="View Asset">👁️</button>
                    <button className="btn-action" title="Schedule Maintenance">🔧</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-results">No assets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
