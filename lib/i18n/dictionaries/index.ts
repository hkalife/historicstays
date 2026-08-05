import { en } from './en';
import { es } from './es';
import { pt } from './pt';

export type Locale = 'en' | 'pt' | 'es';

export const dictionaries: Record<Locale, typeof en> = { en, pt, es };

export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en-GB',
  pt: 'pt-BR',
  es: 'es-ES',
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
};
