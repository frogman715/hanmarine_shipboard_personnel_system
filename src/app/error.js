"use client";
export default function GlobalError({ error, reset }) {
  return (
    <div style={{ background: '#10182b', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1 style={{ color: '#f44336', marginBottom: 16 }}>Terjadi Error</h1>
      <pre style={{ background: '#222b', padding: 16, borderRadius: 8, color: '#fff', maxWidth: 600 }}>{error?.message || 'Unknown error'}</pre>
      <button style={{ marginTop: 24, padding: '8px 24px', background: '#3578e5', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }} onClick={() => reset()}>Coba Refresh</button>
    </div>
  );
}
