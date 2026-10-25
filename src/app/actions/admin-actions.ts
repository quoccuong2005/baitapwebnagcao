"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/users";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

/**
 * Server Action 1: Xóa bản ghi nhật ký hệ thống (Yêu cầu role Admin)
 * Kiểm tra xác thực và phân quyền trực tiếp ở tầng Server Action (Layer 3)
 */
export async function deleteSystemLogAction(logId: string): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);

  // Kiểm tra 1: Người dùng đã đăng nhập chưa?
  if (!session || !session.user) {
    return {
      success: false,
      error: "401 Unauthorized: Yêu cầu đăng nhập trước khi thực hiện thao tác.",
    };
  }

  // Kiểm tra 2: Người dùng có vai trò Admin không?
  if (session.user.role !== "admin") {
    return {
      success: false,
      error: `403 Forbidden: Tài khoản "${session.user.email}" với vai trò "${session.user.role}" KHÔNG CÓ QUYỀN thực hiện hành động xóa dữ liệu hệ thống. Chỉ Quản trị viên (Admin) mới có quyền này!`,
    };
  }

  // Thực thi hành động cho Admin
  const index = db.logs.findIndex((l) => l.id === logId);
  if (index !== -1) {
    const deleted = db.logs.splice(index, 1)[0];
    revalidatePath("/admin");
    return {
      success: true,
      message: `[Server Action Bảo Vệ] Đã xóa thành công log: "${deleted.action}" bởi Admin (${session.user.email}).`,
    };
  }

  return {
    success: false,
    error: `Không tìm thấy bản ghi log với ID: ${logId}`,
  };
}

/**
 * Server Action 2: Đăng thông báo toàn hệ thống (Yêu cầu role Admin)
 */
export async function createAnnouncementAction(title: string, content: string): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      success: false,
      error: "401 Unauthorized: Vui lòng đăng nhập.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      error: `403 Forbidden: Người dùng với vai trò "${session.user.role}" không được phép đăng thông báo hệ thống!`,
    };
  }

  if (!title.trim() || !content.trim()) {
    return {
      success: false,
      error: "Tiêu đề và nội dung thông báo không được để trống.",
    };
  }

  const newAnn = {
    id: `ann_${Date.now()}`,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  db.announcements.unshift(newAnn);
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `[Server Action Bảo Vệ] Đã tạo thông báo mới "${title}" thành công!`,
    data: newAnn,
  };
}

/**
 * Server Action 3: Thử nghiệm phân quyền tức thì (Interactive RBAC Test Action)
 * Dành cho người dùng thử nghiệm bấm nút từ Dashboard hoặc Admin page để kiểm tra tầng Server Action
 */
export async function triggerProtectedServerAction(): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      success: false,
      error: "401 Unauthorized: Bạn chưa đăng nhập session.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      error: `[Lớp 3: Server Action chặn thành công!] Quyền hạn hiện tại: role="${session.user.role}". Server Action chỉ cho phép role="admin". Thao tác bị hủy bỏ để đảm bảo an toàn.`,
    };
  }

  return {
    success: true,
    message: `[Lớp 3: Server Action xác thực thành công!] Xin chào Admin (${session.user.name})! Bạn có đầy đủ quyền thực thi các mutation tối mật trên hệ thống.`,
    data: {
      timestamp: new Date().toISOString(),
      user: session.user,
    },
  };
}
