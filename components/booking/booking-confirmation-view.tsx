'use client';

import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { nightsBetween } from '@/lib/availability';
import { useLocaleTag, useTranslations } from '@/lib/i18n/use-translations';
import { useBookingQuery } from '@/lib/queries/use-bookings';

function LoadingState() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-border/40" />
        <div className="mx-auto mt-6 h-6 w-1/2 animate-pulse rounded bg-border/40" />
        <div className="mt-8 h-56 animate-pulse rounded-xl bg-border/40" />
      </div>
    </div>
  );
}

export function BookingConfirmationView({ bookingId }: { bookingId: string }) {
  const t = useTranslations();
  const localeTag = useLocaleTag();
  const { data, isLoading, isError } = useBookingQuery(bookingId);

  if (isLoading) return <LoadingState />;

  if (isError || !data) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-foreground/70">
            {isError ? t.confirmation.loadError : t.confirmation.notFound}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t.confirmation.backHomeButton}
          </Link>
        </div>
      </div>
    );
  }

  const { booking } = data;
  const formatter = new Intl.DateTimeFormat(localeTag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const nights = nightsBetween(booking.checkIn, booking.checkOut);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-9 w-9 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground">
          {t.confirmation.title}
        </h1>
        <p className="mt-2 text-foreground/60">{t.confirmation.subtitle}</p>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-white text-left">
          {booking.stayImage && (
            <div className="relative aspect-[16/9]">
              <Image
                src={booking.stayImage}
                alt={booking.stayName}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 42rem, 100vw"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {booking.stayName}
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {booking.stayAddress}, {booking.cityName}, {booking.country}
            </p>

            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">{t.stayDetail.booking.checkInLabel}</span>
                <span className="font-medium text-foreground">
                  {formatter.format(new Date(`${booking.checkIn}T00:00:00`))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">{t.stayDetail.booking.checkOutLabel}</span>
                <span className="font-medium text-foreground">
                  {formatter.format(new Date(`${booking.checkOut}T00:00:00`))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">{t.stayDetail.booking.guestsLabel}</span>
                <span className="font-medium text-foreground">{booking.guestsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">{t.confirmation.guestLabel}</span>
                <span className="font-medium text-foreground">{booking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">{t.confirmation.emailLabel}</span>
                <span className="font-medium text-foreground">{booking.guestEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">{t.confirmation.referenceLabel}</span>
                <span className="font-medium tracking-wide text-foreground">
                  {booking.id.split('-')[0].toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-foreground/70">{t.stayDetail.booking.nightsLabel(nights)}</span>
              <span className="font-semibold text-foreground">
                €{booking.totalPrice} {t.stayDetail.booking.totalLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/bookings"
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
          >
            {t.confirmation.viewBookingsButton}
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background active:opacity-70"
          >
            {t.confirmation.backHomeButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
