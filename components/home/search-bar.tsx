'use client';

import { useTranslations } from '@/lib/i18n/use-translations';
import { useSearchStore } from '@/lib/stores/search-store';
import { DateRangeField } from './search-fields/date-range-field';
import { DestinationField } from './search-fields/destination-field';
import { GuestsField } from './search-fields/guests-field';

export function SearchBar() {
  const t = useTranslations();
  const submitSearch = useSearchStore((state) => state.submitSearch);

  function handleSearch() {
    submitSearch();
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-accent p-1 sm:flex-row sm:items-stretch">
      <DestinationField />
      <DateRangeField />
      <GuestsField />
      <button
        type="button"
        onClick={handleSearch}
        className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 sm:shrink-0"
      >
        {t.home.search.searchButton}
      </button>
    </div>
  );
}
