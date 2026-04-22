import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User as SupaUser } from '@supabase/supabase-js';

export type UserRole = 'fornecedor' | 'assistente' | 'deposito' | 'admin';

export interface AuthUser {
  id: string;          // auth user id
  email: string;
  name: string;        // from profile.full_name
  role: UserRole;      // primary role
  roles: UserRole[];   // all roles
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ROLE_PRIORITY: UserRole[] = ['admin', 'assistente', 'deposito', 'fornecedor'];
const pickPrimary = (roles: UserRole[]): UserRole =>
  ROLE_PRIORITY.find(r => roles.includes(r)) ?? 'fornecedor';

async function loadAuthUser(supaUser: SupaUser): Promise<AuthUser | null> {
  const [{ data: profile }, { data: rolesData }] = await Promise.all([
    supabase.from('profiles').select('full_name, email').eq('user_id', supaUser.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', supaUser.id),
  ]);

  const roles = (rolesData ?? []).map(r => r.role as UserRole);
  if (roles.length === 0) roles.push('fornecedor');

  return {
    id: supaUser.id,
    email: supaUser.email ?? profile?.email ?? '',
    name: profile?.full_name ?? supaUser.email ?? 'Usuário',
    role: pickPrimary(roles),
    roles,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer Supabase reads to avoid deadlock inside the callback
        setTimeout(async () => {
          const u = await loadAuthUser(newSession.user);
          setUser(u);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // 2) Then check existing session
    supabase.auth.getSession().then(async ({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        const u = await loadAuthUser(existing.user);
        setUser(u);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signup = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName, phone: phone ?? null },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}
