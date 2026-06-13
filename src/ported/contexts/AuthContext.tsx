import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, UserRole } from '../types/auth';
import {
  saveSession,
  loadSession,
  clearSession,
  authenticateUser,
  registerUser,
  getUsersDB,
  saveUsersDB
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => { success: boolean; error?: string };
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    country?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasAdminAccess: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize: restore session on mount
  useEffect(() => {
    try {
      const session = loadSession();
      if (session) {
        setUser(session.user);
      }
    } catch (e) {
      console.error('Auth init failed', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((email: string, password: string, rememberMe = false) => {
    const result = authenticateUser(email, password);
    if (!result) {
      return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
    }
    saveSession({ token: result.token, user: result.user, rememberMe });
    setUser(result.user);
    return { success: true };
  }, []);

  const register = useCallback((data: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    country?: string;
  }) => {
    const result = registerUser(data);
    if ('error' in result) {
      return { success: false, error: result.error };
    }
    saveSession({ token: result.token, user: result.user, rememberMe: false });
    setUser(result.user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // Also persist to users DB
      try {
        const db = getUsersDB();
        const entry = db[prev.email.toLowerCase()];
        if (entry) {
          db[prev.email.toLowerCase()] = { ...entry, user: updated };
          saveUsersDB(db);
        }
        // Update current session too
        const token = `MDF-${prev.id.slice(0, 8)}-${Date.now().toString(36)}`;
        saveSession({ token, user: updated, rememberMe: true });
      } catch {}
      
      return updated;
    });
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return user !== null && roles.includes(user.role);
  }, [user]);

  const hasAdminAccess = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasAdminAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
