'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createDeadlineAction } from '@/app/actions/deadline-actions';
import { Subject } from '@/types';

export default function CreateDeadlineForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    errors?: Record<string, string[]>;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFeedback({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    const result = await createDeadlineAction(null, formData);

    setIsPending(false);

    if (result.success) {
      setFeedback({
        type: 'success',
        message: result.message || 'Thêm deadline mới thành công!',
      });
      formRef.current?.reset();
      router.refresh();
    } else {
      setFeedback({
        type: 'error',
        message: result.message || 'Có lỗi xảy ra khi tạo deadline.',
        errors: result.errors,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Thêm Deadline Mới</h2>
          <p className="text-xs text-slate-500">
            Dữ liệu sẽ được lưu vào file JSON server và cập nhật tức thì (ISR on-demand).
          </p>
        </div>
      </div>

      {feedback.type && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">{feedback.message}</p>
            {feedback.errors && (
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-600">
                {Object.entries(feedback.errors).map(([field, errs]) => (
                  <li key={field}>{errs.join(', ')}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Tiêu đề & Môn học */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề Deadline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="VD: Báo cáo thực hành Buổi 4: Redux Toolkit..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Môn học <span className="text-rose-500">*</span>
            </label>
            <select
              name="subjectId"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hạn nộp, Mức độ ưu tiên & Nơi nộp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hạn chót (Due Date) <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mức độ ưu tiên <span className="text-rose-500">*</span>
            </label>
            <select
              name="priority"
              defaultValue="high"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
            >
              <option value="urgent">Gấp (Urgent)</option>
              <option value="high">Cao (High)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="low">Thấp (Low)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hình thức nộp bài <span className="text-rose-500">*</span>
            </label>
            <select
              name="submissionType"
              defaultValue="LMS PTIT"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
            >
              <option value="LMS PTIT">Hệ thống LMS PTIT</option>
              <option value="GitHub">GitHub Repository</option>
              <option value="Google Form">Google Form</option>
              <option value="Email">Email Giảng viên</option>
            </select>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Mô tả chi tiết yêu cầu <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Nêu rõ định dạng file nộp, cấu trúc thư mục hoặc lưu ý làm bài..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Thẻ tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Thẻ tags phân loại (cách nhau bằng dấu phẩy)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="Next.js, Tailwind, BTL, Báo cáo..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý & revalidate...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Tạo Deadline và Cập Nhật Toàn Hệ Thống</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
