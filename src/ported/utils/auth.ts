import type { User, UserRole } from '../types/auth';

const STORAGE_KEY = 'mdf_auth_session';
const USERS_DB_KEY = 'mdf_users_db';
const APPS_DB_KEY = 'mdf_applications_db';
const DONATIONS_DB_KEY = 'mdf_donations_db';

// Simulated secure token generator
export const generateToken = (userId: string): string => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `MDF-${userId.slice(0, 8)}-${ts}-${rand}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const generateReferenceCode = (prefix: string): string => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${new Date().getFullYear()}-${randomNum}`;
};

// Password strength evaluation
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
  requirements: Record<string, boolean>;
} => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  if (score <= 2) return { score, label: 'Weak', color: 'red', requirements };
  if (score <= 3) return { score, label: 'Fair', color: 'amber', requirements };
  if (score <= 4) return { score, label: 'Strong', color: 'blue', requirements };
  return { score, label: 'Very Strong', color: 'emerald', requirements };
};

// Simulated password hashing (NOT for production - this is a demo)
export const hashPassword = (password: string): string => {
  // Simple reversible hash for demo purposes only
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return `hashed_${hash}_${btoa(password).slice(0, 6)}`;
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Storage helpers with expiration
export const saveSession = (data: { token: string; user: User; rememberMe: boolean }): void => {
  try {
    const expiry = data.rememberMe
      ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      : Date.now() + 8 * 60 * 60 * 1000; // 8 hours
    
    const payload = { ...data, expiresAt: expiry };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save session', e);
  }
};

export const loadSession = (): { token: string; user: User } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (payload.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { token: payload.token, user: payload.user };
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// User database operations (localStorage-backed)
export const getUsersDB = (): Record<string, { user: User; passwordHash: string }> => {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveUsersDB = (db: Record<string, { user: User; passwordHash: string }>): void => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
};

export const authenticateUser = (email: string, password: string): { user: User; token: string } | null => {
  const db = getUsersDB();
  const entry = db[email.toLowerCase()];
  if (!entry) return null;
  if (!verifyPassword(password, entry.passwordHash)) return null;
  
  // Update last login
  const updatedUser = { ...entry.user, lastLoginAt: new Date().toISOString() };
  db[email.toLowerCase()] = { ...entry, user: updatedUser };
  saveUsersDB(db);

  const token = generateToken(updatedUser.id);
  return { user: updatedUser, token };
};

export const registerUser = (data: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  country?: string;
}): { user: User; token: string } | { error: string } => {
  const db = getUsersDB();
  const normalizedEmail = data.email.toLowerCase();
  
  if (db[normalizedEmail]) {
    return { error: 'An account with this email already exists.' };
  }

  const user: User = {
    id: generateId(),
    email: normalizedEmail,
    fullName: data.fullName,
    role: data.role,
    phone: data.phone,
    country: data.country,
    createdAt: new Date().toISOString(),
    isEmailVerified: false
  };

  db[normalizedEmail] = { user, passwordHash: hashPassword(data.password) };
  saveUsersDB(db);

  const token = generateToken(user.id);
  return { user, token };
};

// Application records management
export const saveApplication = (record: {
  userId: string;
  type: string;
  title: string;
  summary: string;
  referenceCode: string;
}): void => {
  const raw = localStorage.getItem(APPS_DB_KEY);
  const db = raw ? JSON.parse(raw) : [];
  db.push({
    id: generateId(),
    ...record,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  localStorage.setItem(APPS_DB_KEY, JSON.stringify(db));
};

export const getApplications = (userId: string) => {
  const raw = localStorage.getItem(APPS_DB_KEY);
  const db: any[] = raw ? JSON.parse(raw) : [];
  return db.filter(a => a.userId === userId);
};

export const getAllApplications = () => {
  const raw = localStorage.getItem(APPS_DB_KEY);
  return raw ? JSON.parse(raw) : [];
};

// Donation records
export const saveDonation = (record: {
  userId: string;
  amount: number;
  frequency: string;
  pillar: string;
  referenceCode: string;
}): void => {
  const raw = localStorage.getItem(DONATIONS_DB_KEY);
  const db = raw ? JSON.parse(raw) : [];
  db.push({
    id: generateId(),
    ...record,
    status: 'completed',
    date: new Date().toISOString()
  });
  localStorage.setItem(DONATIONS_DB_KEY, JSON.stringify(db));
};

export const getDonations = (userId: string) => {
  const raw = localStorage.getItem(DONATIONS_DB_KEY);
  const db: any[] = raw ? JSON.parse(raw) : [];
  return db.filter(d => d.userId === userId);
};

export const getAllDonations = () => {
  const raw = localStorage.getItem(DONATIONS_DB_KEY);
  return raw ? JSON.parse(raw) : [];
};

// Authorization helpers
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    guest: 'Guest',
    member: 'Member',
    donor: 'Supporter',
    volunteer: 'Volunteer',
    beneficiary: 'Beneficiary',
    admin: 'Administrator'
  };
  return labels[role];
};

export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    guest: 'bg-slate-100 text-slate-700',
    member: 'bg-blue-100 text-blue-700',
    donor: 'bg-amber-100 text-amber-700',
    volunteer: 'bg-emerald-100 text-emerald-700',
    beneficiary: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700'
  };
  return colors[role];
};
