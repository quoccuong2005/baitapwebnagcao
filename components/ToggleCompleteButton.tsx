'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CheckCircle2, Circle } from 'lucide-react';
import { toggleCompleteAction } from '@/app/actions/deadline-actions';

interface ToggleCompleteButtonProps {
  deadlineId: string;
  isCompleted: boolean;
  isLoggedIn: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ToggleCompleteButton({
  deadlineId,
  isCompleted: initialCompleted,
  isLoggedIn,
  size = 'md',
}: ToggleCompleteButtonProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/deadlines/${deadlineId}`);
      return;
    }

    // Optimistic UI update
    setCompleted(!completed);

    startTransition(async () => {
      const res = await toggleCompleteAction(deadlineId);
      if (!res.success) {
        // Rollback if failed
        setCompleted(completed);
        alert(res.message);
      } else {
        router.refresh();
      }
    });
  };

  if (size === 'sm') {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        title={
          !isLoggedIn
            ? 'Đăng nhập để đánh dấu hoàn thành'
            : completed
            ? 'Đánh dấu chưa hoàn thành'
            : 'Đánh dấu đã hoàn thành'
        }
        className={`p-1.5 rounded-lg border transition-all ${
          completed
            ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-400 hover:text-slate-600'
        } ${isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <Check className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm ${
        completed
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
      } ${isPending ? 'opacity-70 cursor-wait' : ''}`}
    >
      {completed ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Đã hoàn thành</span>
        </>
      ) : (
        <>
          <Circle className="w-4 h-4 text-slate-400" />
          <span>{isLoggedIn ? 'Đánh dấu đã xong' : 'Đăng nhập để đánh dấu'}</span>
        </>
      )}
    </button>
  );
}
