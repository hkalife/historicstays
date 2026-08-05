import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/mappers';

type SessionState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'historicstays-session',
      skipHydration: true,
    }
  )
);
