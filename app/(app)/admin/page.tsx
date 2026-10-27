import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import {
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  Clock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getDeadlines, getSubjects } from '@/lib/db';
import CreateDeadlineForm from '@/components/CreateDeadlineForm';
import DeleteDeadlineButton from '@/components/DeleteDeadlineButton';
import CountdownBadge from '@/components/CountdownBadge';

// SSR: Server-side rendering cho trang admin
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bảng Điều Khiển Quản Trị (Admin)',
  description: 'Trang quản trị dành riêng cho Lớp trưởng: Thêm và Xoá Deadline lớp học.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  // 1. Defense-in-depth: Kiểm tra phân quyền ngay tại server component trang /admin
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'admin') {
    redirect('/403');
  }

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Khu vực Quản trị &bull; Lớp trưởng PTIT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quản Trị Deadline Lớp Học
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Thêm mới hoặc xoá bài tập. Hệ thống sẽ kích hoạt <strong>On-Demand ISR Revalidation</strong> tự động cập nhật ngay lập tức.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-2xl text-xs text-center">
              <p className="text-slate-400">Tổng Deadline</p>
              <p className="text-lg font-black text-rose-400">{deadlines.length}</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-2xl text-xs text-center">
              <p className="text-slate-400">Môn học</p>
              <p className="text-lg font-black text-amber-400">{subjects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Thêm Deadline */}
      <CreateDeadlineForm subjects={subjects} />

      {/* Danh Sách Quản Lý & Xoá Deadline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Danh Sách Deadline Hiện Có ({deadlines.length})
            </h2>
            <p className="text-xs text-slate-500">
              Chỉ Admin mới có quyền thực hiện nút Xoá trên từng dòng.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
            SSR: Kiểm tra quyền Admin
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-3">Môn học</th>
                <th className="py-3 px-3">Tiêu đề bài tập</th>
                <th className="py-3 px-3">Hạn chót</th>
                <th className="py-3 px-3">Độ ưu tiên</th>
                <th className="py-3 px-3">Hình thức</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deadlines.map((deadline) => {
                const subject = subjectMap.get(deadline.subjectId);
                return (
                  <tr key={deadline.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                      {subject ? (
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-rose-600" />
                          {subject.code}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-800 max-w-xs truncate">
                      <Link
                        href={`/deadlines/${deadline.id}`}
                        className="hover:text-rose-600 transition-colors"
                      >
                        {deadline.title}
                      </Link>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-2">
                        <CountdownBadge dueDate={deadline.dueDate} />
                        <span>
                          {new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          deadline.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : deadline.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {deadline.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500">
                      {deadline.submissionType}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/deadlines/${deadline.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Xem trang chi tiết"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <DeleteDeadlineButton
                          deadlineId={deadline.id}
                          deadlineTitle={deadline.title}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
