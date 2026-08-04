import { AMENITY_META } from '@/lib/amenities';
import type { Locale } from '@/lib/i18n/dictionaries';

export function Amenities({
  amenities,
  locale,
  title,
}: {
  amenities: string[];
  locale: Locale;
  title: string;
}) {
  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {amenities.map((amenity) => {
          const meta = AMENITY_META[amenity];
          if (!meta) return null;
          const Icon = meta.icon;
          return (
            <div key={amenity} className="flex items-center gap-2.5 text-sm text-foreground/80">
              <Icon className="h-4 w-4 text-foreground/60" aria-hidden="true" />
              {meta.label[locale]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
