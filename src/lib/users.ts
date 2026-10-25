import bcrypt from "bcryptjs";
import { Role } from "@/types/next-auth";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar: string;
  createdAt: string;
}

// In-memory user database with pre-hashed passwords
// Passwords:
// admin@example.com -> "admin123"
// user@example.com -> "user123"
const initialUsers: AppUser[] = [
  {
    id: "usr_admin_001",
    name: "Quản Trị Viên (Admin)",
    email: "admin@example.com",
    // bcrypt hash of "admin123" (cost 10)
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-01-15T08:00:00.000Z",
  },
  {
    id: "usr_user_002",
    name: "Người Dùng Tiêu Chuẩn (User)",
    email: "user@example.com",
    // bcrypt hash of "user123" (cost 10)
    passwordHash: bcrypt.hashSync("user123", 10),
    role: "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-02-10T10:30:00.000Z",
  },
];

// In-memory store that can be mutated during runtime (e.g. Server Actions)
export const db = {
  users: [...initialUsers],
  logs: [
    { id: "log_1", action: "Hệ thống khởi tạo thành công", timestamp: new Date(Date.now() - 3600000).toISOString(), user: "Hệ thống" },
    { id: "log_2", action: "Quản trị viên cập nhật cấu hình bảo mật", timestamp: new Date(Date.now() - 1800000).toISOString(), user: "admin@example.com" },
    { id: "log_3", action: "Người dùng đăng nhập lần đầu", timestamp: new Date(Date.now() - 600000).toISOString(), user: "user@example.com" },
  ],
  announcements: [
    { id: "ann_1", title: "Chào mừng đến với Hệ thống Phân quyền NextAuth", content: "Dự án mẫu thực hiện RBAC 3 lớp và tối ưu SEO toàn diện.", createdAt: new Date().toISOString() }
  ]
};

export async function findUserByEmail(email: string): Promise<AppUser | undefined> {
  const normalized = email.toLowerCase().trim();
  return db.users.find((u) => u.email.toLowerCase() === normalized);
}

export async function verifyUserCredentials(email: string, passwordPlain: string): Promise<AppUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isValid) return null;

  return user;
}
