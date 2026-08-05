'use client';

import { dictionaries, LOCALE_TAGS } from './dictionaries';
import { useLocaleStore } from './store';

export function useLocale() {
  return useLocaleStore((state) => state.locale);
}

export function useTranslations() {
  const locale = useLocaleStore((state) => state.locale);
  return dictionaries[locale];
}

export function useLocaleTag() {
  const locale = useLocaleStore((state) => state.locale);
  return LOCALE_TAGS[locale];
}
