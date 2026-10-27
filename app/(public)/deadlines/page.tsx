import type { Metadata } from 'next';
import { Calendar, Sparkles } from 'lucide-react';
import { getDeadlines, getSubjects } from '@/lib/db';
import DeadlineFilterWrapper from '@/components/DeadlineFilterWrapper';

// ISR: Làm mới trang tĩnh tự động sau mỗi 60 giây
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tất Cả Deadline Lớp Học',
  description:
    'Danh sách tổng hợp toàn bộ bài tập lớn, thực hành, kiểm tra và hạn nộp các môn học PTIT. Tự động cập nhật ISR mỗi 60 giây.',
  openGraph: {
    title: 'Tất Cả Deadline Lớp Học | Class Deadline Hub PTIT',
    description:
      'Tra cứu lịch nộp bài, phân loại theo môn học và trạng thái hoàn thành.',
  },
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header trang */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ISR: Làm mới sau 60 giây (revalidate = 60)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Danh Sách Deadline Lớp Học
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Toàn bộ {deadlines.length} bài tập và hạn nộp. Sử dụng bộ lọc để tra cứu nhanh theo môn học hoặc trạng thái.
          </p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-500 font-medium">
          Trạng thái Render: <strong className="text-rose-600">ISR (revalidate = 60s)</strong>
        </div>
      </div>

      {/* Interactive Client Component Filter with useSession */}
      <DeadlineFilterWrapper
        initialDeadlines={deadlines}
        subjects={subjects}
      />
    </div>
  );
}
