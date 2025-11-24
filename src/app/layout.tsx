
"use client";
import MainNavigation from '../components/MainNavigation';
import '../components/MainNavigation.css';
import './globals.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#10182b', fontFamily: 'system-ui, sans-serif' }}>
        {!isLogin && <MainNavigation />}
        <div style={!isLogin ? { marginLeft: 260, minHeight: '100vh' } : { minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
