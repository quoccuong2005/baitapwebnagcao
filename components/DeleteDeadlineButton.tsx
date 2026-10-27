'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteDeadlineAction } from '@/app/actions/deadline-actions';

interface DeleteDeadlineButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export default function DeleteDeadlineButton({
  deadlineId,
  deadlineTitle,
}: DeleteDeadlineButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteDeadlineAction(deadlineId);
      if (res.success) {
        setIsConfirming(false);
        router.refresh();
      } else {
        alert(res.message);
      }
    });
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1.5 animate-fadeIn">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1"
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            'Xác nhận xoá'
          )}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-2 py-1 text-xs font-medium rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
        >
          Huỷ
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      title={`Xoá deadline: ${deadlineTitle}`}
      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
