import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hệ Thống Phân Quyền NextAuth & Tối Ưu SEO | Bài Tập Tuần 8",
    template: "%s | NextAuth RBAC Tuần 8",
  },
  description:
    "Dự án thực hành chuyên sâu môn Web Nâng Cao: Xác thực OAuth & Email/Password với NextAuth, phân quyền 3 lớp (Middleware, Page, Server Action) và tối ưu SEO toàn diện.",
  keywords: [
    "NextAuth",
    "Next.js 14",
    "RBAC",
    "Phân quyền",
    "Middleware",
    "Server Action",
    "SEO",
    "Canonical",
    "OpenGraph Image",
    "JSON-LD",
    "Lighthouse",
  ],
  authors: [{ name: "Sinh viên WNC" }],
  creator: "Bộ môn Web Nâng Cao",
  publisher: "Khoa CNTT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "NextAuth RBAC & SEO Tuần 8",
    title: "Hệ Thống Phân Quyền NextAuth & Tối Ưu SEO | Bài Tập Tuần 8",
    description:
      "Giải pháp bảo mật RBAC 3 lớp và chuẩn hóa SEO Google với canonical, opengraph-image và JSON-LD.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hệ Thống Phân Quyền NextAuth & Tối Ưu SEO | Bài Tập Tuần 8",
    description:
      "Tích hợp NextAuth OAuth/Credentials, phân quyền admin/user 3 lớp và tối ưu SEO.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 Bài Tập Web Nâng Cao - Tuần 8. Thực hiện bởi Sinh Viên.</p>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  NextAuth.js Active
                </span>
                <span>•</span>
                <span>Role-Based Access Control</span>
                <span>•</span>
                <span>SEO Optimized</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
