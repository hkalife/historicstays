import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/mappers';

type SessionState = {
  user: User | null;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'historicstays-session',
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
