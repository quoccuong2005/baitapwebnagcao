import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Clock,
  BookOpen,
  Tag,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { getDeadlines, getDeadlineById, getSubjectById } from '@/lib/db';
import CountdownBadge from '@/components/CountdownBadge';
import DeadlineActionBox from '@/components/DeadlineActionBox';

// ISR: Tiền kết xuất tất cả các deadline đã biết tại build time và làm mới khi admin thao tác
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const deadline = await getDeadlineById(params.id);
  if (!deadline) {
    return {
      title: 'Không tìm thấy deadline',
    };
  }

  const subject = await getSubjectById(deadline.subjectId);
  const formattedDate = new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const title = `${deadline.title} (${subject?.code || 'PTIT'})`;
  const description = `Hạn chót: ${formattedDate}. Nộp qua: ${deadline.submissionType}. Môn: ${subject?.name}. ${deadline.description.slice(0, 140)}...`;

  return {
    title,
    description,
    keywords: [
      'Deadline PTIT',
      subject?.name || '',
      subject?.code || '',
      deadline.submissionType,
      ...deadline.tags,
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: deadline.createdAt,
      tags: deadline.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DeadlineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const deadline = await getDeadlineById(params.id);
  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectById(deadline.subjectId);
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Structured Data (JSON-LD) BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tất cả Deadline',
        item: `${baseUrl}/deadlines`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `${baseUrl}/deadlines/${deadline.id}`,
      },
    ],
  };

  const priorityBadge = {
    urgent: { text: 'Khẩn cấp', color: 'bg-rose-100 text-rose-800 border-rose-300' },
    high: { text: 'Ưu tiên cao', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    medium: { text: 'Trung bình', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    low: { text: 'Thấp', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  }[deadline.priority];

  return (
    <>
      {/* Structured data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/deadlines" className="hover:text-rose-600 transition-colors">
            Danh sách Deadline
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
            {deadline.title}
          </span>
        </nav>

        {/* Thẻ Chi tiết chính */}
        <article className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
          {/* Top badges & Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {subject && (
                <Link
                  href={`/subjects/${subject.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{subject.code} - {subject.name}</span>
                </Link>
              )}

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${priorityBadge.color}`}
              >
                {priorityBadge.text}
              </span>
            </div>

            <CountdownBadge dueDate={deadline.dueDate} />
          </div>

          {/* Tiêu đề & Thông tin cơ bản */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {deadline.title}
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Khởi tạo ngày:{' '}
              {new Date(deadline.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Hộp Thông tin Quan trọng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 shadow-xs shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Hạn nộp chính thức</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-xs shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Hình thức nộp bài</p>
                <p className="text-sm font-bold text-slate-800">
                  {deadline.submissionType}
                </p>
              </div>
            </div>
          </div>

          {/* Nội dung mô tả chi tiết */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Yêu cầu & Hướng dẫn nộp bài
            </h3>
            <div className="prose prose-slate text-sm sm:text-base leading-relaxed text-slate-700 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              {deadline.description}
            </div>
          </div>

          {/* Thẻ tags */}
          {deadline.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Chủ đề & Công nghệ liên quan
              </h3>
              <div className="flex flex-wrap gap-2">
                {deadline.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Box: Hoàn thành & Chia sẻ */}
          <DeadlineActionBox
            deadlineId={deadline.id}
            deadlineTitle={deadline.title}
            completedBy={deadline.completedBy}
          />
        </article>

        {/* Thông tin chiến lược render */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Chiến lược render:{' '}
            <strong className="text-slate-800">ISR (On-Demand Revalidation)</strong>
          </span>
          <span>Cập nhật tức thì khi Admin thêm/xoá</span>
        </div>
      </div>
    </>
  );
}
