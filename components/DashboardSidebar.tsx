'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';
  const { data: session } = useSession();
  const user = session?.user;

  const navItems = [
    {
      tab: 'all',
      href: '/dashboard',
      label: 'Tổng quan công việc',
      icon: LayoutDashboard,
    },
    {
      tab: 'pending',
      href: '/dashboard?tab=pending',
      label: 'Chưa hoàn thành',
      icon: Clock,
    },
    {
      tab: 'completed',
      href: '/dashboard?tab=completed',
      label: 'Đã hoàn thành',
      icon: CheckCircle2,
    },
    {
      tab: 'overdue',
      href: '/dashboard?tab=overdue',
      label: 'Đã quá hạn',
      icon: AlertCircle,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6 shrink-0 h-fit">
      {/* Thông tin hồ sơ sinh viên */}
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-slate-800 text-sm truncate">{user?.name}</h3>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          <span
            className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
              user?.role === 'admin'
                ? 'bg-amber-100 text-amber-800 font-bold'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {user?.role === 'admin' ? 'Lớp trưởng (Admin)' : 'Sinh viên PTIT'}
          </span>
        </div>
      </div>

      {/* Menu Sidebar */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
          Không gian cá nhân
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === '/dashboard' && currentTab === item.tab;

            return (
              <Link
                key={item.tab}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Liên kết tiện ích */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
          Khám phá
        </p>
        <div className="space-y-1">
          <Link
            href="/deadlines"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Tất cả Deadline chung</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Bảng Quản trị Admin</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
