'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  GraduationCap,
  Calendar,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const user = session?.user;

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: GraduationCap },
    { href: '/deadlines', label: 'Tất cả Deadline', icon: Calendar },
    { href: '/subjects/lap-trinh-web-nang-cao', label: 'Môn học', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                Class Deadline Hub
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-rose-600 uppercase">
                PTIT Class Portal
              </span>
            </div>
          </Link>

          {/* Navigation links for desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user && (
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname.startsWith('/admin')
                    ? 'bg-amber-50 text-amber-800 shadow-xs'
                    : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Quản trị (Admin)</span>
              </Link>
            )}
          </nav>

          {/* User profile / Auth buttons */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-xl"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User info badge */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 font-bold'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role === 'admin' ? 'Lớp trưởng (Admin)' : 'Sinh viên'}
                    </span>
                  </div>
                </div>

                {/* Sign out button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors"
                  title="Đăng xuất tài khoản"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-rose-600/20 shadow-rose-600/10"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
