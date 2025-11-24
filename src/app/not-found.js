export default function NotFound() {
  return (
    <div style={{ background: '#10182b', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1 style={{ color: '#f44336', marginBottom: 16 }}>Halaman Tidak Ditemukan</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>Maaf, halaman yang kamu cari tidak tersedia.</p>
      <a href="/" style={{ padding: '8px 24px', background: '#3578e5', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>Kembali ke Dashboard</a>
    </div>
  );
}
