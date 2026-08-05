import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { StayWithCity } from '@/lib/mappers';

export function StayCard({ stay, perNightLabel }: { stay: StayWithCity; perNightLabel: string }) {
  return (
    <Link
      href={`/stays/${stay.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={stay.images[0]}
          alt={stay.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
          {stay.historicNote}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground">{stay.name}</h3>
        <p className="mt-0.5 text-sm text-foreground/60">
          {stay.cityName}, {stay.country}
        </p>
        <div className="mt-2 flex items-center gap-1 text-sm text-foreground/80">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
          {stay.rating.toFixed(1)}
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-serif text-lg font-semibold text-foreground">
            €{stay.pricePerNight}
          </span>
          <span className="text-sm text-foreground/60">{perNightLabel}</span>
        </div>
      </div>
    </Link>
  );
}
