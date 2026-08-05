'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarRange, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DayPicker, type DateRange } from 'react-day-picker';
import { enGB, es, ptBR } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { nightsBetween } from '@/lib/availability';
import type { Locale } from '@/lib/i18n/dictionaries';
import { useLocale, useLocaleTag, useTranslations } from '@/lib/i18n/use-translations';
import type { StayWithCity } from '@/lib/mappers';
import { useStayAvailabilityQuery } from '@/lib/queries/use-stays';

const DAY_PICKER_LOCALES: Record<Locale, typeof enGB> = { en: enGB, pt: ptBR, es };

const calendarStyle = {
  '--rdp-accent-color': '#2f4a3c',
  '--rdp-accent-background-color': '#e9ede7',
} as CSSProperties;

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Expands a [checkIn, checkOut) range into one Date per occupied night (checkout day itself is free). */
function expandRangeToDates(checkIn: string, checkOut: string): Date[] {
  const dates: Date[] = [];
  const current = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  while (current < end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function BookingCard({ stay }: { stay: StayWithCity }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const localeTag = useLocaleTag();
  const router = useRouter();

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(localeTag, { day: 'numeric', month: 'short' }),
    [localeTag]
  );

  const { data: availabilityData } = useStayAvailabilityQuery(stay.id);

  const blockedDates = useMemo(() => {
    const seedBlocked = stay.blockedDates.map((d) => new Date(`${d}T00:00:00`));
    const bookedBlocked = (availabilityData?.bookedRanges ?? []).flatMap((r) =>
      expandRangeToDates(r.checkIn, r.checkOut)
    );
    return [...seedBlocked, ...bookedBlocked];
  }, [stay.blockedDates, availabilityData]);

  const checkIn = range?.from ? toISODate(range.from) : undefined;
  const checkOut = range?.to ? toISODate(range.to) : undefined;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const total = nights * stay.pricePerNight;
  const canReserve = Boolean(checkIn && checkOut && nights > 0);

  const rangeLabel = !range?.from
    ? t.stayDetail.booking.selectDates
    : !range.to
      ? formatter.format(range.from)
      : `${formatter.format(range.from)} — ${formatter.format(range.to)}`;

  function handleReserve() {
    if (!canReserve || !checkIn || !checkOut) return;
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    router.push(`/checkout/${stay.id}?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-baseline gap-1">
        <span className="font-serif text-2xl font-semibold text-foreground">
          €{stay.pricePerNight}
        </span>
        <span className="text-sm text-foreground/60">{t.stayDetail.booking.perNight}</span>
      </div>

      <div className="mt-4 space-y-2">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-left active:opacity-70"
            >
              <CalendarRange className="h-4 w-4 text-foreground/50" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground/60">
                  {t.stayDetail.booking.checkInLabel} — {t.stayDetail.booking.checkOutLabel}
                </span>
                <span className="text-sm font-medium text-foreground">{rangeLabel}</span>
              </div>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={8}
              collisionPadding={16}
              className="z-50 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-lg border border-border bg-white p-3 shadow-lg"
            >
              <DayPicker
                mode="range"
                numberOfMonths={1}
                selected={range}
                onSelect={setRange}
                disabled={[{ before: new Date() }, ...blockedDates]}
                excludeDisabled
                locale={DAY_PICKER_LOCALES[locale]}
                style={calendarStyle}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
          <span className="text-sm font-medium text-foreground">
            {t.stayDetail.booking.guestsLabel}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              aria-label={t.home.search.decreaseGuests}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-transform hover:bg-border/40 active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="w-4 text-center text-sm font-medium" aria-live="polite">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(stay.maxGuests, g + 1))}
              disabled={guests >= stay.maxGuests}
              aria-label={t.home.search.increaseGuests}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-transform hover:bg-border/40 active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="text-xs text-foreground/50">{t.stayDetail.guestsSuffix(stay.maxGuests)}</p>
      </div>

      {nights > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-foreground/70">{t.stayDetail.booking.nightsLabel(nights)}</span>
          <span className="font-medium text-foreground">
            €{total} {t.stayDetail.booking.totalLabel}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleReserve}
        disabled={!canReserve}
        className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t.stayDetail.booking.reserveButton}
      </button>
    </div>
  );
}
