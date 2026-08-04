'use client';

import { useLocale, useTranslations } from '@/lib/i18n/use-translations';
import { useStayQuery } from '@/lib/queries/use-stays';
import { Amenities } from './amenities';
import { BookingCard } from './booking-card';
import { Description } from './description';
import { Gallery } from './gallery';
import { ReviewsSection } from './reviews-section';
import { StayInfo } from './stay-info';

function LoadingState() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="aspect-[16/10] animate-pulse rounded-xl bg-border/40" />
      <div className="mt-6 h-8 w-1/2 animate-pulse rounded bg-border/40" />
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-border/40" />
    </div>
  );
}

export function StayDetailView({ stayId }: { stayId: string }) {
  const { data, isLoading, isError } = useStayQuery(stayId);
  const t = useTranslations();
  const locale = useLocale();

  if (isLoading) return <LoadingState />;

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <p className="text-foreground/70">
          {isError ? t.stayDetail.loadError : t.stayDetail.notFound}
        </p>
      </div>
    );
  }

  const { stay } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Gallery images={stay.images} stayName={stay.name} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <StayInfo stay={stay} />
          <Description
            title={t.stayDetail.aboutTitle}
            description={stay.description}
            historicNote={stay.historicNote}
            historicNoteLabel={t.stayDetail.historicNoteLabel}
          />
          <Amenities
            amenities={stay.amenities}
            locale={locale}
            title={t.stayDetail.amenitiesTitle}
          />
          <ReviewsSection stayId={stay.id} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <BookingCard stay={stay} />
          </div>
        </div>
      </div>
    </div>
  );
}
