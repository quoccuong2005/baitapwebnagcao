import fs from 'fs/promises';
import path from 'path';
import { Subject, Deadline, UserAccount } from '@/types';

interface DatabaseSchema {
  subjects: Subject[];
  deadlines: Deadline[];
  users: UserAccount[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function readDatabase(): Promise<DatabaseSchema> {
  try {
    const rawData = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(rawData) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading db.json:', error);
    throw new Error('Không thể đọc cơ sở dữ liệu JSON.');
  }
}

async function writeDatabase(data: DatabaseSchema): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
    throw new Error('Không thể ghi vào cơ sở dữ liệu JSON.');
  }
}

export async function getSubjects(): Promise<Subject[]> {
  const db = await readDatabase();
  return db.subjects;
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const db = await readDatabase();
  return db.subjects.find((s) => s.slug === slug) || null;
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const db = await readDatabase();
  return db.subjects.find((s) => s.id === id) || null;
}

export async function getDeadlines(): Promise<Deadline[]> {
  const db = await readDatabase();
  // Sắp xếp hạn chót tăng dần theo ngày
  return db.deadlines.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const db = await readDatabase();
  return db.deadlines.find((d) => d.id === id) || null;
}

export async function getDeadlinesBySubjectId(subjectId: string): Promise<Deadline[]> {
  const db = await readDatabase();
  return db.deadlines
    .filter((d) => d.subjectId === subjectId)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const db = await readDatabase();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<UserAccount | null> {
  const db = await readDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export async function createDeadline(
  payload: Omit<Deadline, 'id' | 'createdAt' | 'completedBy'>
): Promise<Deadline> {
  const db = await readDatabase();
  
  // Tạo ID tự tăng hoặc số nguyên tiếp theo
  const maxId = db.deadlines.reduce((max, d) => {
    const num = parseInt(d.id, 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const newId = String(maxId + 1);

  const newDeadline: Deadline = {
    ...payload,
    id: newId,
    createdAt: new Date().toISOString(),
    completedBy: [],
  };

  db.deadlines.push(newDeadline);
  await writeDatabase(db);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const db = await readDatabase();
  const initialLength = db.deadlines.length;
  db.deadlines = db.deadlines.filter((d) => d.id !== id);

  if (db.deadlines.length === initialLength) {
    return false;
  }

  await writeDatabase(db);
  return true;
}

export async function toggleDeadlineCompleted(
  deadlineId: string,
  userId: string
): Promise<Deadline | null> {
  const db = await readDatabase();
  const deadline = db.deadlines.find((d) => d.id === deadlineId);
  if (!deadline) return null;

  if (!deadline.completedBy) {
    deadline.completedBy = [];
  }

  const index = deadline.completedBy.indexOf(userId);
  if (index >= 0) {
    deadline.completedBy.splice(index, 1);
  } else {
    deadline.completedBy.push(userId);
  }

  await writeDatabase(db);
  return deadline;
}
