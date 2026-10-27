export type Role = 'admin' | 'user' | 'guest';

export type Action =
  | 'VIEW_DEADLINE'
  | 'MARK_COMPLETED'
  | 'CREATE_DEADLINE'
  | 'DELETE_DEADLINE';

export const PERMISSIONS: Record<Role, Record<Action, boolean>> = {
  guest: {
    VIEW_DEADLINE: true,
    MARK_COMPLETED: false,
    CREATE_DEADLINE: false,
    DELETE_DEADLINE: false,
  },
  user: {
    VIEW_DEADLINE: true,
    MARK_COMPLETED: true,
    CREATE_DEADLINE: false,
    DELETE_DEADLINE: false,
  },
  admin: {
    VIEW_DEADLINE: true,
    MARK_COMPLETED: true,
    CREATE_DEADLINE: true,
    DELETE_DEADLINE: true,
  },
};

/**
 * Kiểm tra quyền hạn duy nhất tập trung (Single Source of Truth)
 * @param role Vai trò người dùng ('admin' | 'user' | 'guest')
 * @param action Hành động cần thực hiện
 * @returns boolean
 */
export function can(role: Role | undefined | null, action: Action): boolean {
  const currentRole: Role = role || 'guest';
  const rolePermissions = PERMISSIONS[currentRole];
  if (!rolePermissions) return false;
  return rolePermissions[action] ?? false;
}
