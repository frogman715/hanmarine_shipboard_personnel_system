'use client';

import { useState } from 'react';
import Link from 'next/link';

type ImportType = 'vessel' | 'crew' | null;

export default function ImportPage() {
  const [importType, setImportType] = useState<ImportType>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !importType) {
      setError('Please select both import type and file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = importType === 'vessel' 
        ? '/api/import/vessel-excel'
        : '/api/import/crew-list';

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Import failed');
      } else {
        setResult(data);
        setFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>📥 Import Data from Excel</h1>
        <p style={{ color: '#9ca3af', margin: '0.5rem 0 0' }}>Upload Excel files to bulk import vessel or crew data</p>
      </div>

      {/* Import Type Selection */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => {
            setImportType('vessel');
            setFile(null);
            setError(null);
            setResult(null);
          }}
          style={{
            padding: '1.5rem',
            background: importType === 'vessel' ? '#064e3b' : '#1f2937',
            border: importType === 'vessel' ? '2px solid #6ee7b7' : '2px solid #374151',
            borderRadius: '12px',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
        >
          🚢 Import Vessels
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            vessel and flag.xlsx
          </div>
        </button>

        <button
          onClick={() => {
            setImportType('crew');
            setFile(null);
            setError(null);
            setResult(null);
          }}
          style={{
            padding: '1.5rem',
            background: importType === 'crew' ? '#064e3b' : '#1f2937',
            border: importType === 'crew' ? '2px solid #6ee7b7' : '2px solid #374151',
            borderRadius: '12px',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
        >
          👥 Import Crew List
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            CREW LIST APR 2024.xlsx
          </div>
        </button>
      </div>

      {importType && (
        <>
          {/* File Upload */}
          <div
            style={{
              padding: '2rem',
              background: '#111827',
              border: '2px dashed #374151',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
              style={{
                display: 'block',
                width: '100%',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            />
            {file && (
              <div style={{ marginTop: '1rem', color: '#6ee7b7' }}>
                ✅ Selected: {file.name}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: file && !loading ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: file && !loading ? 'pointer' : 'not-allowed',
              marginBottom: '1rem',
            }}
          >
            {loading ? '⏳ Importing...' : `🚀 Import ${importType === 'vessel' ? 'Vessels' : 'Crew'}`}
          </button>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ padding: '1rem', background: '#7f1d1d', borderRadius: '8px', color: '#fca5a5', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {result && (
        <div style={{ padding: '1.5rem', background: '#064e3b', borderRadius: '8px', color: '#6ee7b7', marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>✅ Import Successful!</div>
          <div>{result.message}</div>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#d1fae5' }}>
            <div>📊 Imported: {result.imported}</div>
            <div>⏭️ Skipped: {result.skipped}</div>
            <div>📈 Total rows processed: {result.total}</div>
            {result.sheetName && <div>📄 Sheet: {result.sheetName}</div>}
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #10b981' }}>
            <Link
              href={importType === 'vessel' ? '/api/vessels' : '/crew'}
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: '#0284c7',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginRight: '0.5rem',
              }}
            >
              View {importType === 'vessel' ? 'Vessels' : 'Crew'} →
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setImportType(null);
                setFile(null);
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#374151',
                color: '#e5e7eb',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Import Another File
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1f2937', borderRadius: '8px', lineHeight: 1.6, fontSize: '0.875rem' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>ℹ️ Expected file formats:</div>
        <div style={{ color: '#9ca3af', marginBottom: '1rem' }}>
          <strong>🚢 Vessels:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>File: vessel and flag.xlsx</li>
            <li>Sheet: "FLAG"</li>
            <li>Columns: NO, NAME OF VESSSEL, FLAG, DESKRIPSI, OWNER</li>
          </ul>
        </div>
        <div style={{ color: '#9ca3af' }}>
          <strong>👥 Crew:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>File: CREW LIST APR 2024.xlsx</li>
            <li>Must have columns: NAME, RANK (optional)</li>
            <li>Any sheet will be processed</li>
          </ul>
        </div>
      </div>

      {/* Status Box */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1f2937', borderRadius: '8px', lineHeight: 1.6, fontSize: '0.875rem' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 Import Status:</div>
        <div style={{ color: '#9ca3af' }}>
          <Link href="/api/debug/import-status" target="_blank" style={{ color: '#0284c7', textDecoration: 'none' }}>
            View database summary (API endpoint) →
          </Link>
        </div>
      </div>

      <Link
        href="/dashboard"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.5rem 1rem',
          background: '#374151',
          color: '#e5e7eb',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '0.875rem',
        }}
      >
        ← Back to Dashboard
      </Link>
    </main>
  );
}
