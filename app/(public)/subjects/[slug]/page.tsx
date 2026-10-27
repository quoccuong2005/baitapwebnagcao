import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import {
  BookOpen,
  User,
  Award,
  Calendar,
  ArrowLeft,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubjectId } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import CountdownBadge from '@/components/CountdownBadge';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';

// SSG: Tiền kết xuất tất cả các môn học tại build time
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({
    slug: subject.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) {
    return {
      title: 'Không tìm thấy môn học',
    };
  }

  return {
    title: `${subject.code} - ${subject.name}`,
    description: `Danh sách bài tập và deadline môn ${subject.name} (${subject.code}) - Giảng viên: ${subject.lecturer}`,
    openGraph: {
      title: `${subject.code} - ${subject.name} | Class Deadline Hub`,
      description: subject.description,
    },
  };
}

export default async function SubjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) {
    notFound();
  }

  const [deadlines, session] = await Promise.all([
    getDeadlinesBySubjectId(subject.id),
    getServerSession(authOptions),
  ]);

  const currentUserId = session?.user?.id;
  const isLoggedIn = !!session?.user;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Nút quay lại */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ</span>
      </Link>

      {/* Header môn học */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mã môn: {subject.code}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {subject.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4 text-rose-600" />
              <span>GV: <strong>{subject.lecturer}</strong></span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Award className="w-4 h-4 text-amber-500" />
              <span><strong>{subject.credits}</strong> Tín chỉ</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-600 leading-relaxed max-w-4xl">
          {subject.description}
        </p>
      </div>

      {/* Danh sách Deadlines của môn */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Danh sách bài tập & hạn nộp ({deadlines.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Chiến lược render: SSG (Static Site Generation)
          </span>
        </div>

        {deadlines.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            Hiện tại môn học này chưa có deadline nào được giao.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deadlines.map((deadline) => {
              const isCompleted = currentUserId
                ? deadline.completedBy.includes(currentUserId)
                : false;

              return (
                <div
                  key={deadline.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-rose-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        {deadline.submissionType}
                      </span>
                      <CountdownBadge
                        dueDate={deadline.dueDate}
                        isCompleted={isCompleted}
                      />
                    </div>

                    <Link
                      href={`/deadlines/${deadline.id}`}
                      className="block font-bold text-slate-900 hover:text-rose-600 text-base mb-2 transition-colors"
                    >
                      {deadline.title}
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {deadline.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {deadline.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(deadline.dueDate).toLocaleDateString('vi-VN')}
                    </span>

                    <div className="flex items-center gap-2">
                      <ToggleCompleteButton
                        deadlineId={deadline.id}
                        isCompleted={isCompleted}
                        isLoggedIn={isLoggedIn}
                        size="sm"
                      />
                      <Link
                        href={`/deadlines/${deadline.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold transition-colors"
                      >
                        Chi tiết
                      </Link>
                    </div>
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
