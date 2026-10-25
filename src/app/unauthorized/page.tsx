"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShieldAlert, ArrowLeft, LogIn, Lock, CheckCircle2 } from "lucide-react";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-block mb-3">
          403 Forbidden • Quyền Truy Cập Bị Từ Chối
        </span>

        <h1 className="text-2xl font-black text-slate-100 tracking-tight mb-3">
          Bạn Không Có Quyền Truy Cập Tuyến Đường Này!
        </h1>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Tuyến đường <code className="text-rose-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{from}</code> yêu cầu đặc quyền của <strong className="text-rose-300">Quản Trị Viên (Admin)</strong>.
        </p>

        {/* Protection insight box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Cơ Chế Phân Quyền Vừa Kích Hoạt:</span>
          </div>
          <p className="text-slate-400">
            Tài khoản hiện tại của bạn: <strong className="text-slate-200">{session?.user?.email || "Chưa xác định"}</strong>
          </p>
          <p className="text-slate-400">
            Vai trò được cấp: <span className="text-emerald-400 font-bold uppercase">{session?.user?.role || "user"}</span>
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Lớp 1 (Middleware) đã chặn thành công và bảo vệ khu vực quản trị an toàn.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Dashboard</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-600/30"
          >
            <LogIn className="w-4 h-4" />
            <span>Đổi Sang Tài Khoản Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
