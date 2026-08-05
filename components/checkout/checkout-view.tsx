'use client';

import { useEffect, useState } from 'react';
import { BackButton } from '@/components/layout/back-button';
import { PageSpinner } from '@/components/ui/page-spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useCreateBookingMutation } from '@/lib/queries/use-bookings';
import { useStayQuery } from '@/lib/queries/use-stays';
import { useSessionStore } from '@/lib/stores/session-store';
import { StaySummaryCard } from './stay-summary-card';
import { StepConfirm } from './step-confirm';
import { StepGuestDetails } from './step-guest-details';
import { StepPayment } from './step-payment';
import { Stepper } from './stepper';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function CheckoutView({
  stayId,
  checkIn,
  checkOut,
  guests,
}: {
  stayId: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { data, isLoading, isError } = useStayQuery(stayId);
  const createBooking = useCreateBookingMutation();
  const user = useSessionStore((state) => state.user);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Syncs the form with the session store once it rehydrates from localStorage after mount.
  useEffect(() => {
    if (user && !fullName && !email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(user.name);
      setEmail(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const hasValidSelection = Boolean(
    checkIn && checkOut && DATE_RE.test(checkIn) && DATE_RE.test(checkOut) && guests && guests > 0
  );

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BackButton />
          <PageSpinner />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <BackButton />
          <p className="text-foreground/70">{t.stayDetail.loadError}</p>
        </div>
      </div>
    );
  }

  if (!hasValidSelection || !checkIn || !checkOut || !guests) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <BackButton />
          <p className="text-foreground/70">{t.checkout.missingSelection}</p>
          <Link
            href={`/stays/${stayId}`}
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t.checkout.backToStay}
          </Link>
        </div>
      </div>
    );
  }

  const { stay } = data;

  function handleConfirmBooking() {
    if (!checkIn || !checkOut || !guests) return;
    createBooking.mutate(
      {
        stayId,
        checkIn,
        checkOut,
        guestsCount: guests,
        guestName: fullName,
        guestEmail: email,
        userId: user?.id,
      },
      {
        onSuccess: (result) => {
          router.push(`/bookings/${result.booking.id}`);
        },
      }
    );
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton />
        <Stepper
          current={step}
          labels={[
            t.checkout.steps.confirm,
            t.checkout.steps.guestDetails,
            t.checkout.steps.payment,
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <StaySummaryCard
              stay={stay}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              showTripDetails={step !== 1}
            />
          </div>

          <div className="lg:col-span-2">
            {step === 1 && (
              <StepConfirm
                stay={stay}
                stayId={stayId}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                onContinue={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepGuestDetails
                fullName={fullName}
                email={email}
                onFullNameChange={setFullName}
                onEmailChange={setEmail}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <StepPayment
                onBack={() => setStep(2)}
                onConfirm={handleConfirmBooking}
                isSubmitting={createBooking.isPending}
                errorMessage={createBooking.isError ? t.checkout.paymentStep.error : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
