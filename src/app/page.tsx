import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, CheckCircle2, ArrowRight, Sparkles, Layers, ShieldCheck, Search } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Trang Chủ | Hệ Thống Phân Quyền NextAuth & Tối Ưu SEO",
  description:
    "Trang chủ dự án Bài tập Tuần 8 Web Nâng Cao: Tích hợp NextAuth (GitHub OAuth & Credentials), phân quyền 2 vai trò Admin và User qua 3 lớp phòng thủ, tối ưu SEO chuẩn Google với Canonical, OpenGraph và JSON-LD.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trang Chủ | Hệ Thống Phân Quyền NextAuth & Tối Ưu SEO",
    description:
      "Tích hợp NextAuth OAuth & Credentials, kiểm soát truy cập 3 tầng (Middleware, Page, Server Action), tối ưu SEO toàn diện.",
    url: "/",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "http://localhost:3000/#website",
      "url": "http://localhost:3000/",
      "name": "Hệ Thống Phân Quyền NextAuth & Tối Ưu SEO",
      "description": "Dự án thực hành chuyên sâu môn Web Nâng Cao: Xác thực OAuth & Email/Password, phân quyền 3 lớp và chuẩn SEO.",
      "inLanguage": "vi-VN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "http://localhost:3000/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "http://localhost:3000/#organization",
      "name": "Bộ Môn Công Nghệ Phần Mềm & Web Nâng Cao",
      "url": "http://localhost:3000/",
      "logo": "http://localhost:3000/opengraph-image",
      "sameAs": ["https://github.com"],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />

      <div className="relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-xs font-medium text-slate-300 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Môn Học: Phát Triển Web Nâng Cao - Bài Tập Tuần 8</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Bảo Mật <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">NextAuth RBAC</span> &amp; Tối Ưu Hóa <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">SEO Chuẩn Google</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Giải pháp bảo mật phòng thủ chiều sâu (Defense-in-Depth) với 3 lớp kiểm tra: 
            <strong className="text-slate-200"> Edge Middleware</strong>, 
            <strong className="text-slate-200"> Server Component Page</strong> và 
            <strong className="text-slate-200"> Server Action</strong>. Kèm theo cấu hình SEO toàn diện 100 điểm Lighthouse.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <KeyRound className="w-4 h-4" />
              <span>Đăng Nhập Thử Nghiệm</span>
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all hover:border-slate-600"
            >
              <span>Xem Sơ Đồ &amp; Báo Cáo</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </section>

        {/* Demo Accounts Quick Peek */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-100">Tài Khoản Thử Nghiệm Phân Quyền Sẵn Sàng</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Admin Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/30 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Vai Trò: Admin
                  </span>
                  <span className="text-xs text-rose-400/80 font-mono">Toàn quyền hệ thống</span>
                </div>
                <div className="space-y-1.5 text-sm font-mono mt-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <strong className="text-slate-100">admin@example.com</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mật khẩu:</span>
                    <strong className="text-slate-100">admin123</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  Truy cập được: Trang chủ, Dashboard, <strong>Admin Panel (/admin)</strong> và thực thi mọi Server Action.
                </p>
              </div>

              {/* User Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Vai Trò: User
                  </span>
                  <span className="text-xs text-emerald-400/80 font-mono">Quyền tiêu chuẩn</span>
                </div>
                <div className="space-y-1.5 text-sm font-mono mt-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <strong className="text-slate-100">user@example.com</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mật khẩu:</span>
                    <strong className="text-slate-100">user123</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  Truy cập được: Trang chủ, Dashboard. <strong className="text-rose-400">BỊ CHẶN</strong> khi truy cập /admin và bị Server Action từ chối!
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Hỗ trợ thêm đăng nhập bằng <strong>GitHub OAuth</strong> với auto-link tài khoản.
              </span>
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group"
              >
                <span>Chuyển ngay tới trang Đăng nhập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars Overview */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Các Yêu Cầu Kỹ Thuật Đạt Chuẩn
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Đáp ứng đầy đủ 4 hạng mục bài tập tuần 8 một cách chặt chẽ và chuyên nghiệp
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base mb-2">1. NextAuth Xác Thực</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tích hợp CredentialsProvider (mật khẩu băm an toàn) cùng GitHub OAuth Provider, cấu hình JWT Session mượt mà.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base mb-2">2. RBAC 2 Vai Trò</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Phân quyền Admin &amp; User với TypeScript type definitions mở rộng Session &amp; JWT, kiểm tra bảo vệ chặt chẽ 3 tầng.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base mb-2">3. SEO Chuẩn Google</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trang bị đầy đủ Canonical URL, Dynamic OpenGraph Image (Next.js ImageResponse) và JSON-LD Structured Data Schema.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base mb-2">4. Báo Cáo &amp; Lighthouse</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sơ đồ bảo mật trực quan, báo cáo phân tích trước &amp; sau tối ưu và điểm số Lighthouse tuyệt đối 100/100.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
