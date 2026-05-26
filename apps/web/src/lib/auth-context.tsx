'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole =
  | 'super_admin'
  | 'federation_admin'
  | 'tournament_organizer'
  | 'referee'
  | 'club_manager'
  | 'athlete'
  | 'public';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

interface AuthContextValue {
  user: LocalUser | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

// ---------------------------------------------------------------------------
// Mock users — substitua por chamada real à API na Phase 2
// ---------------------------------------------------------------------------

const MOCK_USERS: Array<LocalUser & { password: string }> = [
  {
    id: 'usr_001',
    name: 'Admin Geral',
    email: 'admin@atlasbirdie.com',
    password: 'admin123',
    role: 'super_admin',
    avatarInitials: 'AG',
  },
  {
    id: 'usr_002',
    name: 'Federação SP',
    email: 'fed@atlasbirdie.com',
    password: 'fed123',
    role: 'federation_admin',
    avatarInitials: 'FS',
  },
  {
    id: 'usr_003',
    name: 'Organizador Torneio',
    email: 'org@atlasbirdie.com',
    password: 'org123',
    role: 'tournament_organizer',
    avatarInitials: 'OT',
  },
  {
    id: 'usr_004',
    name: 'Atleta Teste',
    email: 'atleta@atlasbirdie.com',
    password: 'atleta123',
    role: 'athlete',
    avatarInitials: 'AT',
  },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Simula latência de rede
      await new Promise((resolve) => setTimeout(resolve, 300));

      const found = MOCK_USERS.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password,
      );

      if (!found) {
        return { success: false, error: 'E-mail ou senha incorretos.' };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pwd, ...safeUser } = found;
      setUser(safeUser);
      return { success: true };
    },
    [],
  );

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn: user !== null, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
