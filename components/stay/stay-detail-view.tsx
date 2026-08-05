'use client';

import { BackButton } from '@/components/layout/back-button';
import { PageSpinner } from '@/components/ui/page-spinner';
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
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton />
        <PageSpinner />
      </div>
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
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <BackButton />
          <p className="text-foreground/70">
            {isError ? t.stayDetail.loadError : t.stayDetail.notFound}
          </p>
        </div>
      </div>
    );
  }

  const { stay } = data;

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton />
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
    </div>
  );
}
