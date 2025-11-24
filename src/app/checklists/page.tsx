"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ChecklistTemplate = {
  code: string;
  name: string;
  description: string;
  items: Array<{
    name: string;
    label: string;
    category: string;
    required: boolean;
  }>;
};

export default function ChecklistsPage() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch('/api/checklists');
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  }

  const getChecklistColor = (code: string) => {
    const colors: Record<string, string> = {
      PRE_JOINING: '#0ea5e9',
      MEDICAL_MLC: '#10b981',
      TRAINING_STCW: '#8b5cf6',
      DOCUMENT_VERIFICATION: '#f59e0b',
      QUALIFICATION_CHECK: '#3b82f6',
      SIGN_OFF_CHECKLIST: '#ef4444'
    };
    return colors[code] || '#64748b';
  };

  const getChecklistIcon = (code: string) => {
    const icons: Record<string, string> = {
      PRE_JOINING: '📋',
      MEDICAL_MLC: '🏥',
      TRAINING_STCW: '📚',
      DOCUMENT_VERIFICATION: '✅',
      QUALIFICATION_CHECK: '🎓',
      SIGN_OFF_CHECKLIST: '🚢'
    };
    return icons[code] || '📄';
  };

  return (
    <main style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Checklist System</h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          6 comprehensive checklists with 66 items total
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading checklists...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 20
        }}>
          {templates.map(template => {
            const requiredCount = template.items.filter(i => i.required).length;
            const optionalCount = template.items.length - requiredCount;
            
            return (
              <Link
                key={template.code}
                href={`/checklists/${template.code}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = getChecklistColor(template.code);
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                    <div style={{
                      fontSize: 40,
                      lineHeight: 1
                    }}>
                      {getChecklistIcon(template.code)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: 0,
                        marginBottom: 8,
                        fontSize: 18,
                        color: '#1e293b'
                      }}>
                        {template.name}
                      </h3>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: getChecklistColor(template.code),
                        background: `${getChecklistColor(template.code)}15`,
                        padding: '4px 10px',
                        borderRadius: 4,
                        display: 'inline-block'
                      }}>
                        {template.code}
                      </div>
                    </div>
                  </div>

                  <p style={{
                    margin: 0,
                    marginBottom: 16,
                    fontSize: 14,
                    color: '#64748b',
                    lineHeight: 1.6,
                    flex: 1
                  }}>
                    {template.description}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginBottom: 16
                  }}>
                    <div style={{
                      background: '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: 8,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
                        {template.items.length}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                        Total Items
                      </div>
                    </div>
                    <div style={{
                      background: '#fef3c7',
                      padding: '10px 12px',
                      borderRadius: 8,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#92400e' }}>
                        {requiredCount}
                      </div>
                      <div style={{ fontSize: 11, color: '#92400e', marginTop: 2 }}>
                        Required
                      </div>
                    </div>
                    <div style={{
                      background: '#dbeafe',
                      padding: '10px 12px',
                      borderRadius: 8,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1e40af' }}>
                        {optionalCount}
                      </div>
                      <div style={{ fontSize: 11, color: '#1e40af', marginTop: 2 }}>
                        Optional
                      </div>
                    </div>
                  </div>

                  {/* Categories preview */}
                  <div style={{
                    paddingTop: 16,
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                      Categories:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {[...new Set(template.items.map(i => i.category))].slice(0, 4).map(cat => (
                        <span
                          key={cat}
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            background: '#f1f5f9',
                            color: '#475569',
                            borderRadius: 4,
                            fontWeight: 500
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                      {[...new Set(template.items.map(i => i.category))].length > 4 && (
                        <span style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          color: '#64748b'
                        }}>
                          +{[...new Set(template.items.map(i => i.category))].length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    marginTop: 16,
                    fontSize: 13,
                    fontWeight: 600,
                    color: getChecklistColor(template.code),
                    textAlign: 'right'
                  }}>
                    View Details →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
