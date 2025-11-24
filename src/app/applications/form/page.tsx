'use client';

import { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import './application.css';

interface ApplicationData {
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  rankApplied: string;
  department: string;
  availableDate: string;
  expectedSalary: string;
  documents: Record<string, { hasDoc: boolean; number: string; expiry: string }>;
  seaService: Array<{
    vesselName: string;
    vesselType: string;
    rank: string;
    fromDate: string;
    toDate: string;
    reasonLeaving: string;
  }>;
  interviewDate: string;
  interviewer: string;
  technicalScore: number;
  communicationScore: number;
  appearanceScore: number;
  motivationScore: number;
  interviewNotes: string;
}

export default function ApplicationFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: 'Indonesian',
    religion: '',
    maritalStatus: 'Single',
    address: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    rankApplied: '',
    department: 'Deck',
    availableDate: '',
    expectedSalary: '',
    documents: {
      passport: { hasDoc: false, number: '', expiry: '' },
      seamanBook: { hasDoc: false, number: '', expiry: '' },
      coc: { hasDoc: false, number: '', expiry: '' },
      coe: { hasDoc: false, number: '', expiry: '' },
      medical: { hasDoc: false, number: '', expiry: '' },
      yellowFever: { hasDoc: false, number: '', expiry: '' },
      basicSafety: { hasDoc: false, number: '', expiry: '' },
    },
    seaService: [],
    interviewDate: '',
    interviewer: '',
    technicalScore: 0,
    communicationScore: 0,
    appearanceScore: 0,
    motivationScore: 0,
    interviewNotes: '',
  });

  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    { number: 1, title: 'Basic Info', form: 'HGF-CR-02' },
    { number: 2, title: 'Position', form: 'HGF-CR-02' },
    { number: 3, title: 'Documents', form: 'HGF-CR-01' },
    { number: 4, title: 'Experience', form: 'HGF-CR-02' },
    { number: 5, title: 'Interview', form: 'HGF-CR-09' },
    { number: 6, title: 'Review', form: 'Summary' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/applications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        alert('Application submitted successfully!');
      } else {
        alert('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    } finally {
      setSaving(false);
    }
  };

  const addSeaService = () => {
    setFormData({
      ...formData,
      seaService: [
        ...formData.seaService,
        {
          vesselName: '',
          vesselType: '',
          rank: '',
          fromDate: '',
          toDate: '',
          reasonLeaving: '',
        },
      ],
    });
  };

  const removeSeaService = (index: number) => {
    setFormData({
      ...formData,
      seaService: formData.seaService.filter((_, i) => i !== index),
    });
  };

  const updateSeaService = (index: number, field: string, value: string) => {
    const updated = [...formData.seaService];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, seaService: updated });
  };

  if (submitted) {
    return (
      <div className="application-container">
        <MainNavigation />
        <div className="application-content">
          <div className="success-message">
            <h3>✅ Application Submitted!</h3>
            <p>Your application has been successfully submitted for review.</p>
            <button className="back-button" onClick={() => window.location.href = '/applications'}>
              ← Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-container">
      <MainNavigation />
      
      <div className="application-content">
        <div className="application-header">
          <h1 className="application-title">Crew Application</h1>
          <p className="application-subtitle">
            HGF-CR-02 Application for Employment - ISO 9001:2015 Compliant
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep === step.number ? 'active' : ''} ${
                currentStep > step.number ? 'completed' : ''
              }`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-form">{step.form}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-container">
          {currentStep === 1 && (
            <div className="form-step">
              <h2 className="step-heading">Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name as per passport"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Place of Birth *</label>
                  <input
                    type="text"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-group">
                  <label>Nationality *</label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  >
                    <option value="Indonesian">Indonesian</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Religion</label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Complete address"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62xxx"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Name *</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Next of kin"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="+62xxx"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h2 className="step-heading">Position Applied</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Rank Applied *</label>
                  <select
                    value={formData.rankApplied}
                    onChange={(e) => setFormData({ ...formData, rankApplied: e.target.value })}
                  >
                    <option value="">Select Rank</option>
                    <optgroup label="Deck Department">
                      <option value="Master">Master</option>
                      <option value="Chief Officer">Chief Officer</option>
                      <option value="2nd Officer">2nd Officer</option>
                      <option value="3rd Officer">3rd Officer</option>
                      <option value="Bosun">Bosun</option>
                      <option value="AB">AB (Able Seaman)</option>
                      <option value="OS">OS (Ordinary Seaman)</option>
                    </optgroup>
                    <optgroup label="Engine Department">
                      <option value="Chief Engineer">Chief Engineer</option>
                      <option value="2nd Engineer">2nd Engineer</option>
                      <option value="3rd Engineer">3rd Engineer</option>
                      <option value="4th Engineer">4th Engineer</option>
                      <option value="Fitter">Fitter</option>
                      <option value="Oiler">Oiler</option>
                      <option value="Wiper">Wiper</option>
                    </optgroup>
                    <optgroup label="Catering Department">
                      <option value="Chief Cook">Chief Cook</option>
                      <option value="2nd Cook">2nd Cook</option>
                      <option value="Messman">Messman</option>
                    </optgroup>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Deck">Deck</option>
                    <option value="Engine">Engine</option>
                    <option value="Catering">Catering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Available from Date *</label>
                  <input
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Expected Salary (USD/month)</label>
                  <input
                    type="number"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                    placeholder="e.g. 2000"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h2 className="step-heading">Document Checklist (HGF-CR-01)</h2>
              <div className="documents-list">
                {Object.entries(formData.documents).map(([key, doc]) => (
                  <div key={key} className="document-item">
                    <div className="document-header">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={doc.hasDoc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documents: {
                                ...formData.documents,
                                [key]: { ...doc, hasDoc: e.target.checked },
                              },
                            })
                          }
                        />
                        <span className="document-name">
                          {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </span>
                      </label>
                    </div>
                    {doc.hasDoc && (
                      <div className="document-details">
                        <input
                          type="text"
                          placeholder="Document Number"
                          value={doc.number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documents: {
                                ...formData.documents,
                                [key]: { ...doc, number: e.target.value },
                              },
                            })
                          }
                        />
                        <input
                          type="date"
                          placeholder="Expiry Date"
                          value={doc.expiry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documents: {
                                ...formData.documents,
                                [key]: { ...doc, expiry: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <h2 className="step-heading">Sea Service Experience</h2>
              <button className="add-button" onClick={addSeaService}>
                + Add Sea Service
              </button>
              {formData.seaService.map((service, index) => (
                <div key={index} className="sea-service-item">
                  <div className="sea-service-header">
                    <h3>Sea Service #{index + 1}</h3>
                    <button
                      className="remove-button"
                      onClick={() => removeSeaService(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Vessel Name</label>
                      <input
                        type="text"
                        value={service.vesselName}
                        onChange={(e) =>
                          updateSeaService(index, 'vesselName', e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Vessel Type</label>
                      <select
                        value={service.vesselType}
                        onChange={(e) =>
                          updateSeaService(index, 'vesselType', e.target.value)
                        }
                      >
                        <option value="">Select Type</option>
                        <option value="Bulk Carrier">Bulk Carrier</option>
                        <option value="Container">Container</option>
                        <option value="Tanker">Tanker</option>
                        <option value="General Cargo">General Cargo</option>
                        <option value="Passenger">Passenger</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Rank</label>
                      <input
                        type="text"
                        value={service.rank}
                        onChange={(e) => updateSeaService(index, 'rank', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>From Date</label>
                      <input
                        type="date"
                        value={service.fromDate}
                        onChange={(e) =>
                          updateSeaService(index, 'fromDate', e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>To Date</label>
                      <input
                        type="date"
                        value={service.toDate}
                        onChange={(e) => updateSeaService(index, 'toDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Reason for Leaving</label>
                      <input
                        type="text"
                        value={service.reasonLeaving}
                        onChange={(e) =>
                          updateSeaService(index, 'reasonLeaving', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-step">
              <h2 className="step-heading">Interview Assessment (HGF-CR-09)</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Interview Date</label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) =>
                      setFormData({ ...formData, interviewDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Interviewer</label>
                  <input
                    type="text"
                    value={formData.interviewer}
                    onChange={(e) =>
                      setFormData({ ...formData, interviewer: e.target.value })
                    }
                    placeholder="Name of interviewer"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Technical Knowledge (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.technicalScore}
                    onChange={(e) =>
                      setFormData({ ...formData, technicalScore: parseInt(e.target.value) })
                    }
                  />
                  <span className="score-display">{formData.technicalScore}/10</span>
                </div>
                <div className="form-group full-width">
                  <label>Communication Skills (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.communicationScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationScore: parseInt(e.target.value),
                      })
                    }
                  />
                  <span className="score-display">{formData.communicationScore}/10</span>
                </div>
                <div className="form-group full-width">
                  <label>Appearance & Demeanor (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.appearanceScore}
                    onChange={(e) =>
                      setFormData({ ...formData, appearanceScore: parseInt(e.target.value) })
                    }
                  />
                  <span className="score-display">{formData.appearanceScore}/10</span>
                </div>
                <div className="form-group full-width">
                  <label>Motivation & Attitude (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.motivationScore}
                    onChange={(e) =>
                      setFormData({ ...formData, motivationScore: parseInt(e.target.value) })
                    }
                  />
                  <span className="score-display">{formData.motivationScore}/10</span>
                </div>
                <div className="form-group full-width">
                  <label>Interview Notes</label>
                  <textarea
                    value={formData.interviewNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, interviewNotes: e.target.value })
                    }
                    rows={5}
                    placeholder="Additional comments and observations..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="form-step">
              <h2 className="step-heading">Application Review</h2>
              <div className="review-section">
                <div className="review-group">
                  <h3>Personal Information</h3>
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>DOB:</strong> {formData.dateOfBirth}</p>
                  <p><strong>Nationality:</strong> {formData.nationality}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
                <div className="review-group">
                  <h3>Position Applied</h3>
                  <p><strong>Rank:</strong> {formData.rankApplied}</p>
                  <p><strong>Department:</strong> {formData.department}</p>
                  <p><strong>Available:</strong> {formData.availableDate}</p>
                </div>
                <div className="review-group">
                  <h3>Documents</h3>
                  {Object.entries(formData.documents).map(([key, doc]) =>
                    doc.hasDoc ? (
                      <p key={key}>
                        ✅ {key.replace(/([A-Z])/g, ' $1').toUpperCase()} - {doc.number} (Exp: {doc.expiry})
                      </p>
                    ) : null
                  )}
                </div>
                <div className="review-group">
                  <h3>Sea Service</h3>
                  {formData.seaService.map((service, index) => (
                    <p key={index}>
                      {service.vesselName} - {service.rank} ({service.fromDate} to {service.toDate})
                    </p>
                  ))}
                </div>
                <div className="review-group">
                  <h3>Interview Scores</h3>
                  <p><strong>Technical:</strong> {formData.technicalScore}/10</p>
                  <p><strong>Communication:</strong> {formData.communicationScore}/10</p>
                  <p><strong>Appearance:</strong> {formData.appearanceScore}/10</p>
                  <p><strong>Motivation:</strong> {formData.motivationScore}/10</p>
                  <p><strong>Average:</strong> {
                    ((formData.technicalScore + formData.communicationScore + 
                      formData.appearanceScore + formData.motivationScore) / 4).toFixed(1)
                  }/10</p>
                </div>
              </div>
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button className="nav-button nav-button-secondary" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            {currentStep < steps.length && (
              <button className="nav-button nav-button-primary" onClick={handleNext}>
                Next →
              </button>
            )}
            {currentStep === steps.length && (
              <button
                className="nav-button nav-button-success"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Submitting...' : '✓ Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
