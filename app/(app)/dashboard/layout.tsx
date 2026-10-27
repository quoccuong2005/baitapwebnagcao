import { Suspense } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <Suspense fallback={<div className="w-full lg:w-64 h-80 bg-white rounded-2xl animate-pulse" />}>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 w-full min-w-0">{children}</main>
    </div>
  );
}
