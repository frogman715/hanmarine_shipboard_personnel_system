'use client';

import { useState, useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import './forms.css';

interface Form {
  code: string;
  title: string;
  file: string;
  pages: number;
}

interface FormCategory {
  title: string;
  description: string;
  forms: Form[];
}

interface FormsData {
  [key: string]: FormCategory;
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormsData>({});
  const [totals, setTotals] = useState({ crewing: 0, admin: 0, accounting: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, [selectedCategory, searchQuery]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/forms/list?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setForms(data.forms);
        setTotals(data.totals);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (formCode: string, category: string, filename: string) => {
    try {
      setDownloading(formCode);
      const response = await fetch(
        `/api/forms/download?code=${formCode}&category=${category}&file=${encodeURIComponent(filename)}`
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download form');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading form');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="forms-page-container">
      <MainNavigation />
      
      <div className="forms-content">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">
                HGQS Forms Library
                <span className="iso-badge">ISO 9001:2015</span>
                <span className="iso-badge">MLC 2006</span>
              </h1>
              <p className="page-subtitle">
                Hanmarine Global Quality System - Complete Forms Collection
              </p>
            </div>
            <a href="/forms/generate" className="generate-link">
              ✨ Generate Pre-Filled Forms
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totals.total}</div>
            <div className="stat-label">Total Forms</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totals.crewing}</div>
            <div className="stat-label">Crewing Forms</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totals.admin}</div>
            <div className="stat-label">Admin/HR Forms</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totals.accounting}</div>
            <div className="stat-label">Accounting Forms</div>
          </div>
        </div>

        <div className="controls-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search forms by code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="category-filters">
            <button 
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Forms
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'crewing' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('crewing')}
            >
              Crewing (CR)
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('admin')}
            >
              Admin/HR (AD)
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'accounting' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('accounting')}
            >
              Accounting (AC)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">⏳ Loading forms...</div>
        ) : Object.keys(forms).length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📋</div>
            <div className="no-results-title">No forms found</div>
            <div className="no-results-text">
              Try adjusting your search or filters
            </div>
          </div>
        ) : (
          <div className="forms-grid">
            {Object.entries(forms).map(([catKey, category]) => (
              <div key={catKey} className="category-section">
                <div className="category-header">
                  <h2 className="category-title">{category.title}</h2>
                  <p className="category-desc">{category.description}</p>
                </div>
                <div className="forms-list">
                  {category.forms.map((form) => (
                    <div key={form.code} className="form-card">
                      <div className="form-info">
                        <div className="form-code">{form.code}</div>
                        <div className="form-title">{form.title}</div>
                        <div className="form-meta">
                          {form.pages} page{form.pages > 1 ? 's' : ''} • {
                            form.file.endsWith('.xlsx') || form.file.endsWith('.xls') 
                              ? 'Excel' 
                              : 'Word'
                          } Document
                        </div>
                      </div>
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(form.code, catKey, form.file)}
                        disabled={downloading === form.code}
                      >
                        {downloading === form.code ? (
                          <>⏳ Downloading...</>
                        ) : (
                          <>📥 Download</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
