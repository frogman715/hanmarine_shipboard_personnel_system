import { FaUserTie, FaUsers, FaUserPlus, FaFileInvoiceDollar } from 'react-icons/fa';

const modules = [
  {
    icon: <FaUserTie size={32} color="#3faaff" />, title: 'Shore Personnel',
    desc: 'Rekrutmen, seleksi, dan onboarding staf darat.',
    badge: 'HGQS PM-3',
    link: '/hr/shore-personnel'
  },
  {
    icon: <FaUsers size={32} color="#3faaff" />, title: 'Employees',
    desc: 'Manajemen data dan administrasi karyawan.',
    badge: 'HR',
    link: '/employees'
  },
  {
    icon: <FaUserPlus size={32} color="#3faaff" />, title: 'Recruitment',
    desc: 'Proses rekrutmen dan seleksi tenaga kerja.',
    badge: 'HR',
    link: '/recruitment'
  },
  {
    icon: <FaFileInvoiceDollar size={32} color="#3faaff" />, title: 'HR/Admin/Purchasing',
    desc: 'Administrasi SDM, pengadaan, dan dokumen pendukung.',
    badge: 'Annex E',
    link: '/hr/admin-purchasing'
  },
];

export default function HRPage() {
  return (
    <div style={{ marginLeft: 260, padding: '32px 24px', minHeight: '100vh', background: 'none' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 10, color: '#fff' }}>HR Operations</h1>
      <div style={{ color: '#b6c3e6', fontSize: '1.1rem', marginBottom: 32, maxWidth: 700 }}>
        Modul HR sesuai Main Manual & Procedure Manual. Pilih salah satu modul di bawah untuk mengelola data karyawan, rekrutmen, dan administrasi HR.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 28, maxWidth: 900 }}>
        {modules.map((m) => (
          <div key={m.title} style={{
            background: 'linear-gradient(135deg, #1a2540 60%, #22335a 100%)',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            padding: '28px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            minHeight: 180
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              {m.icon}
              <span style={{ fontWeight: 700, fontSize: 20, color: '#fff' }}>{m.title}</span>
              <span style={{ marginLeft: 10, background: '#22335a', color: '#ffd700', fontWeight: 700, fontSize: 12, borderRadius: 8, padding: '2px 10px', letterSpacing: 1 }}>{m.badge}</span>
            </div>
            <div style={{ color: '#b6c3e6', fontSize: 15, marginBottom: 18 }}>{m.desc}</div>
            <a href={m.link} style={{
              marginTop: 'auto',
              background: 'linear-gradient(90deg, #3faaff 60%, #1e90ff 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 8,
              padding: '8px 18px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(63,170,255,0.10)',
              letterSpacing: 0.5,
              transition: 'background 0.2s, color 0.2s',
              display: 'inline-block'
            }}>View Module →</a>
          </div>
        ))}
      </div>
    </div>
  );
}
