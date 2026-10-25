"use client";

import { useState } from "react";
import { triggerProtectedServerAction, ActionResponse } from "@/app/actions/admin-actions";
import { ShieldAlert, Play, Loader2, CheckCircle2, XCircle } from "lucide-react";

export function ServerActionTester({ userRole }: { userRole: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResponse | null>(null);

  const handleRunAction = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await triggerProtectedServerAction();
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi gọi Server Action";
      setResult({
        success: false,
        error: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Thử Nghiệm Lớp 3: Gọi Server Action Có Kiểm Tra Quyền</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Hành động này được bảo vệ ở cấp độ hàm máy chủ (`use server`). Chỉ role <span className="text-rose-400 font-mono font-semibold">admin</span> mới được phép thực thi.
          </p>
        </div>

        <button
          onClick={handleRunAction}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
            userRole === "admin"
              ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          }`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Thực thi Server Action Ngay</span>
        </button>
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
            result.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-rose-500/10 border-rose-500/30 text-rose-200"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold block mb-1">
                {result.success ? "THÀNH CÔNG: Quyền Admin được xác nhận!" : "TỪ CHỐI: Server Action đã chặn yêu cầu!"}
              </span>
              <p className="font-mono text-[11px] opacity-90 break-words">
                {result.success ? result.message : result.error}
              </p>
              {Boolean(result.data) && (
                <pre className="mt-2 p-2 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
