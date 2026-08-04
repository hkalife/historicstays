'use client';

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Minus, Plus, Users } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useSearchStore } from '@/lib/stores/search-store';
import { SearchFieldShell } from './search-field-shell';

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;

export function GuestsField() {
  const guests = useSearchStore((state) => state.guests);
  const setGuests = useSearchStore((state) => state.setGuests);
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="min-w-0 flex-1 cursor-pointer text-left active:opacity-70">
          <SearchFieldShell
            icon={<Users className="h-5 w-5" aria-hidden="true" />}
            label={t.home.search.guestsLabel}
          >
            <span className="truncate text-sm font-medium text-foreground">
              {t.home.search.guestsCount(guests)}
            </span>
          </SearchFieldShell>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-64 rounded-lg border border-border bg-white p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{t.home.search.guestsLabel}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests(Math.max(MIN_GUESTS, guests - 1))}
                disabled={guests <= MIN_GUESTS}
                aria-label={t.home.search.decreaseGuests}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-transform hover:bg-border/40 active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-4 text-center text-sm font-medium" aria-live="polite">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(MAX_GUESTS, guests + 1))}
                disabled={guests >= MAX_GUESTS}
                aria-label={t.home.search.increaseGuests}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-transform hover:bg-border/40 active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
