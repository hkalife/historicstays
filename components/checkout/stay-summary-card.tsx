'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { nightsBetween } from '@/lib/availability';
import { useLocaleTag, useTranslations } from '@/lib/i18n/use-translations';
import type { StayWithCity } from '@/lib/mappers';

export function StaySummaryCard({
  stay,
  checkIn,
  checkOut,
  guests,
  showTripDetails = true,
}: {
  stay: StayWithCity;
  checkIn: string;
  checkOut: string;
  guests: number;
  showTripDetails?: boolean;
}) {
  const t = useTranslations();
  const localeTag = useLocaleTag();
  const formatter = new Intl.DateTimeFormat(localeTag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const nights = nightsBetween(checkIn, checkOut);
  const total = nights * stay.pricePerNight;

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image src={stay.images[0]} alt={stay.name} fill className="object-cover" sizes="360px" />
      </div>
      <span className="mt-3 inline-block rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
        {stay.historicNote}
      </span>
      <h2 className="mt-2 font-serif text-lg font-semibold text-foreground">{stay.name}</h2>
      <p className="mt-1 text-sm text-foreground/60">
        {stay.address}, {stay.cityName}, {stay.country}
      </p>
      <div className="mt-1 flex items-center gap-1 text-sm text-foreground/70">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
        {stay.rating.toFixed(1)}
      </div>

      {showTripDetails && (
        <>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">{t.stayDetail.booking.checkInLabel}</span>
              <span className="font-medium text-foreground">
                {formatter.format(new Date(`${checkIn}T00:00:00`))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">{t.stayDetail.booking.checkOutLabel}</span>
              <span className="font-medium text-foreground">
                {formatter.format(new Date(`${checkOut}T00:00:00`))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">{t.stayDetail.booking.guestsLabel}</span>
              <span className="font-medium text-foreground">{guests}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-foreground/70">{t.stayDetail.booking.nightsLabel(nights)}</span>
            <span className="font-semibold text-foreground">
              €{total} {t.stayDetail.booking.totalLabel}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
