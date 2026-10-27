import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: '403 - Không Có Quyền Truy Cập',
  description: 'Bạn không có quyền quản trị để truy cập vào khu vực này.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="text-8xl font-black text-rose-100 select-none">403</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
        Truy Cập Bị Từ Chối (403 Forbidden)
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        Trang Quản trị (Admin) chỉ dành riêng cho Lớp trưởng. Tài khoản hiện tại của bạn không có quyền thực hiện thao tác này.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Về Dashboard cá nhân
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
