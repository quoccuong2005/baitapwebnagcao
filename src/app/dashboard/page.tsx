import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/users";
import { Shield, ShieldAlert, ArrowRight, Bell } from "lucide-react";
import { ServerActionTester } from "@/components/dashboard/ServerActionTester";

export const metadata = {
  title: "Dashboard Cá Nhân",
  description: "Trang tổng quan người dùng và khu vực kiểm tra phân quyền bảo mật NextAuth.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const { user } = session;
  const isAdmin = user.role === "admin";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* Header Profile Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{user.name}</h1>
                <span
                  className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                    isAdmin
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  Role: {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>

          {/* Admin link badge */}
          <div>
            {isAdmin ? (
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/25"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Mở Admin Panel Toàn Quyền</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all group"
                title="Thử click để xem Middleware chặn vai trò user như thế nào!"
              >
                <Shield className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
                <span>Thử truy cập /admin (Sẽ bị chặn)</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Session details */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-500 block">User ID:</span>
            <span className="text-slate-300">{user.id}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Cơ chế Session:</span>
            <span className="text-indigo-400">JWT Strategy (Mã hóa SHA)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Trạng thái quyền:</span>
            <span className={isAdmin ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {isAdmin ? "✓ Cấp quyền Administrator" : "✓ Giới hạn Standard User"}
            </span>
          </div>
        </div>
      </div>

      {/* Layer 3 Server Action Interactive Tester */}
      <div className="mb-8">
        <ServerActionTester userRole={user.role} />
      </div>

      {/* Announcements and Live Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-100">Thông Báo Hệ Thống</h2>
        </div>

        <div className="space-y-3">
          {db.announcements.map((ann) => (
            <div key={ann.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h3 className="font-semibold text-xs text-slate-200 mb-1">{ann.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
              <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                {new Date(ann.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
