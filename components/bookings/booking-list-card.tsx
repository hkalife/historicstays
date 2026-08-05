import Image from 'next/image';
import Link from 'next/link';
import type { BookingWithStay } from '@/lib/api/bookings';
import { useLocaleTag, useTranslations } from '@/lib/i18n/use-translations';

export function BookingListCard({ booking }: { booking: BookingWithStay }) {
  const t = useTranslations();
  const localeTag = useLocaleTag();
  const formatter = new Intl.DateTimeFormat(localeTag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="flex gap-4 rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-32">
        {booking.stayImage && (
          <Image
            src={booking.stayImage}
            alt={booking.stayName}
            fill
            className="object-cover"
            sizes="128px"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-serif text-base font-semibold text-foreground">{booking.stayName}</h3>
          <p className="text-sm text-foreground/60">{booking.cityName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/70">
          <span>
            {formatter.format(new Date(`${booking.checkIn}T00:00:00`))} —{' '}
            {formatter.format(new Date(`${booking.checkOut}T00:00:00`))}
          </span>
          <span>
            {t.stayDetail.booking.guestsLabel}: {booking.guestsCount}
          </span>
          <span className="font-medium text-foreground">€{booking.totalPrice}</span>
        </div>
      </div>
    </Link>
  );
}
