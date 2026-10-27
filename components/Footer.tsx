import Link from 'next/link';
import { GraduationCap, Github, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm text-slate-600 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Class Deadline Hub</p>
            <p className="text-slate-400 text-[11px]">Học viện Công nghệ Bưu chính Viễn thông (PTIT)</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-500 font-medium">
          <Link href="/deadlines" className="hover:text-rose-600 transition-colors">
            Deadlines
          </Link>
          <Link href="/subjects/lap-trinh-web-nang-cao" className="hover:text-rose-600 transition-colors">
            Môn học
          </Link>
          <Link href="/login" className="hover:text-rose-600 transition-colors">
            Đăng nhập
          </Link>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-slate-400">
            Next.js 14 App Router &bull; SSG / ISR / SSR
          </span>
        </div>
      </div>
    </footer>
  );
}
