import MainNavigation from '../components/MainNavigation';
import '../components/MainNavigation.css';
import './globals.css';

export const metadata = {
  title: 'HANMARINE Personnel System',
  description: 'HGQS/ISO 9001:2015 & MLC 2006',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#10182b', fontFamily: 'system-ui, sans-serif' }}>
        <MainNavigation />
        <div style={{ marginLeft: 260, minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
