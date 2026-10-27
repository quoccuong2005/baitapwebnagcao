'use client';

import { useSession } from 'next-auth/react';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';
import ShareButton from '@/components/ShareButton';

interface DeadlineActionBoxProps {
  deadlineId: string;
  deadlineTitle: string;
  completedBy: string[];
}

export default function DeadlineActionBox({
  deadlineId,
  deadlineTitle,
  completedBy,
}: DeadlineActionBoxProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const isLoggedIn = !!session?.user;
  const isCompleted = currentUserId ? completedBy.includes(currentUserId) : false;

  return (
    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <ToggleCompleteButton
          deadlineId={deadlineId}
          isCompleted={isCompleted}
          isLoggedIn={isLoggedIn}
          size="md"
        />
        {!isLoggedIn && (
          <span className="text-xs text-slate-500">
            (Đăng nhập tài khoản sinh viên để lưu trạng thái)
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <ShareButton title={deadlineTitle} />
      </div>
    </div>
  );
}
