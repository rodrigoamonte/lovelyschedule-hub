import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS, MAX_LOGIN_ATTEMPTS, LOCKOUT_MINUTES, type User } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  users: User[];
  updateUsers: (users: User[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agendlog_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return MOCK_USERS.find(u => u.id === parsed.id) ?? null;
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = allUsers.find(u => u.email === email);
    if (!found) return { success: false, error: 'E-mail ou senha inválidos.' };

    // Check lockout
    if (found.blockedUntil) {
      const blockedUntil = new Date(found.blockedUntil);
      if (blockedUntil > new Date()) {
        const mins = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000);
        return { success: false, error: `Conta bloqueada. Tente novamente em ${mins} minuto(s).` };
      }
      // Lockout expired, reset
      found.loginAttempts = 0;
      found.blockedUntil = null;
    }

    if (found.password !== password) {
      found.loginAttempts += 1;
      if (found.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        found.blockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60000).toISOString();
        setAllUsers([...allUsers]);
        return { success: false, error: `Muitas tentativas inválidas. Conta bloqueada por ${LOCKOUT_MINUTES} minutos.` };
      }
      setAllUsers([...allUsers]);
      return { success: false, error: `E-mail ou senha inválidos. ${MAX_LOGIN_ATTEMPTS - found.loginAttempts} tentativa(s) restante(s).` };
    }

    // Success
    found.loginAttempts = 0;
    found.blockedUntil = null;
    setUser(found);
    setAllUsers([...allUsers]);
    localStorage.setItem('agendlog_user', JSON.stringify({ id: found.id }));
    return { success: true };
  }, [allUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('agendlog_user');
  }, []);

  const updateUsers = useCallback((users: User[]) => {
    setAllUsers(users);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, users: allUsers, updateUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}
