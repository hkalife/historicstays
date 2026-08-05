'use client';

import { useTranslations } from '@/lib/i18n/use-translations';
import { SearchBar } from './search-bar';

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="bg-primary pt-12 pb-10 text-primary-foreground sm:pt-16 sm:pb-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-5xl">
          {t.home.hero.title}
        </h1>
        <p className="mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
          {t.home.hero.subtitle}
        </p>
        <div className="mt-8">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
