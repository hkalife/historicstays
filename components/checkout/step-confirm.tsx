'use client';

import Link from 'next/link';
import { nightsBetween } from '@/lib/availability';
import { useLocaleTag, useTranslations } from '@/lib/i18n/use-translations';
import type { StayWithCity } from '@/lib/mappers';

export function StepConfirm({
  stay,
  stayId,
  checkIn,
  checkOut,
  guests,
  onContinue,
}: {
  stay: StayWithCity;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  onContinue: () => void;
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
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        {t.checkout.confirmStep.title}
      </h2>

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

      <Link
        href={`/stays/${stayId}`}
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        {t.checkout.change}
      </Link>
      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
      >
        {t.checkout.confirmStep.continueButton}
      </button>
    </div>
  );
}
