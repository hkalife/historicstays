'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/use-translations';

export function StepConfirm({ stayId, onContinue }: { stayId: string; onContinue: () => void }) {
  const t = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        {t.checkout.confirmStep.title}
      </h2>
      <Link
        href={`/stays/${stayId}`}
        className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
      >
        {t.checkout.change}
      </Link>
      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
      >
        {t.checkout.confirmStep.continueButton}
      </button>
    </div>
  );
}
