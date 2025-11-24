import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based permissions
const ROLE_PERMISSIONS = {
  OWNER: ['*'], // Full access - can view all applications and approve CVs
  DIRECTOR: ['*'], // Full access - financial authority
  ADMIN: ['*'], // Full access - manages documents and crew records
  CREWING_MANAGER: [
    '/dashboard',
    '/crew',
    '/applications',
    '/documents',
    '/forms',
    '/checklists',
    '/replacement-schedule',
    '/vessels',
    '/semester-reports',
    '/onboarding',
    '/cv-generator',
    '/certificates',
    '/recruitment',
    '/import',
  ],
  EXPERT_STAFF: [
    '/dashboard',
    '/crew',
    '/applications',
    '/documents',
    '/forms',
    '/checklists',
    '/vessels',
    '/onboarding',
    '/cv-generator',
    '/certificates',
    '/recruitment',
  ],
  DOCUMENTATION_OFFICER: [
    '/dashboard',
    '/crew',
    '/applications',
    '/documents',
    '/forms',
    '/checklists',
    '/onboarding',
    '/cv-generator',
    '/certificates',
    '/recruitment',
  ],
  ACCOUNTING_OFFICER: [
    '/dashboard',
    '/crew',
    '/applications',
    '/documents',
    '/forms',
    '/checklists',
    '/certificates',
  ],
  TRAINING_OFFICER: [
    '/dashboard',
    '/crew',
    '/applications',
    '/documents',
    '/forms',
    '/checklists',
    '/certificates',
    '/recruitment',
  ],
  OPERATIONAL_STAFF: [
    '/dashboard',
    '/crew',
    '/vessels',
    '/certificates',
    '/recruitment',
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes (no auth required)
  const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout'];
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const userSession = request.cookies.get('user_session');
  
  if (!userSession) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    const user = JSON.parse(userSession.value);
    
    // Check if user is active
    if (!user.isActive) {
      const response = NextResponse.redirect(new URL('/login?error=inactive', request.url));
      response.cookies.delete('user_session');
      return response;
    }
    
    // Check role-based permissions
    const userRole = user.role as keyof typeof ROLE_PERMISSIONS;
    const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];
    
    // Owner, Director, and Admin have full access
    if (allowedRoutes.includes('*')) {
      return NextResponse.next();
    }
    
    // Check if user has permission for this route
    const hasPermission = allowedRoutes.some(route => pathname.startsWith(route));
    
    if (!hasPermission) {
      // Redirect to dashboard if no permission
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // Invalid session, redirect to login
    const response = NextResponse.redirect(new URL('/login?error=invalid_session', request.url));
    response.cookies.delete('user_session');
    return response;
  }
}

// Apply middleware to all routes except static files and API routes (except auth)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
