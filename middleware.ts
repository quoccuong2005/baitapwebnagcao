import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/lib/rbac';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'class-deadline-hub-ptit-secret-2026',
  });

  const isAuthenticated = !!token;
  const userRole = (token?.role as Role) || 'guest';

  // 1. Kiểm tra quyền truy cập /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Kiểm tra quyền truy cập /admin
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng không phải admin -> Chuyển hướng tới /403
    if (userRole !== 'admin') {
      const forbiddenUrl = new URL('/403', request.url);
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
