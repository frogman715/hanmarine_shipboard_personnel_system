'use client'

import { RANKS, DEPARTMENTS, getRanksGrouped } from '@/lib/ranks'
import Link from 'next/link'

export default function RecruitmentPage() {
  const grouped = getRanksGrouped()

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      background: '#0f172a',
      minHeight: '100vh',
      color: '#e5e7eb',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ 
          color: '#60a5fa', 
          textDecoration: 'none',
          fontSize: '0.875rem',
        }}>
          ← Back to Dashboard
        </Link>
      </div>

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🚢 Recruitment & Crew Positions
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
          Complete guide to all positions and job descriptions
        </p>
      </header>

      {/* Hierarchy Chart */}
      <section style={{
        marginBottom: '3rem',
        padding: '2rem',
        background: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          📊 Ship Organization Structure
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Deck Side */}
          <div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#60a5fa',
            }}>
              OFFICER DECK
            </h3>
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #60a5fa' }}>
              {getRanksGrouped()['Officer Deck'].map((rank, idx) => (
                <div key={rank.code} style={{ 
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  background: '#334155',
                  borderRadius: '6px',
                }}>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                    {rank.code} - {rank.title}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              marginTop: '1.5rem',
              marginBottom: '1rem',
              color: '#34d399',
            }}>
              RATING - DECK
            </h3>
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #34d399' }}>
              {getRanksGrouped()['Rating - Deck'].map((rank) => (
                <div key={rank.code} style={{ 
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  background: '#334155',
                  borderRadius: '6px',
                }}>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                    {rank.code} - {rank.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Side */}
          <div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#fbbf24',
            }}>
              OFFICER ENGINE
            </h3>
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #fbbf24' }}>
              {getRanksGrouped()['Officer Engine'].map((rank) => (
                <div key={rank.code} style={{ 
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  background: '#334155',
                  borderRadius: '6px',
                }}>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                    {rank.code} - {rank.title}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              marginTop: '1.5rem',
              marginBottom: '1rem',
              color: '#f472b6',
            }}>
              RATING - ENGINE
            </h3>
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #f472b6' }}>
              {getRanksGrouped()['Rating - Engine'].map((rank) => (
                <div key={rank.code} style={{ 
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  background: '#334155',
                  borderRadius: '6px',
                }}>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                    {rank.code} - {rank.title}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              marginTop: '1.5rem',
              marginBottom: '1rem',
              color: '#fb923c',
            }}>
              RATING - CATERING
            </h3>
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #fb923c' }}>
              {getRanksGrouped()['Rating - Catering'].map((rank) => (
                <div key={rank.code} style={{ 
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  background: '#334155',
                  borderRadius: '6px',
                }}>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                    {rank.code} - {rank.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Descriptions */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          📋 Position Descriptions
        </h2>

        {Object.entries(grouped).map(([deptName, ranks]) => (
          <div key={deptName} style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #334155',
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#60a5fa',
            }}>
              {deptName}
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {ranks.map(rank => (
                <div key={rank.code} style={{
                  padding: '1rem',
                  background: '#0f172a',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: '#3b82f6',
                        color: '#fff',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                      }}>
                        {rank.code}
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                        {rank.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      fontStyle: 'italic',
                    }}>
                      Hierarchy: #{rank.hierarchy}
                    </span>
                  </div>
                  <p style={{ 
                    color: '#d1d5db', 
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {rank.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Quick Reference */}
      <section style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🔍 Quick Reference - Position Codes
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}>
          {RANKS.map(rank => (
            <div key={rank.code} style={{
              padding: '0.5rem 0.75rem',
              background: '#0f172a',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}>
              <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{rank.code}</span>
              {' : '}
              <span style={{ color: '#d1d5db' }}>{rank.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
