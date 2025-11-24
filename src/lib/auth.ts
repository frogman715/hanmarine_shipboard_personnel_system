import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers'

export interface User {
  id: number
  username: string
  email: string
  fullName: string
  role: string
  isActive: boolean
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const userSession = cookieStore.get('user_session')

    if (!userSession) {
      return null
    }

    const user = JSON.parse(userSession.value)
    return user
  } catch (error) {
    return null
  }
}

export function hasRole(user: User | null, roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false
  
  const ROLE_PERMISSIONS: Record<string, string[]> = {
    DIRECTOR: ['*'],
    CREWING_MANAGER: ['/dashboard', '/crew', '/applications', '/replacement-schedule', '/vessels', '/semester-reports', '/owners'],
    EXPERT_STAFF: ['/dashboard', '/crew', '/applications', '/vessels'],
    DOCUMENTATION_OFFICER: ['/dashboard', '/crew', '/applications'],
    ACCOUNTING_OFFICER: ['/dashboard', '/crew', '/applications'],
    TRAINING_OFFICER: ['/dashboard', '/crew', '/applications'],
    OPERATIONAL_STAFF: ['/dashboard', '/crew', '/vessels'],
  }
  
  const allowedRoutes = ROLE_PERMISSIONS[user.role] || []
  
  if (allowedRoutes.includes('*')) return true
  
  return allowedRoutes.some(allowed => route.startsWith(allowed))
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    DIRECTOR: 'Director',
    CREWING_MANAGER: 'Crewing Manager',
    EXPERT_STAFF: 'Expert Staff',
    DOCUMENTATION_OFFICER: 'Documentation Officer',
    ACCOUNTING_OFFICER: 'Accounting Officer',
    TRAINING_OFFICER: 'Training Officer',
    OPERATIONAL_STAFF: 'Operational Staff',
  }
  
  return roleNames[role] || role
}

export function getRoleColor(role: string): string {
  const roleColors: Record<string, string> = {
    DIRECTOR: '#dc2626',
    CREWING_MANAGER: '#0ea5e9',
    EXPERT_STAFF: '#8b5cf6',
    DOCUMENTATION_OFFICER: '#10b981',
    ACCOUNTING_OFFICER: '#f59e0b',
    TRAINING_OFFICER: '#3b82f6',
    OPERATIONAL_STAFF: '#6b7280',
  }
  
  return roleColors[role] || '#6b7280'
}

/**
 * Basic API Key authentication middleware.
 * Returns null if valid, or a NextResponse error otherwise.
 */
export function validateApiKey(req: NextRequest): NextResponse | null {
  // For now, allow requests with no key (dev mode).
  // In production, check: const key = req.headers.get('x-api-key');
  // if (!key || key !== process.env.API_KEY) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  return null;
}

/**
 * Helper to safely parse and validate JSON body.
 */
export async function safeParseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/**
 * Helper to return a 400 Bad Request response.
 */
export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Helper to return a 404 Not Found response.
 */
export function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Helper to return a 500 Internal Server Error response.
 */
export function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 });
}
