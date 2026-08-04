'use client';

import { useEffect } from 'react';
import { useLocaleStore } from './store';

/** Rehydrates the persisted locale from localStorage after mount, avoiding SSR hydration mismatches. */
export function LocaleHydrator() {
  useEffect(() => {
    useLocaleStore.persist.rehydrate();
  }, []);

  return null;
}
