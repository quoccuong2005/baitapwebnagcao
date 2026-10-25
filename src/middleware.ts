import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_wnc_tuan_8_2026" 
  });
  
  const { pathname } = req.nextUrl;
  const isAuth = !!token;
  const isAuthPage = pathname.startsWith("/login");
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

  // 1. Đã đăng nhập mà cố vào lại /login -> điều hướng về /dashboard
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Bảo vệ các trang Quản trị Admin: Yêu cầu đăng nhập + Role là "admin"
  if (isAdminPage) {
    if (!isAuth) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role không phải admin -> Chuyển hướng sang trang báo lỗi 403 Forbidden
    if (token.role !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", req.url);
      unauthorizedUrl.searchParams.set("from", pathname);
      unauthorizedUrl.searchParams.set("role", (token.role as string) || "user");
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  }

  // 3. Bảo vệ các trang yêu cầu người dùng đăng nhập (cả user & admin đều vào được)
  if (isProtectedPage) {
    if (!isAuth) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
  ],
};
