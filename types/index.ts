import { Role } from '@/lib/rbac';

export interface Subject {
  id: string;
  code: string;
  name: string;
  slug: string;
  lecturer: string;
  credits: number;
  color: string;
  description: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Deadline {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  dueDate: string; // ISO format e.g. "2026-11-15T23:59:00"
  priority: Priority;
  tags: string[];
  submissionType: 'LMS PTIT' | 'GitHub' | 'Google Form' | 'Email';
  completedBy: string[]; // List of user IDs who marked this as completed
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string; // Stored securely/checked
  name: string;
  role: Role;
  studentId?: string;
  avatar?: string;
}
