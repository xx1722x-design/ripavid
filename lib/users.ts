import { promises as fs } from 'fs';
import path from 'path';

interface User {
  uid: string;
  email: string;
  name?: string;
  avatar?: string;
  tier: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  googleId?: string;
}

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const dir = path.dirname(DB_PATH);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
      // Directory might already exist
    }
    await fs.writeFile(DB_PATH, JSON.stringify([]));
  }
}

async function getAllUsers(): Promise<User[]> {
  await ensureDbExists();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.email === email) || null;
}

export async function getUserByGoogleId(googleId: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.googleId === googleId) || null;
}

export async function getUserById(uid: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.uid === uid) || null;
}

export async function createUser(
  email: string,
  googleId: string,
  name?: string,
  avatar?: string
): Promise<User> {
  const users = await getAllUsers();

  const newUser: User = {
    uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    avatar,
    tier: 'free',
    createdAt: new Date().toISOString(),
    googleId,
  };

  users.push(newUser);
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));

  return newUser;
}

export async function updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.uid === uid);

  if (index === -1) {
    return null;
  }

  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;

  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));

  return updatedUser;
}
