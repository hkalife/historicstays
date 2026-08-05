'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TextField } from '@/components/ui/text-field';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useSessionStore } from '@/lib/stores/session-store';

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
  const user = useSessionStore((state) => state.user);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isNameValid = fullName.trim().length > 0;
  const isEmailValid = EMAIL_RE.test(email);
  const canContinue = isNameValid && isEmailValid;

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      {!user && (
        <p className="rounded-lg bg-background px-4 py-3 text-sm text-foreground/70">
          {t.checkout.guestDetailsStep.loginPrompt}{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.checkout.guestDetailsStep.loginLink}
          </Link>
        </p>
      )}

      <h2 className={`font-serif text-lg font-semibold text-foreground ${user ? '' : 'mt-4'}`}>
        {t.checkout.guestDetailsStep.title}
      </h2>

      <div className="mt-4">
        <TextField
          id="guest-name"
          type="text"
          required
          label={t.checkout.guestDetailsStep.fullNameLabel}
          value={fullName}
          onChange={onFullNameChange}
          onBlur={() => setNameTouched(true)}
          maxLength={FIELD_LIMITS.name}
          placeholder={t.checkout.guestDetailsStep.fullNamePlaceholder}
          error={
            nameTouched && !isNameValid ? t.checkout.guestDetailsStep.fullNameError : undefined
          }
        />
      </div>

      <div className="mt-4">
        <TextField
          id="guest-email"
          type="email"
          required
          label={t.checkout.guestDetailsStep.emailLabel}
          value={email}
          onChange={onEmailChange}
          onBlur={() => setEmailTouched(true)}
          maxLength={FIELD_LIMITS.email}
          placeholder={t.checkout.guestDetailsStep.emailPlaceholder}
          hint={t.checkout.guestDetailsStep.emailHint}
          error={
            emailTouched && !isEmailValid ? t.checkout.guestDetailsStep.emailError : undefined
          }
        />
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
