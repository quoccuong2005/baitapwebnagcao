import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

// E. SEO: Không lập chỉ mục trang /login
export const metadata: Metadata = {
  title: 'Đăng Nhập Cổng Deadline Lớp Học',
  description: 'Đăng nhập để theo dõi và quản lý các deadline học tập.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
