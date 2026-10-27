import { can, PERMISSIONS, Action, Role } from '../lib/rbac';

describe('RBAC can() Permission Matrix Tests', () => {
  describe('Guest role permissions', () => {
    it('allows guest to VIEW_DEADLINE', () => {
      expect(can('guest', 'VIEW_DEADLINE')).toBe(true);
    });

    it('denies guest from MARK_COMPLETED', () => {
      expect(can('guest', 'MARK_COMPLETED')).toBe(false);
    });

    it('denies guest from CREATE_DEADLINE', () => {
      expect(can('guest', 'CREATE_DEADLINE')).toBe(false);
    });

    it('denies guest from DELETE_DEADLINE', () => {
      expect(can('guest', 'DELETE_DEADLINE')).toBe(false);
    });

    it('handles undefined or null role as guest', () => {
      expect(can(undefined, 'VIEW_DEADLINE')).toBe(true);
      expect(can(null, 'VIEW_DEADLINE')).toBe(true);
      expect(can(undefined, 'CREATE_DEADLINE')).toBe(false);
      expect(can(null, 'MARK_COMPLETED')).toBe(false);
    });
  });

  describe('User role permissions', () => {
    it('allows user to VIEW_DEADLINE', () => {
      expect(can('user', 'VIEW_DEADLINE')).toBe(true);
    });

    it('allows user to MARK_COMPLETED', () => {
      expect(can('user', 'MARK_COMPLETED')).toBe(true);
    });

    it('denies user from CREATE_DEADLINE', () => {
      expect(can('user', 'CREATE_DEADLINE')).toBe(false);
    });

    it('denies user from DELETE_DEADLINE', () => {
      expect(can('user', 'DELETE_DEADLINE')).toBe(false);
    });
  });

  describe('Admin role permissions', () => {
    it('allows admin to perform all actions', () => {
      const actions: Action[] = [
        'VIEW_DEADLINE',
        'MARK_COMPLETED',
        'CREATE_DEADLINE',
        'DELETE_DEADLINE',
      ];
      actions.forEach((action) => {
        expect(can('admin', action)).toBe(true);
      });
    });
  });

  describe('Permission matrix integrity', () => {
    it('has full coverage for all roles and actions', () => {
      const roles: Role[] = ['guest', 'user', 'admin'];
      const actions: Action[] = [
        'VIEW_DEADLINE',
        'MARK_COMPLETED',
        'CREATE_DEADLINE',
        'DELETE_DEADLINE',
      ];

      roles.forEach((r) => {
        expect(PERMISSIONS[r]).toBeDefined();
        actions.forEach((a) => {
          expect(typeof PERMISSIONS[r][a]).toBe('boolean');
        });
      });
    });
  });
});
