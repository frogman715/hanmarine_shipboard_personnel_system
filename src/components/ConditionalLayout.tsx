'use client';

import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';
import './MainNavigation.css';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should NOT show navigation (public routes)
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (isPublicRoute) {
    // For public routes (like login), render full-width without navigation
    return (
      <div style={{ minHeight: '100vh' }}>
        {children}
      </div>
    );
  }

  // For authenticated routes, render with navigation sidebar
  return (
    <>
      <MainNavigation />
      <div style={{ marginLeft: 260, minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
}
