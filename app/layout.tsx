import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Class Deadline Hub - Cổng Quản Lý Deadline Lớp Học PTIT',
    template: '%s | Class Deadline Hub PTIT',
  },
  description:
    'Hệ thống quản trị và tra cứu lịch nộp bài tập, tiểu luận, lab thực hành cho sinh viên Học viện Công nghệ Bưu chính Viễn thông (PTIT).',
  keywords: [
    'PTIT',
    'Deadline Hub',
    'Lập trình Web Nâng cao',
    'Quản lý bài tập',
    'Sinh viên PTIT',
  ],
  authors: [{ name: 'Ban cán sự lớp PTIT' }],
  creator: 'PTIT IT Department',
  openGraph: {
    title: 'Class Deadline Hub - Cổng Quản Lý Deadline Lớp Học PTIT',
    description:
      'Hệ thống theo dõi và cập nhật hạn nộp bài tập, thực hành và tiểu luận các môn chuyên ngành PTIT.',
    siteName: 'Class Deadline Hub',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="flex flex-col min-h-screen text-slate-800 antialiased selection:bg-rose-500 selection:text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
