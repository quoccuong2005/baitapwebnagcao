import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getDeadlines, getSubjects } from '@/lib/db';
import CountdownBadge from '@/components/CountdownBadge';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';

// SSR: Render động theo phiên người dùng trên mỗi request
export const dynamic = 'force-dynamic';

// SEO: Không lập chỉ mục trang /dashboard
export const metadata: Metadata = {
  title: 'Bảng Điều Khiển Sinh Viên',
  description: 'Theo dõi tiến độ hoàn thành deadline và bài tập cá nhân.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userId = session.user.id;
  const currentTab = searchParams.tab || 'all';

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const now = new Date().getTime();

  // Phân loại thống kê cá nhân
  const completedDeadlines = deadlines.filter((d) => d.completedBy.includes(userId));
  const pendingDeadlines = deadlines.filter(
    (d) => !d.completedBy.includes(userId) && new Date(d.dueDate).getTime() >= now
  );
  const overdueDeadlines = deadlines.filter(
    (d) => !d.completedBy.includes(userId) && new Date(d.dueDate).getTime() < now
  );

  const completionRate = deadlines.length > 0
    ? Math.round((completedDeadlines.length / deadlines.length) * 100)
    : 0;

  // Lọc theo tab
  let displayDeadlines = deadlines;
  let tabTitle = 'Tất cả Deadline';

  if (currentTab === 'completed') {
    displayDeadlines = completedDeadlines;
    tabTitle = 'Deadline Đã Hoàn Thành';
  } else if (currentTab === 'pending') {
    displayDeadlines = pendingDeadlines;
    tabTitle = 'Deadline Đang Chờ Nộp';
  } else if (currentTab === 'overdue') {
    displayDeadlines = overdueDeadlines;
    tabTitle = 'Deadline Đã Quá Hạn';
  }

  return (
    <div className="space-y-8">
      {/* Header chào mừng */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tiến độ cá nhân: {completionRate}%</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Xin chào, {session.user.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chào mừng bạn đến với không gian quản lý tiến độ bài tập cá nhân tại PTIT.
          </p>
        </div>

        {/* Thanh tiến độ trực quan */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[240px]">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600">Hoàn thành</span>
            <span className="text-rose-600">{completedDeadlines.length} / {deadlines.length}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thẻ thống kê 4 cột */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard"
          className={`p-5 rounded-2xl border transition-all ${
            currentTab === 'all'
              ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Tổng số việc</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{deadlines.length}</p>
        </Link>

        <Link
          href="/dashboard?tab=pending"
          className={`p-5 rounded-2xl border transition-all ${
            currentTab === 'pending'
              ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700">Chưa xong</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingDeadlines.length}</p>
        </Link>

        <Link
          href="/dashboard?tab=completed"
          className={`p-5 rounded-2xl border transition-all ${
            currentTab === 'completed'
              ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700">Đã xong</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{completedDeadlines.length}</p>
        </Link>

        <Link
          href="/dashboard?tab=overdue"
          className={`p-5 rounded-2xl border transition-all ${
            currentTab === 'overdue'
              ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700">Quá hạn</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{overdueDeadlines.length}</p>
        </Link>
      </div>

      {/* Danh sách Deadlines */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{tabTitle}</h2>
            <p className="text-xs text-slate-500">
              Hiển thị {displayDeadlines.length} công việc trong danh mục này.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            Chiến lược: SSR (Server-Side Rendering)
          </span>
        </div>

        {displayDeadlines.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Không có deadline nào trong mục này</p>
            <p className="text-xs text-slate-400 mt-1">Tuyệt vời! Bạn đang theo kịp tất cả tiến độ học tập.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayDeadlines.map((deadline) => {
              const subject = subjectMap.get(deadline.subjectId);
              const isCompleted = deadline.completedBy.includes(userId);

              return (
                <div
                  key={deadline.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all gap-4 ${
                    isCompleted
                      ? 'bg-slate-50/60 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <ToggleCompleteButton
                      deadlineId={deadline.id}
                      isCompleted={isCompleted}
                      isLoggedIn={true}
                      size="sm"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">
                          {subject?.code}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <CountdownBadge
                          dueDate={deadline.dueDate}
                          isCompleted={isCompleted}
                        />
                      </div>

                      <Link
                        href={`/deadlines/${deadline.id}`}
                        className={`font-bold text-base hover:text-rose-600 transition-colors ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {deadline.title}
                      </Link>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {deadline.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>

                    <Link
                      href={`/deadlines/${deadline.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      Chi tiết <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
