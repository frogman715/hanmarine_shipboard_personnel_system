'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './qms.css';

export default function QMSDashboardPage() {
  const [stats, setStats] = useState({
    risks: 0,
    opportunities: 0,
    audits: 0,
    openCPARs: 0,
    complaints: 0,
    suppliers: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from APIs
    setStats({
      risks: 0,
      opportunities: 0,
      audits: 0,
      openCPARs: 0,
      complaints: 0,
      suppliers: 0
    });
  }, []);

  const modules = [
    {
      title: 'Risk & Opportunity Management',
      subtitle: 'ISO 9001:2015 Clause 6.1.2',
      description: 'Identify, analyze, and treat risks and opportunities to achieve QMS intended results.',
      icon: '⚠️',
      href: '/qms/risks',
      color: '#f59e0b',
      stat: `${stats.risks} Risks, ${stats.opportunities} Opportunities`,
      features: [
        'Risk Evaluation Table',
        'Likelihood × Impact scoring',
        'Treatment actions tracking',
        'Effectiveness reviews'
      ]
    },
    {
      title: 'Internal Audit System',
      subtitle: 'ISO 9001:2015 Clause 9.2',
      description: 'Schedule and conduct internal audits to verify QMS effectiveness and compliance.',
      icon: '🔍',
      href: '/qms/audits',
      color: '#3b82f6',
      stat: `${stats.audits} Audits Scheduled`,
      features: [
        'April/October audit cycles',
        'Audit checklists (HCF-AD-07)',
        'Audit reports (HCF-AD-09)',
        'Finding tracking'
      ]
    },
    {
      title: 'CPAR System',
      subtitle: 'Corrective & Preventive Action (Clause 10.2)',
      description: 'Track non-conformities, root causes, and corrective actions for continual improvement.',
      icon: '🔧',
      href: '/qms/cpar',
      color: '#dc2626',
      stat: `${stats.openCPARs} Open Actions`,
      features: [
        'CAR/PAR forms (HCF-AD-10/11)',
        'Root cause analysis',
        'Effectiveness verification',
        'Linked to audits & complaints'
      ]
    },
    {
      title: 'Supplier Management',
      subtitle: 'External Providers (Clause 8.4)',
      description: 'Evaluate and manage suppliers, subcontractors, and external service providers.',
      icon: '🏭',
      href: '/qms/suppliers',
      color: '#8b5cf6',
      stat: `${stats.suppliers} Approved Suppliers`,
      features: [
        'Supplier evaluation (HCF-AD-03)',
        'Annual re-evaluation (HCF-AD-04)',
        'Performance scoring',
        'Purchase order tracking'
      ]
    },
    {
      title: 'Complaints Management',
      subtitle: 'MLC 2006 Reg 5.1.5',
      description: 'Handle complaints from customers, seafarers, and employees with proper investigation.',
      icon: '📢',
      href: '/qms/complaints',
      color: '#10b981',
      stat: `${stats.complaints} Complaints`,
      features: [
        'Customer complaints',
        'Seafarer complaints',
        'Media handling',
        'Emergency procedures'
      ]
    },
    {
      title: 'Document Control',
      subtitle: 'Documented Information (Clause 7.5)',
      description: 'Control HGQS procedures, forms, and quality records with proper version management.',
      icon: '📁',
      href: '/managed-documents',
      color: '#06b6d4',
      stat: 'ISO 9001:2015 Section 7.5.3',
      features: [
        'Document lifecycle',
        'Revision control',
        'Approval workflow',
        'Distribution tracking'
      ]
    }
  ];

  return (
    <div className="qms-dashboard-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📋 Quality Management System (QMS)</h1>
          <p className="subtitle">
            HGQS - PT Hann Global Indonesia | ISO 9001:2015 & MLC 2006
          </p>
        </div>
      </div>

      <div className="qms-info-card">
        <div className="info-icon">ℹ️</div>
        <div className="info-content">
          <h3>HGQS Procedures Manual</h3>
          <p>
            This QMS implements all 10 mandatory procedures from the HGQS Procedures Manual (HGQS-PM)
            conforming to ISO 9001:2015 and MLC 2006 requirements.
          </p>
          <div className="procedure-links">
            <span className="procedure-tag">✅ Control of Contract (4.2)</span>
            <span className="procedure-tag">✅ Risk Management (6.1.2)</span>
            <span className="procedure-tag">✅ Hiring Personnel (7.1.2)</span>
            <span className="procedure-tag">✅ Infrastructure (7.1.3)</span>
            <span className="procedure-tag">✅ Document Control (7.5.3.1)</span>
            <span className="procedure-tag">✅ Record Control (7.5.3.2)</span>
            <span className="procedure-tag">✅ External Providers (8.4)</span>
            <span className="procedure-tag">✅ Nonconforming Product (8.7)</span>
            <span className="procedure-tag">✅ Internal Audit (9.2)</span>
            <span className="procedure-tag">✅ Corrective Action (10.2)</span>
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="module-card"
            style={{ borderTopColor: module.color }}
          >
            <div className="module-header">
              <div className="module-icon" style={{ backgroundColor: `${module.color}20`, color: module.color }}>
                {module.icon}
              </div>
              <div className="module-stat">{module.stat}</div>
            </div>

            <h2 className="module-title">{module.title}</h2>
            <p className="module-subtitle">{module.subtitle}</p>
            <p className="module-description">{module.description}</p>

            <div className="module-features">
              {module.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-bullet">•</span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="module-action">
              Open Module →
            </div>
          </Link>
        ))}
      </div>

      <div className="qms-footer">
        <div className="footer-section">
          <h4>📖 References</h4>
          <ul>
            <li>HGQS Procedures Manual (HGQS-PM Rev 00)</li>
            <li>ISO 9001:2015 Quality Management Systems - Requirements</li>
            <li>MLC 2006 Maritime Labour Convention</li>
            <li>Management Guideline for Office Employees (HCQS-MG)</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>👥 Responsibilities</h4>
          <ul>
            <li><strong>QMR:</strong> Quality Management Representative</li>
            <li><strong>Director:</strong> Final approval authority</li>
            <li><strong>Dept. Heads:</strong> Department implementation</li>
            <li><strong>Staff:</strong> Daily compliance</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>📅 Key Dates</h4>
          <ul>
            <li>Internal Audits: April & October</li>
            <li>Management Reviews: Semi-annual</li>
            <li>Risk Reviews: Semi-annual</li>
            <li>Supplier Re-evaluation: Annual</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
