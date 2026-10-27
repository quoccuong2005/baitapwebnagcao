import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="text-8xl font-black text-rose-100 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-rose-100 flex items-center justify-center text-rose-600">
            <FileQuestion className="w-8 h-8" />
          </div>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
        Không tìm thấy trang hoặc Deadline!
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        Mã ID deadline hoặc đường dẫn bạn đang truy cập không tồn tại hoặc đã bị xóa khỏi hệ thống bởi Lớp trưởng.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/deadlines"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-all shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Xem danh sách Deadline
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
