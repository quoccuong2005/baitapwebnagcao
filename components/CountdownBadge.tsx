'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CountdownBadgeProps {
  dueDate: string;
  isCompleted?: boolean;
  className?: string;
}

export default function CountdownBadge({
  dueDate,
  isCompleted = false,
  className = '',
}: CountdownBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    text: string;
    status: 'urgent' | 'warning' | 'normal' | 'overdue' | 'completed';
  }>({
    text: 'Đang tính...',
    status: 'normal',
  });

  useEffect(() => {
    setMounted(true);

    function calculateTime() {
      if (isCompleted) {
        setTimeLeft({
          text: 'Đã hoàn thành',
          status: 'completed',
        });
        return;
      }

      const now = new Date().getTime();
      const target = new Date(dueDate).getTime();
      const diff = target - now;

      if (diff < 0) {
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days === 0 && hours === 0) {
          setTimeLeft({
            text: 'Vừa quá hạn',
            status: 'overdue',
          });
        } else if (days === 0) {
          setTimeLeft({
            text: `Quá hạn ${hours} giờ`,
            status: 'overdue',
          });
        } else {
          setTimeLeft({
            text: `Quá hạn ${days} ngày`,
            status: 'overdue',
          });
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days === 0) {
        if (hours === 0) {
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({
            text: `Hạn chót còn ${minutes} phút!`,
            status: 'urgent',
          });
        } else {
          setTimeLeft({
            text: `Hôm nay (còn ${hours} giờ)`,
            status: 'urgent',
          });
        }
      } else if (days <= 2) {
        setTimeLeft({
          text: `Còn ${days} ngày ${hours} giờ`,
          status: 'warning',
        });
      } else {
        setTimeLeft({
          text: `Còn ${days} ngày`,
          status: 'normal',
        });
      }
    }

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // cập nhật mỗi phút
    return () => clearInterval(interval);
  }, [dueDate, isCompleted]);

  if (!mounted) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ${className}`}
      >
        <Clock className="w-3.5 h-3.5" />
        {new Date(dueDate).toLocaleDateString('vi-VN')}
      </span>
    );
  }

  const styles = {
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    urgent: 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse',
    warning: 'bg-amber-50 text-amber-700 border border-amber-300',
    normal: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    overdue: 'bg-red-100 text-red-800 border border-red-300 font-bold',
  };

  const icons = {
    completed: <CheckCircle2 className="w-3.5 h-3.5" />,
    urgent: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
    warning: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    normal: <Clock className="w-3.5 h-3.5 text-indigo-600" />,
    overdue: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide ${styles[timeLeft.status]} ${className}`}
    >
      {icons[timeLeft.status]}
      <span>{timeLeft.text}</span>
    </span>
  );
}
