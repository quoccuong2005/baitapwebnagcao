import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/users";
import { ShieldAlert, Users } from "lucide-react";
import { AdminControls } from "@/components/admin/AdminControls";

export const metadata = {
  title: "Admin Panel - Trung Tâm Quản Trị Tối Mật",
  description: "Trang quản trị hệ thống được bảo vệ 3 lớp: Middleware, SSR Page và Server Actions.",
};

export default async function AdminPage() {
  // Layer 2: Server Component Verification (Phòng thủ tầng Page)
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect(`/unauthorized?from=/admin&role=${session.user.role}`);
  }

  const { user } = session;
  const allUsers = db.users;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* Admin Header */}
      <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Lớp 2: Server Component Đã Xác Thực
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Trung Tâm Quản Trị Hệ Thống (Admin Panel)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Bạn đang đăng nhập với tư cách: <strong className="text-slate-200">{user.name}</strong> ({user.email})
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Role: ADMIN Verified</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Tổng Tài Khoản</span>
            <span className="text-xl font-bold text-slate-100 font-mono">{allUsers.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Quản Trị Viên</span>
            <span className="text-xl font-bold text-rose-400 font-mono">
              {allUsers.filter((u) => u.role === "admin").length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Người Dùng Tiêu Chuẩn</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">
              {allUsers.filter((u) => u.role === "user").length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Audit Logs</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{db.logs.length}</span>
          </div>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">Danh Sách Người Dùng Trong Hệ Thống</h2>
          </div>
          <span className="text-xs text-slate-500">Dữ liệu nội bộ Server-Side</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-2.5 px-3 font-semibold">User ID</th>
                <th className="py-2.5 px-3 font-semibold">Họ Tên</th>
                <th className="py-2.5 px-3 font-semibold">Email</th>
                <th className="py-2.5 px-3 font-semibold">Vai Trò</th>
                <th className="py-2.5 px-3 font-semibold">Mật Khẩu Hash</th>
                <th className="py-2.5 px-3 font-semibold">Ngày Tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">{u.id}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{u.name}</td>
                  <td className="py-2.5 px-3 text-indigo-300">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        u.role === "admin"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[140px]" title={u.passwordHash}>
                    {u.passwordHash.slice(0, 18)}...
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Controls Component (Server Action Layer 3) */}
      <AdminControls initialLogs={db.logs} />
    </div>
  );
}
