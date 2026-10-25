"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, KeyRound, AlertCircle, UserCheck, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam ? "Thông tin đăng nhập không hợp lệ hoặc phiên đã hết hạn." : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Đã xảy ra sự cố trong quá trình đăng nhập.");
      setLoading(false);
    }
  };

  const handleQuickFill = (type: "admin" | "user") => {
    if (type === "admin") {
      setEmail("admin@example.com");
      setPassword("admin123");
    } else {
      setEmail("user@example.com");
      setPassword("user123");
    }
    setErrorMessage("");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Đăng Nhập Hệ Thống</h1>
            <p className="text-xs text-slate-400 mt-1">
              Thử nghiệm phân quyền NextAuth RBAC (Bài tập tuần 8)
            </p>
          </div>

          {/* Quick autofill helper cards */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 px-1">
              Điền nhanh tài khoản mẫu:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium transition-all text-left"
              >
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                <div>
                  <div className="font-semibold text-[11px]">Role: Admin</div>
                  <div className="text-[10px] text-rose-400/70">Toàn quyền</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("user")}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium transition-all text-left"
              >
                <UserCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                <div>
                  <div className="font-semibold text-[11px]">Role: User</div>
                  <div className="text-[10px] text-emerald-400/70">Tiêu chuẩn</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Địa chỉ Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com hoặc user@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123 hoặc user123"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Đăng Nhập Bằng Mật Khẩu</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Hoặc tiếp tục với
            </span>
          </div>

          {/* OAuth Provider (GitHub) */}
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Đăng Nhập Qua GitHub OAuth</span>
          </button>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Chưa rõ về cơ chế bảo mật? </span>
            <Link href="/about" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Xem báo cáo kỹ thuật 3 lớp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
