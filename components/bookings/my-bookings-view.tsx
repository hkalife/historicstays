'use client';

import Link from 'next/link';
import { BackButton } from '@/components/layout/back-button';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useBookingsQuery } from '@/lib/queries/use-bookings';
import { useSessionStore } from '@/lib/stores/session-store';
import { BookingListCard } from './booking-list-card';

function LoadingList() {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-border/40" />
      ))}
    </div>
  );
}

export function MyBookingsView() {
  const t = useTranslations();
  const user = useSessionStore((state) => state.user);
  const { data, isLoading, isError } = useBookingsQuery(user?.id ?? '');

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton />
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {t.myBookings.title}
        </h1>

        {!user && (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-foreground/70">{t.myBookings.loginPrompt}</p>
            <Link
              href="/login"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              {t.myBookings.loginButton}
            </Link>
          </div>
        )}

        {user && isLoading && <LoadingList />}

        {user && !isLoading && isError && (
          <p className="mt-8 text-center text-sm text-accent">{t.myBookings.loadError}</p>
        )}

        {user && !isLoading && !isError && data && data.bookings.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-foreground/70">{t.myBookings.empty}</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              {t.myBookings.emptyCta}
            </Link>
          </div>
        )}

        {user && !isLoading && !isError && data && data.bookings.length > 0 && (
          <div className="mt-6 space-y-4">
            {data.bookings.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
