'use client';

import { useTranslations } from '@/lib/i18n/use-translations';
import { useStaysQuery } from '@/lib/queries/use-stays';
import { useSearchStore } from '@/lib/stores/search-store';
import { StayCard } from './stay-card';

function LoadingGrid() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border">
          <div className="aspect-[4/3] animate-pulse bg-border/60" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-border/60" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-border/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateMessage({ tone, message }: { tone: 'empty' | 'error'; message: string }) {
  return (
    <div
      className={
        tone === 'error'
          ? 'mt-6 rounded-xl border border-accent/30 bg-accent/5 p-10 text-center text-accent'
          : 'mt-6 rounded-xl border border-dashed border-border p-10 text-center text-foreground/60'
      }
    >
      {message}
    </div>
  );
}

export function SearchResults() {
  const t = useTranslations();
  const appliedFilters = useSearchStore((state) => state.appliedFilters);
  const { data, isLoading, isError } = useStaysQuery(appliedFilters);

  return (
    <section id="search-results" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {t.home.results.title}
        </h2>

        {isLoading && <LoadingGrid />}
        {!isLoading && isError && <StateMessage tone="error" message={t.home.results.error} />}
        {!isLoading && !isError && data && data.stays.length === 0 && (
          <StateMessage tone="empty" message={t.home.results.empty} />
        )}
        {!isLoading && !isError && data && data.stays.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} perNightLabel={t.home.results.perNight} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
