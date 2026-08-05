'use client';

import { useEffect } from 'react';
import { useSessionStore } from './session-store';

/** Rehydrates the persisted session from localStorage after mount, avoiding SSR hydration mismatches. */
export function SessionHydrator() {
  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  return null;
}
