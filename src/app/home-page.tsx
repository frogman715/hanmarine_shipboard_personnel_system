'use client';

import Link from 'next/link';
import { FaShip, FaUserFriends, FaCertificate, FaClipboardCheck, FaChartLine, FaFileAlt, FaArrowRight, FaCheck, FaShieldAlt, FaGlobe } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#fff',
      overflow: 'auto'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px 60px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.8) 100%)',
        borderBottom: '2px solid rgba(79,195,247,0.3)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 20, 
            marginBottom: 30,
            padding: '20px 40px',
            background: 'rgba(79,195,247,0.1)',
            borderRadius: 60,
            border: '2px solid rgba(79,195,247,0.3)'
          }}>
            <FaShip style={{ fontSize: '3.5rem', color: '#4fc3f7' }} />
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 800, 
                margin: 0,
                letterSpacing: '2px',
                background: 'linear-gradient(90deg, #4fc3f7 0%, #00e0ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                HANMARINE
              </h1>
              <p style={{ 
                fontSize: '1.2rem', 
                margin: 0, 
                color: '#94a3b8',
                fontWeight: 500 
              }}>
                Shipboard Personnel System
              </p>
            </div>
          </div>

          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: 20,
            lineHeight: 1.3,
            color: '#e5e7eb'
          }}>
            Professional Maritime Crew Management
          </h2>
          
          <p style={{ 
            fontSize: '1.3rem', 
            color: '#cbd5e1', 
            marginBottom: 40, 
            maxWidth: 800, 
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Comprehensive solution for crew management, compliance tracking, and workflow automation.
            <br />
            Fully compliant with <strong style={{ color: '#4fc3f7' }}>ISO 9001:2015</strong> and <strong style={{ color: '#4fc3f7' }}>MLC 2006</strong> standards.
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <Link 
              href="/login" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 36px',
                background: 'linear-gradient(90deg, #4fc3f7 0%, #3578e5 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 12,
                fontSize: '1.2rem',
                fontWeight: 700,
                boxShadow: '0 4px 20px rgba(79,195,247,0.4)',
                transition: 'all 0.3s',
                border: 'none'
              }}
            >
              🔐 Login to System <FaArrowRight />
            </Link>
            <a 
              href="#features" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 36px',
                background: 'rgba(79,195,247,0.1)',
                color: '#4fc3f7',
                textDecoration: 'none',
                borderRadius: 12,
                fontSize: '1.2rem',
                fontWeight: 700,
                border: '2px solid #4fc3f7',
                transition: 'all 0.3s'
              }}
            >
              Learn More
            </a>
          </div>

          {/* Compliance Badges */}
          <div style={{ 
            display: 'flex', 
            gap: 15, 
            justifyContent: 'center', 
            marginTop: 50,
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: '12px 24px',
              background: 'rgba(255,152,0,0.15)',
              border: '2px solid rgba(255,152,0,0.5)',
              borderRadius: 25,
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffa726',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FaShieldAlt /> ISO 9001:2015
            </div>
            <div style={{
              padding: '12px 24px',
              background: 'rgba(255,152,0,0.15)',
              border: '2px solid rgba(255,152,0,0.5)',
              borderRadius: 25,
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffa726',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FaShieldAlt /> MLC 2006
            </div>
            <div style={{
              padding: '12px 24px',
              background: 'rgba(16,185,129,0.15)',
              border: '2px solid rgba(16,185,129,0.5)',
              borderRadius: 25,
              fontSize: '1rem',
              fontWeight: 700,
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FaCheck /> Production Ready
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          textAlign: 'center', 
          marginBottom: 20,
          color: '#e5e7eb'
        }}>
          Powerful Features for Maritime Operations
        </h2>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '1.2rem', 
          color: '#94a3b8', 
          marginBottom: 60,
          maxWidth: 700,
          margin: '0 auto 60px'
        }}>
          Everything you need to manage your crew efficiently and maintain compliance
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 30 
        }}>
          {[
            {
              icon: <FaUserFriends />,
              title: 'Crew Management',
              description: 'Complete lifecycle management from recruitment to repatriation with comprehensive crew profiles and real-time status tracking.'
            },
            {
              icon: <FaCertificate />,
              title: 'Certificate Tracking',
              description: 'Automated expiry alerts with 30-day warnings, multi-certificate management, and compliance reporting.'
            },
            {
              icon: <FaClipboardCheck />,
              title: 'Dynamic Forms',
              description: 'HGF-CR-01 & HGF-CR-02 forms with auto-save, customizable templates, and workflow status tracking.'
            },
            {
              icon: <FaChartLine />,
              title: 'Smart Dashboard',
              description: 'Real-time KPIs, visual status indicators, certificate alerts, and quick action shortcuts.'
            },
            {
              icon: <FaFileAlt />,
              title: 'Document Generation',
              description: 'Professional joining instructions, crew reports, and compliance documents with one click.'
            },
            {
              icon: <FaGlobe />,
              title: 'Sea Service Tracking',
              description: 'Complete vessel history, rank records, GRT/DWT documentation, and comprehensive assignment tracking.'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(30,41,59,0.6)',
              border: '1px solid rgba(79,195,247,0.2)',
              borderRadius: 16,
              padding: 32,
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: '3rem',
                color: '#4fc3f7',
                marginBottom: 20,
                filter: 'drop-shadow(0 2px 8px rgba(79,195,247,0.5))'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 700, 
                marginBottom: 12,
                color: '#e5e7eb'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: '#94a3b8', 
                lineHeight: 1.6,
                fontSize: '1.05rem'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '60px 20px',
        background: 'linear-gradient(90deg, rgba(79,195,247,0.1) 0%, rgba(53,120,229,0.1) 100%)',
        borderTop: '1px solid rgba(79,195,247,0.2)',
        borderBottom: '1px solid rgba(79,195,247,0.2)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 40,
            textAlign: 'center'
          }}>
            {[
              { number: '15+', label: 'Database Models' },
              { number: '40+', label: 'API Endpoints' },
              { number: '42', label: 'HGQS Forms' },
              { number: '100%', label: 'Type Safe' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 800, 
                  color: '#4fc3f7',
                  marginBottom: 8
                }}>
                  {stat.number}
                </div>
                <div style={{ 
                  fontSize: '1.1rem', 
                  color: '#94a3b8',
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '80px 20px', 
        textAlign: 'center',
        maxWidth: 900,
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          marginBottom: 20,
          color: '#e5e7eb'
        }}>
          Ready to Get Started?
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#94a3b8', 
          marginBottom: 40,
          lineHeight: 1.6
        }}>
          Access the dashboard and start managing your crew with professional tools designed for the maritime industry.
        </p>
        <Link 
          href="/dashboard" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 48px',
            background: 'linear-gradient(90deg, #4fc3f7 0%, #3578e5 100%)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 12,
            fontSize: '1.3rem',
            fontWeight: 700,
            boxShadow: '0 4px 24px rgba(79,195,247,0.5)',
            transition: 'all 0.3s'
          }}
        >
          Access Dashboard <FaArrowRight />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 20px', 
        borderTop: '1px solid rgba(79,195,247,0.2)',
        textAlign: 'center',
        background: 'rgba(15,23,42,0.8)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 12,
              marginBottom: 12
            }}>
              <FaShip style={{ fontSize: '2rem', color: '#4fc3f7' }} />
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 700,
                color: '#e5e7eb'
              }}>
                HANMARINE
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Professional Maritime Crew Management System
            </p>
          </div>
          <div style={{ 
            fontSize: '0.95rem', 
            color: '#64748b',
            marginTop: 30
          }}>
            <p style={{ margin: '8px 0' }}>
              © 2025 HanMarine Shipboard Personnel System. All rights reserved.
            </p>
            <p style={{ margin: '8px 0' }}>
              Built with ❤️ for the Maritime Industry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
