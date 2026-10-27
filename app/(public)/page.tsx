import Link from 'next/link';
import {
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import { getDeadlines, getSubjects } from '@/lib/db';
import CountdownBadge from '@/components/CountdownBadge';

// SSG: Mặc định trang tĩnh được render lúc build time
export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);

  const now = new Date().getTime();
  const upcomingDeadlines = deadlines.filter((d) => new Date(d.dueDate).getTime() >= now);
  const urgentCount = deadlines.filter((d) => d.priority === 'urgent' && new Date(d.dueDate).getTime() >= now).length;

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-transparent pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-6 tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cổng Quản Lý Deadline Lớp Học &bull; PTIT IT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Không bao giờ trễ hẹn với{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-500">
              Class Deadline Hub
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Theo dõi toàn diện lịch nộp bài tập lớn, lab thực hành và bài kiểm tra các môn chuyên ngành.
            Dữ liệu tập trung, chia sẻ có xem trước sinh động và cập nhật tức thì.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/deadlines"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md shadow-rose-600/20 hover:scale-102"
            >
              <Calendar className="w-4 h-4" />
              <span>Xem tất cả Deadline ({deadlines.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-sm hover:scale-102"
            >
              <span>Vào Dashboard của tôi</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-black text-rose-600">{deadlines.length}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Tổng số Deadline</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-black text-amber-500">{urgentCount}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Hạn chót khẩn cấp</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-black text-emerald-600">{upcomingDeadlines.length}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Đang mở nộp bài</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-black text-indigo-600">{subjects.length}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Môn học kích hoạt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Chương trình đào tạo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Các Môn Học Trong Kỳ (SSG)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const count = deadlines.filter((d) => d.subjectId === subject.id).length;
            return (
              <Link
                key={subject.id}
                href={`/subjects/${subject.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700">
                      {subject.code}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {subject.credits} tín chỉ
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-rose-600 text-lg mb-2 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {subject.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">
                    <strong>{count}</strong> bài tập / deadline
                  </span>
                  <span className="text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Upcoming Deadlines Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Cần chú ý
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Hạn Chót Sắp Tới Gần Nhất
            </h2>
          </div>
          <Link
            href="/deadlines"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingDeadlines.slice(0, 3).map((deadline) => {
            const subject = subjectMap.get(deadline.subjectId);
            return (
              <div
                key={deadline.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      {subject?.code}
                    </span>
                    <CountdownBadge dueDate={deadline.dueDate} />
                  </div>
                  <Link
                    href={`/deadlines/${deadline.id}`}
                    className="block font-bold text-slate-900 hover:text-rose-600 text-base mb-2 transition-colors"
                  >
                    {deadline.title}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {deadline.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Nộp qua: <strong>{deadline.submissionType}</strong>
                  </span>
                  <Link
                    href={`/deadlines/${deadline.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    Xem chi tiết <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
              Kiến trúc Rendering Next.js 14
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-4">
              Tối ưu hoá hiệu năng với Đa chiến lược Render
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Hệ thống kết hợp hoàn hảo <strong>SSG</strong> cho các trang tĩnh ít đổi, <strong>ISR</strong> cho trang danh sách và chi tiết deadline với khả năng làm mới tự động (60s) hoặc làm mới theo yêu cầu khi Admin thao tác, và <strong>SSR</strong> cho Dashboard cá nhân và trang Quản trị viên.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-rose-400 text-sm mb-1">SSG (Trang chủ & Môn học)</p>
                <p className="text-slate-400">Tốc độ tức thì nhờ CDN caching, tối ưu SEO tuyệt đối.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-amber-400 text-sm mb-1">ISR (Deadlines & Detail)</p>
                <p className="text-slate-400">Làm mới sau 60s hoặc tức thì ngay khi Admin thêm/xoá.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-emerald-400 text-sm mb-1">SSR (Dashboard & Admin)</p>
                <p className="text-slate-400">Kiểm tra phiên đăng nhập và quyền hạn cá nhân hoá mỗi request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
