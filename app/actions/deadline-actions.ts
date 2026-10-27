'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { can, Role } from '@/lib/rbac';
import {
  createDeadline,
  deleteDeadline,
  toggleDeadlineCompleted,
} from '@/lib/db';
import { Priority } from '@/types';

const CreateDeadlineSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Tiêu đề deadline phải có ít nhất 3 ký tự.' })
    .max(120, { message: 'Tiêu đề deadline không được vượt quá 120 ký tự.' }),
  subjectId: z.string().min(1, { message: 'Vui lòng chọn môn học.' }),
  description: z
    .string()
    .min(5, { message: 'Mô tả deadline phải có ít nhất 5 ký tự.' }),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Hạn chót không hợp lệ.' }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    message: 'Mức độ ưu tiên không hợp lệ.',
  }),
  submissionType: z.enum(['LMS PTIT', 'GitHub', 'Google Form', 'Email'], {
    message: 'Hình thức nộp không hợp lệ.',
  }),
  tags: z.string().optional(),
});

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export async function createDeadlineAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user?.role as Role) || 'guest';

  // 1. Kiểm tra quyền hạn tầng Server Action (Defense-in-depth)
  if (!can(userRole, 'CREATE_DEADLINE')) {
    return {
      success: false,
      message: 'Từ chối quyền truy cập: Bạn không có quyền tạo deadline!',
    };
  }

  // 2. Validate input bằng Zod
  const rawData = {
    title: formData.get('title'),
    subjectId: formData.get('subjectId'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
    submissionType: formData.get('submissionType'),
    tags: formData.get('tags'),
  };

  const validated = CreateDeadlineSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { title, subjectId, description, dueDate, priority, submissionType, tags } =
    validated.data;

  const parsedTags = tags
    ? tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  try {
    const created = await createDeadline({
      title,
      subjectId,
      description,
      dueDate,
      priority: priority as Priority,
      submissionType,
      tags: parsedTags,
    });

    // 3. On-demand revalidation cho ISR & SSG pages
    revalidatePath('/');
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${created.id}`);
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Thêm deadline mới thành công!',
      data: created,
    };
  } catch (error) {
    console.error('Lỗi khi thêm deadline:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi máy chủ khi thêm deadline.',
    };
  }
}

export async function deleteDeadlineAction(
  deadlineId: string
): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user?.role as Role) || 'guest';

  // 1. Kiểm tra quyền hạn tầng Server Action (Defense-in-depth)
  if (!can(userRole, 'DELETE_DEADLINE')) {
    return {
      success: false,
      message: 'Từ chối quyền truy cập: Chỉ admin mới có quyền xoá deadline!',
    };
  }

  if (!deadlineId || typeof deadlineId !== 'string') {
    return {
      success: false,
      message: 'Mã deadline không hợp lệ.',
    };
  }

  try {
    const ok = await deleteDeadline(deadlineId);
    if (!ok) {
      return {
        success: false,
        message: 'Không tìm thấy deadline cần xoá.',
      };
    }

    // 2. On-demand revalidation ngay lập tức
    revalidatePath('/');
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${deadlineId}`);
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Đã xoá deadline thành công.',
    };
  } catch (error) {
    console.error('Lỗi khi xoá deadline:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi máy chủ khi xoá deadline.',
    };
  }
}

export async function toggleCompleteAction(
  deadlineId: string
): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user?.role as Role) || 'guest';
  const userId = session?.user?.id;

  // 1. Kiểm tra quyền hạn tầng Server Action
  if (!can(userRole, 'MARK_COMPLETED') || !userId) {
    return {
      success: false,
      message: 'Bạn cần đăng nhập để đánh dấu trạng thái deadline!',
    };
  }

  try {
    const updated = await toggleDeadlineCompleted(deadlineId, userId);
    if (!updated) {
      return {
        success: false,
        message: 'Không tìm thấy deadline.',
      };
    }

    // Revalidate paths
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${deadlineId}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: updated.completedBy.includes(userId)
        ? 'Đã đánh dấu hoàn thành!'
        : 'Đã chuyển sang chưa hoàn thành.',
      data: updated,
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái deadline:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi máy chủ khi cập nhật.',
    };
  }
}
