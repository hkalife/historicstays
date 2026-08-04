'use client';

import Image from 'next/image';
import type { Locale } from '@/lib/i18n/dictionaries';
import { useLocale, useTranslations } from '@/lib/i18n/use-translations';

type Destination = {
  id: string;
  image: string;
  flag: string;
  name: Record<Locale, string>;
};

const DESTINATIONS: Destination[] = [
  {
    id: 'prague',
    image: '/stays/prague-mala-strana/exterior.png',
    flag: '🇨🇿',
    name: { en: 'Prague', pt: 'Praga', es: 'Praga' },
  },
  {
    id: 'amsterdam',
    image: '/stays/amsterdam/exterior.png',
    flag: '🇳🇱',
    name: { en: 'Amsterdam', pt: 'Amsterdã', es: 'Ámsterdam' },
  },
  {
    id: 'tallinn',
    image: '/stays/tallinn/exterior.png',
    flag: '🇪🇪',
    name: { en: 'Tallinn', pt: 'Tallinn', es: 'Tallin' },
  },
];

export function PopularDestinations() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {t.home.popularDestinations.title}
        </h2>
        <p className="mt-1 text-sm text-foreground/60 sm:text-base">
          {t.home.popularDestinations.subtitle}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <div
              key={destination.id}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl"
            >
              <Image
                src={destination.image}
                alt={destination.name[locale]}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-lg font-semibold text-white">{destination.name[locale]}</span>
                <span className="text-lg" aria-hidden="true">
                  {destination.flag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
