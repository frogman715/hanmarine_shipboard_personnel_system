import ConditionalLayout from '../components/ConditionalLayout';
import './globals.css';

export const metadata = {
  title: 'HANMARINE Personnel System',
  description: 'HGQS/ISO 9001:2015 & MLC 2006',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#10182b', fontFamily: 'system-ui, sans-serif' }}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
