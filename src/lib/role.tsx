"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'consumidor' | 'empreendedor' | 'cooperativa';

type RoleContextValue = {
  role: UserRole;
  setRole: (r: UserRole) => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = 'mumbuca-role';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('consumidor');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as UserRole | null;
    if (saved === 'consumidor' || saved === 'empreendedor' || saved === 'cooperativa') {
      setRoleState(saved);
    }
  }, []);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, r);
    }
  };

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useUserRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useUserRole must be used within RoleProvider');
  return ctx;
}

export function useRoleGuard(allowed: UserRole[]) {
  const { role } = useUserRole();
  const router = useRouter();
  useEffect(() => {
    if (!allowed.includes(role)) {
      router.replace('/vendas');
    }
  }, [allowed, role, router]);
  return allowed.includes(role);
} 