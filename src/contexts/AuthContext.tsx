import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS, type User } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agendlog_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return MOCK_USERS.find(u => u.id === parsed.id) ?? null;
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('agendlog_user', JSON.stringify({ id: found.id }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('agendlog_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}
