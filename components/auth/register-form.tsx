'use client';

import { useState, type FormEvent } from 'react';
import { BackButton } from '@/components/layout/back-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiRequestError } from '@/lib/api/client';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useRegisterMutation } from '@/lib/queries/use-auth';
import { useSessionStore } from '@/lib/stores/session-store';

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const setUser = useSessionStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mismatchError, setMismatchError] = useState(false);

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

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <BackButton />
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {t.auth.register.title}
        </h1>
        <p className="mt-2 text-sm text-foreground/60">{t.auth.register.subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="register-name" className="text-xs font-medium text-foreground/60">
              {t.auth.register.nameLabel}
            </label>
            <input
              id="register-name"
              type="text"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.auth.register.namePlaceholder}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="text-xs font-medium text-foreground/60">
              {t.auth.register.emailLabel}
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.register.emailPlaceholder}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="text-xs font-medium text-foreground/60">
              {t.auth.register.passwordLabel}
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.register.passwordPlaceholder}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className="text-xs font-medium text-foreground/60"
            >
              {t.auth.register.confirmPasswordLabel}
            </label>
            <input
              id="register-confirm-password"
              type="password"
              required
              minLength={4}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.auth.register.confirmPasswordPlaceholder}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
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
  );
}
