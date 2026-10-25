"use client";

import { useState } from "react";
import { deleteSystemLogAction, createAnnouncementAction, ActionResponse } from "@/app/actions/admin-actions";
import { Trash2, PlusCircle, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface AdminControlsProps {
  initialLogs: Array<{ id: string; action: string; timestamp: string; user: string }>;
}

export function AdminControls({ initialLogs }: AdminControlsProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submittingAnn, setSubmittingAnn] = useState(false);
  const [notification, setNotification] = useState<ActionResponse | null>(null);

  const handleDeleteLog = async (id: string) => {
    setDeletingId(id);
    setNotification(null);

    try {
      const res = await deleteSystemLogAction(id);
      setNotification(res);
      if (res.success) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi gọi Server Action xóa log";
      setNotification({
        success: false,
        error: msg,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmittingAnn(true);
    setNotification(null);

    try {
      const res = await createAnnouncementAction(title, content);
      setNotification(res);
      if (res.success) {
        setTitle("");
        setContent("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tạo thông báo qua Server Action";
      setNotification({
        success: false,
        error: msg,
      });
    } finally {
      setSubmittingAnn(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 shadow-lg transition-all ${
            notification.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-rose-500/10 border-rose-500/30 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="font-medium font-mono">{notification.message || notification.error}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Grid: Create Announcement & System Audit Logs */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form: Post Announcement */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <PlusCircle className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Đăng Thông Báo Toàn Hệ Thống (Server Action)
            </h3>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tiêu đề thông báo</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lịch bảo trì bảo mật định kỳ..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nội dung chi tiết</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung thông báo gửi đến toàn thể người dùng..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={submittingAnn}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-rose-600/30 transition-all"
            >
              {submittingAnn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Tạo Thông Báo Qua Server Action</span>
            </button>
          </form>
        </div>

        {/* System Logs with Deletion Server Action */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Nhật Ký Bảo Mật (Audit Logs)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {logs.length} bản ghi
            </span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Không còn bản ghi nhật ký nào.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-200 truncate">{log.action}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                      <span>Bởi: {log.user}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString("vi-VN")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    disabled={deletingId === log.id}
                    title="Xóa log này bằng Server Action (Yêu cầu quyền Admin)"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                  >
                    {deletingId === log.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
