'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { BackButton } from '@/components/layout/back-button';
import { PageSpinner } from '@/components/ui/page-spinner';
import { Spinner } from '@/components/ui/spinner';
import { TextField } from '@/components/ui/text-field';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiRequestError } from '@/lib/api/client';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useRegisterMutation } from '@/lib/queries/use-auth';
import { useSessionStore } from '@/lib/stores/session-store';

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const setUser = useSessionStore((state) => state.setUser);
  const user = useSessionStore((state) => state.user);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mismatchError, setMismatchError] = useState(false);

  // Already logged in — this page shouldn't be reachable, bounce to Home.
  useEffect(() => {
    if (hasHydrated && user) {
      router.replace('/');
    }
  }, [hasHydrated, user, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMismatchError(false);

    if (password !== confirmPassword) {
      setMismatchError(true);
      return;
    }

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: (result) => {
          setUser(result.user);
          router.push('/');
        },
      }
    );
  }

  const apiError = registerMutation.error;
  const isEmailTaken = apiError instanceof ApiRequestError && apiError.status === 409;

  let errorMessage: string | undefined;
  if (mismatchError) {
    errorMessage = t.auth.register.passwordMismatch;
  } else if (registerMutation.isError) {
    errorMessage = isEmailTaken ? t.auth.register.emailTakenError : t.auth.register.genericError;
  }

  if (!hasHydrated || user) {
    return (
      <div className="py-16">
        <PageSpinner />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <BackButton />
        <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {t.auth.register.title}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">{t.auth.register.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <TextField
              id="register-name"
              type="text"
              required
              label={t.auth.register.nameLabel}
              value={name}
              onChange={setName}
              maxLength={FIELD_LIMITS.name}
              placeholder={t.auth.register.namePlaceholder}
            />

            <TextField
              id="register-email"
              type="email"
              required
              label={t.auth.register.emailLabel}
              value={email}
              onChange={setEmail}
              maxLength={FIELD_LIMITS.email}
              placeholder={t.auth.register.emailPlaceholder}
            />

            <TextField
              id="register-password"
              type="password"
              required
              minLength={4}
              label={t.auth.register.passwordLabel}
              value={password}
              onChange={setPassword}
              maxLength={FIELD_LIMITS.password}
              placeholder={t.auth.register.passwordPlaceholder}
            />

            <TextField
              id="register-confirm-password"
              type="password"
              required
              minLength={4}
              label={t.auth.register.confirmPasswordLabel}
              value={confirmPassword}
              onChange={setConfirmPassword}
              maxLength={FIELD_LIMITS.password}
              placeholder={t.auth.register.confirmPasswordPlaceholder}
            />

            {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registerMutation.isPending && <Spinner />}
              {registerMutation.isPending
                ? t.auth.register.submitting
                : t.auth.register.submitButton}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            {t.auth.register.toggleToLogin}{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t.auth.register.toggleToLoginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
