'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/use-translations';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StepGuestDetails({
  fullName,
  email,
  onFullNameChange,
  onEmailChange,
  onBack,
  onContinue,
}: {
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const t = useTranslations();
  const canContinue = fullName.trim().length > 0 && EMAIL_RE.test(email);

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <p className="rounded-lg bg-background px-4 py-3 text-sm text-foreground/70">
        {t.checkout.guestDetailsStep.loginPrompt}{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t.checkout.guestDetailsStep.loginLink}
        </Link>
      </p>

      <h2 className="mt-4 font-serif text-lg font-semibold text-foreground">
        {t.checkout.guestDetailsStep.title}
      </h2>

      <div className="mt-4">
        <label htmlFor="guest-name" className="text-xs font-medium text-foreground/60">
          {t.checkout.guestDetailsStep.fullNameLabel}
        </label>
        <input
          id="guest-name"
          type="text"
          required
          maxLength={120}
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder={t.checkout.guestDetailsStep.fullNamePlaceholder}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="guest-email" className="text-xs font-medium text-foreground/60">
          {t.checkout.guestDetailsStep.emailLabel}
        </label>
        <input
          id="guest-email"
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t.checkout.guestDetailsStep.emailPlaceholder}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <p className="mt-1 text-xs text-foreground/50">{t.checkout.guestDetailsStep.emailHint}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 cursor-pointer rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background active:opacity-70"
        >
          {t.checkout.guestDetailsStep.backButton}
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="flex-1 cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.checkout.guestDetailsStep.continueButton}
        </button>
      </div>
    </div>
  );
}
