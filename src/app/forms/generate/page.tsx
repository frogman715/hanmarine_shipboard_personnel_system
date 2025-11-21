'use client';

import { useState, useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import './generate.css';

interface Crew {
  id: number;
  crewCode: string;
  fullName: string;
  rank: string;
  status: string;
  vessel: string | null;
}

interface FormOption {
  code: string;
  title: string;
  category: string;
}

export default function GenerateFormsPage() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<number | null>(null);
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const formOptions: FormOption[] = [
    // Crewing Forms
    { code: 'HGF-CR-01', title: 'Document Checklist', category: 'crewing' },
    { code: 'HGF-CR-02', title: 'Application for Employment', category: 'crewing' },
    { code: 'HGF-CR-03', title: 'Crew Database', category: 'crewing' },
    { code: 'HGF-CR-04', title: 'Crew Record Book', category: 'crewing' },
    { code: 'HGF-CR-05', title: 'Crew List', category: 'crewing' },
    { code: 'HGF-CR-06', title: 'Crew Change Off Signer', category: 'crewing' },
    { code: 'HGF-CR-07', title: 'Crew Change On Signer', category: 'crewing' },
    { code: 'HGF-CR-08', title: 'Crew Transit Info', category: 'crewing' },
    { code: 'HGF-CR-09', title: 'Interview Assessment', category: 'crewing' },
    { code: 'HGF-CR-10', title: 'Certificate Record', category: 'crewing' },
    { code: 'HGF-CR-11', title: 'Certificate Monitoring', category: 'crewing' },
    { code: 'HGF-CR-12', title: 'PreJoining Medical', category: 'crewing' },
    { code: 'HGF-CR-13', title: 'Crew Performance', category: 'crewing' },
    { code: 'HGF-CR-14', title: 'Crew Evaluation', category: 'crewing' },
    { code: 'HGF-CR-15', title: 'POEA Contract', category: 'crewing' },
    { code: 'HGF-CR-16', title: 'Crew Replacement Plan', category: 'crewing' },
    { code: 'HGF-CR-17', title: 'Crew Payroll', category: 'crewing' },
    
    // Admin Forms
    { code: 'HGF-AD-01', title: 'Meeting Agenda', category: 'admin' },
    { code: 'HGF-AD-02', title: 'Meeting Minutes', category: 'admin' },
    { code: 'HGF-AD-03', title: 'Training Request', category: 'admin' },
    { code: 'HGF-AD-04', title: 'Training Record', category: 'admin' },
    { code: 'HGF-AD-07', title: 'Internal Audit Guide', category: 'admin' },
    { code: 'HGF-AD-08', title: 'Annual Audit Plan', category: 'admin' },
    { code: 'HGF-AD-09', title: 'Internal Audit Report', category: 'admin' },
    { code: 'HGF-AD-10', title: 'Corrective Action Request', category: 'admin' },
    { code: 'HGF-AD-11', title: 'Preventive Action Request', category: 'admin' },
    { code: 'HGF-AD-15', title: 'CPAR Log', category: 'admin' },
    
    // Accounting Forms
    { code: 'HGF-AC-01', title: 'Payment Request', category: 'accounting' },
    { code: 'HGF-AC-02', title: 'Invoice', category: 'accounting' },
    { code: 'HGF-AC-03', title: 'Receipt', category: 'accounting' },
  ];

  useEffect(() => {
    loadCrews();
  }, []);

  const loadCrews = async () => {
    try {
      const response = await fetch('/api/crew');
      if (response.ok) {
        const data = await response.json();
        setCrews(data);
      }
    } catch (error) {
      console.error('Error loading crews:', error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCrew || !selectedForm) {
      alert('Please select both crew and form');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crewId: selectedCrew,
          formCode: selectedForm,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedForm}_${Date.now()}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('✅ Document generated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to generate document: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document');
    } finally {
      setGenerating(false);
    }
  };

  const filteredCrews = crews.filter((crew) =>
    crew.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crew.crewCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredForms = formOptions.filter((form) =>
    categoryFilter === 'all' || form.category === categoryFilter
  );

  const selectedCrewData = crews.find((c) => c.id === selectedCrew);
  const selectedFormData = formOptions.find((f) => f.code === selectedForm);

  return (
    <div className="generate-container">
      <MainNavigation />
      
      <div className="generate-content">
        <div className="generate-header">
          <h1 className="generate-title">Generate Pre-Filled Forms</h1>
          <p className="generate-subtitle">
            Auto-fill HGQS forms with crew data - ISO 9001:2015 Compliant
          </p>
        </div>

        <div className="generate-grid">
          {/* Step 1: Select Crew */}
          <div className="generate-section">
            <div className="section-header">
              <h2 className="section-title">Step 1: Select Crew</h2>
              <span className="section-badge">
                {selectedCrew ? '✓' : '1'}
              </span>
            </div>

            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or crew code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="crew-list">
              {filteredCrews.length === 0 ? (
                <p className="no-results">No crew found</p>
              ) : (
                filteredCrews.slice(0, 10).map((crew) => (
                  <div
                    key={crew.id}
                    className={`crew-card ${selectedCrew === crew.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCrew(crew.id)}
                  >
                    <div className="crew-info">
                      <h3 className="crew-name">{crew.fullName}</h3>
                      <p className="crew-details">
                        {crew.rank} • {crew.vessel || 'No vessel'}
                      </p>
                    </div>
                    <span className="crew-code">{crew.crewCode}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Step 2: Select Form */}
          <div className="generate-section">
            <div className="section-header">
              <h2 className="section-title">Step 2: Select Form</h2>
              <span className="section-badge">
                {selectedForm ? '✓' : '2'}
              </span>
            </div>

            <div className="category-filters">
              <button
                className={`category-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All Forms
              </button>
              <button
                className={`category-btn ${categoryFilter === 'crewing' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('crewing')}
              >
                Crewing
              </button>
              <button
                className={`category-btn ${categoryFilter === 'admin' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('admin')}
              >
                Admin
              </button>
              <button
                className={`category-btn ${categoryFilter === 'accounting' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('accounting')}
              >
                Accounting
              </button>
            </div>

            <div className="form-list">
              {filteredForms.map((form) => (
                <div
                  key={form.code}
                  className={`form-card ${selectedForm === form.code ? 'selected' : ''}`}
                  onClick={() => setSelectedForm(form.code)}
                >
                  <div className="form-code">{form.code}</div>
                  <div className="form-title">{form.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Generate */}
        {selectedCrew && selectedForm && (
          <div className="generate-preview">
            <h3 className="preview-title">Ready to Generate</h3>
            <div className="preview-info">
              <div className="preview-item">
                <strong>Crew:</strong> {selectedCrewData?.fullName} ({selectedCrewData?.crewCode})
              </div>
              <div className="preview-item">
                <strong>Form:</strong> {selectedFormData?.code} - {selectedFormData?.title}
              </div>
            </div>
            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? '⏳ Generating...' : '📄 Generate Document'}
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="info-box">
          <h4 className="info-title">📋 How it works</h4>
          <ul className="info-list">
            <li>Select a crew member from your database</li>
            <li>Choose which HGQS form to generate</li>
            <li>System automatically fills all crew data into the template</li>
            <li>Download pre-filled Word/Excel document ready for review</li>
            <li>All placeholders like fullName, rank, certificates are replaced</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
