
import { useEffect, useState } from 'react';

type Employee = { name?: string };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulasi fetch data, ganti dengan fetch API asli jika ada
    async function fetchEmployees() {
      try {
        // const res = await fetch('/api/employees');
        // const data = await res.json();
        // setEmployees(data);
        setEmployees([]); // Ganti [] dengan data asli jika sudah ada API
      } catch (e) {
        setError('Gagal memuat data employees.');
      }
    }
    fetchEmployees();
  }, []);

  return (
    <div style={{ marginLeft: 260, padding: '32px 24px', color: '#fff' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Employees</h1>
      <p style={{ color: '#b6c3e6', fontSize: '1.1rem' }}>
        Data dan administrasi karyawan kantor (office staff).
      </p>
      {error && <div style={{ color: 'red', margin: '16px 0' }}>{error}</div>}
      <div style={{ marginTop: 32 }}>
        {employees.length === 0 ? (
          <div style={{ color: '#b6c3e6' }}>Belum ada data employees.</div>
        ) : (
          <ul>
            {employees.map((emp, idx) => (
              <li key={idx}>{emp?.name ?? '-'}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}