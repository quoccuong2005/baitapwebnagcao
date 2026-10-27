'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, Tag, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Deadline, Subject } from '@/types';
import CountdownBadge from '@/components/CountdownBadge';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';

interface DeadlineFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  currentUserId?: string;
  isLoggedIn: boolean;
  preselectedSubjectId?: string;
}

export default function DeadlineFilter({
  initialDeadlines,
  subjects,
  currentUserId,
  isLoggedIn,
  preselectedSubjectId,
}: DeadlineFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(
    preselectedSubjectId || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'overdue' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.id, s]));
  }, [subjects]);

  const filteredDeadlines = useMemo(() => {
    const now = new Date().getTime();

    return initialDeadlines.filter((d) => {
      // 1. Lọc theo môn học
      if (selectedSubject !== 'all' && d.subjectId !== selectedSubject) {
        return false;
      }

      // 2. Lọc theo mức độ ưu tiên
      if (priorityFilter !== 'all' && d.priority !== priorityFilter) {
        return false;
      }

      // 3. Lọc theo trạng thái
      const isCompleted = currentUserId ? d.completedBy.includes(currentUserId) : false;
      const isOverdue = new Date(d.dueDate).getTime() < now;

      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'overdue' && (isCompleted || !isOverdue)) return false;
      if (statusFilter === 'open' && (isCompleted || isOverdue)) return false;

      // 4. Lọc theo từ khóa tìm kiếm (tiêu đề, môn, thẻ tag)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const sub = subjectMap.get(d.subjectId);
        const matchTitle = d.title.toLowerCase().includes(query);
        const matchDesc = d.description.toLowerCase().includes(query);
        const matchSubject = sub?.name.toLowerCase().includes(query) || sub?.code.toLowerCase().includes(query);
        const matchTags = d.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchTitle && !matchDesc && !matchSubject && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [initialDeadlines, selectedSubject, priorityFilter, statusFilter, searchTerm, currentUserId, subjectMap]);

  return (
    <div className="space-y-6">
      {/* Thanh công cụ tìm kiếm và bộ lọc */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, bài tập, công nghệ (VD: Next.js, RSA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-xl outline-none transition-all"
            />
          </div>

          {/* Chọn Môn học */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Mức độ ưu tiên */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">Tất cả độ ưu tiên</option>
            <option value="urgent">Gấp (Urgent)</option>
            <option value="high">Cao (High)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="low">Thấp (Low)</option>
          </select>
        </div>

        {/* Tab lọc trạng thái */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium mr-1">Trạng thái:</span>
          {(
            [
              { id: 'all', label: 'Tất cả' },
              { id: 'open', label: 'Đang mở (chưa quá hạn)' },
              { id: 'overdue', label: 'Đã quá hạn' },
              { id: 'completed', label: 'Đã hoàn thành' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400">
            Hiển thị <strong>{filteredDeadlines.length}</strong> / {initialDeadlines.length} deadline
          </span>
        </div>
      </div>

      {/* Danh sách thẻ Deadline */}
      {filteredDeadlines.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Không có deadline nào phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Hãy thử thay đổi từ khoá tìm kiếm hoặc đặt lại các bộ lọc môn học và trạng thái.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('all');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeadlines.map((deadline) => {
            const subject = subjectMap.get(deadline.subjectId);
            const isCompleted = currentUserId
              ? deadline.completedBy.includes(currentUserId)
              : false;

            const priorityColors = {
              urgent: 'border-l-red-500 bg-red-50/20',
              high: 'border-l-amber-500 bg-amber-50/20',
              medium: 'border-l-blue-500 bg-blue-50/20',
              low: 'border-l-slate-400 bg-slate-50/30',
            };

            return (
              <div
                key={deadline.id}
                className={`group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-rose-200 transition-all border-l-4 ${priorityColors[deadline.priority]}`}
              >
                <div>
                  {/* Hàng thông tin môn học & countdown */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {subject ? (
                      <Link
                        href={`/subjects/${subject.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        <BookOpen className="w-3 h-3 text-rose-600" />
                        <span>{subject.code}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Chung</span>
                    )}
                    <CountdownBadge
                      dueDate={deadline.dueDate}
                      isCompleted={isCompleted}
                    />
                  </div>

                  {/* Tiêu đề deadline */}
                  <Link
                    href={`/deadlines/${deadline.id}`}
                    className="block group-hover:text-rose-600 font-bold text-slate-800 text-base leading-snug mb-2 transition-colors"
                  >
                    {deadline.title}
                  </Link>

                  {/* Tên môn học & mô tả ngắn */}
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    {subject?.name}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {deadline.description}
                  </p>

                  {/* Thẻ tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {deadline.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer thẻ: Nút chi tiết & Đánh dấu hoàn thành */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ToggleCompleteButton
                      deadlineId={deadline.id}
                      isCompleted={isCompleted}
                      isLoggedIn={isLoggedIn}
                      size="sm"
                    />
                    <Link
                      href={`/deadlines/${deadline.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold transition-colors"
                    >
                      Chi tiết
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
