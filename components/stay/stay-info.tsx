import { MapPin, Star } from 'lucide-react';
import type { StayWithCity } from '@/lib/mappers';

export function StayInfo({ stay }: { stay: StayWithCity }) {
  return (
    <div>
      <span className="inline-block rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
        {stay.historicNote}
      </span>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
        {stay.name}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/70">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {stay.address}, {stay.cityName}, {stay.country}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          {stay.rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
