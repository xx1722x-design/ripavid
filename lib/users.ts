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

// In-memory store (primary for Vercel serverless)
const memoryStore = new Map<string, User>();

// File path for local development
const DB_PATH = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';

// Check if file system is writable
async function isFileSystemWritable(): Promise<boolean> {
  if (isProduction) {
    // Vercel serverless environment
    return false;
  }
  try {
    const testFile = path.join(process.cwd(), '.fs-test');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    return true;
  } catch {
    return false;
  }
}

async function ensureDbExists() {
  if (isProduction) return; // Skip in production

  try {
    await fs.access(DB_PATH);
  } catch {
    const dir = path.dirname(DB_PATH);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
      // Directory might already exist
    }
    try {
      await fs.writeFile(DB_PATH, JSON.stringify([]));
    } catch {
      // File system not writable - use memory only
      console.warn('[Users] File system not writable, using memory store only');
    }
  }
}

async function loadUsersFromFile(): Promise<User[]> {
  if (isProduction) return [];

  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function getAllUsers(): Promise<User[]> {
  // First check memory store
  if (memoryStore.size > 0) {
    return Array.from(memoryStore.values());
  }

  // Try to load from file if not in production
  if (!isProduction) {
    await ensureDbExists();
    const fileUsers = await loadUsersFromFile();
    // Cache in memory
    fileUsers.forEach((u) => memoryStore.set(u.uid, u));
    return fileUsers;
  }

  return Array.from(memoryStore.values());
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

  // Store in memory (primary)
  memoryStore.set(newUser.uid, newUser);

  // Try to persist to file (development only)
  if (!isProduction) {
    try {
      users.push(newUser);
      await ensureDbExists();
      await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
      console.warn('[Users] Failed to persist user to file, using memory store only:', error);
    }
  }

  return newUser;
}

export async function updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.uid === uid);

  if (index === -1) {
    return null;
  }

  const updatedUser = { ...users[index], ...updates };

  // Update in memory (primary)
  memoryStore.set(uid, updatedUser);

  // Try to persist to file (development only)
  if (!isProduction) {
    try {
      users[index] = updatedUser;
      await ensureDbExists();
      await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
      console.warn('[Users] Failed to persist update to file, using memory store only:', error);
    }
  }

  return updatedUser;
}
