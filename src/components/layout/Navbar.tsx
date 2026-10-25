"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Shield, ShieldAlert, LogIn, LogOut, LayoutDashboard, FileText, Home } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: "Trang Chủ", icon: Home, public: true },
    { href: "/about", label: "Kiến Trúc & Báo Cáo", icon: FileText, public: true },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, protected: true },
    { href: "/admin", label: "Admin Panel", icon: ShieldAlert, adminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
              <span>NextAuth RBAC</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Tuần 8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Next.js 14 • SEO • 3-Layer Security</p>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            // Highlight admin link specially
            if (link.adminOnly && session?.user?.role !== "admin") {
              // still show with lock badge so user can test clicking it!
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                } ${link.adminOnly ? "hover:border-rose-500/40" : ""}`}
              >
                <Icon className={`w-4 h-4 ${link.adminOnly ? "text-rose-400" : ""}`} />
                <span>{link.label}</span>
                {link.adminOnly && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 ml-0.5">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User state */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-200 leading-tight">
                  {session.user.name}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    session.user.role === "admin"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  Role: {session.user.role}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
