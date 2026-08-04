'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LOCALE_LABELS, type Locale } from '@/lib/i18n/dictionaries';
import { useLocaleStore } from '@/lib/i18n/store';
import { useTranslations } from '@/lib/i18n/use-translations';

const LANGUAGES: Locale[] = ['en', 'pt', 'es'];

export function LanguageDropdown() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const t = useTranslations();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-primary-foreground/90 outline-none hover:bg-white/10 active:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label={t.header.selectLanguage}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          {LOCALE_LABELS[locale]}
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-40 rounded-md border border-border bg-background p-1 text-foreground shadow-md"
        >
          {LANGUAGES.map((code) => (
            <DropdownMenu.Item
              key={code}
              onSelect={() => setLocale(code)}
              className="flex cursor-pointer items-center justify-between rounded px-2.5 py-2 text-sm outline-none hover:bg-primary/10 focus:bg-primary/10 active:bg-primary/20"
            >
              {LOCALE_LABELS[code]}
              {locale === code && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
