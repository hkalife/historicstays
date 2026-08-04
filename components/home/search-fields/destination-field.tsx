'use client';

import { useState } from 'react';
import { Landmark, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/use-translations';
import { SearchFieldShell } from './search-field-shell';

export function DestinationField() {
  const [value, setValue] = useState('');
  const t = useTranslations();

  return (
    <SearchFieldShell
      icon={<Landmark className="h-5 w-5" aria-hidden="true" />}
      label={t.home.search.destinationLabel}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.home.search.destinationPlaceholder}
          className="w-full truncate bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-foreground/40"
          aria-label={t.home.search.destinationLabel}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label={t.home.search.clearDestination}
            className="shrink-0 cursor-pointer text-foreground/40 transition-transform hover:text-foreground active:scale-90"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </SearchFieldShell>
  );
}
