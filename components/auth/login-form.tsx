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
import { useLoginMutation } from '@/lib/queries/use-auth';
import { useSessionStore } from '@/lib/stores/session-store';

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const setUser = useSessionStore((state) => state.setUser);
  const user = useSessionStore((state) => state.user);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Already logged in — this page shouldn't be reachable, bounce to Home.
  useEffect(() => {
    if (hasHydrated && user) {
      router.replace('/');
    }
  }, [hasHydrated, user, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (result) => {
          setUser(result.user);
          router.push('/');
        },
      }
    );
  }

  const apiError = loginMutation.error;
  const isInvalidCredentials = apiError instanceof ApiRequestError && apiError.status === 401;

  let errorMessage: string | undefined;
  if (loginMutation.isError) {
    errorMessage = isInvalidCredentials
      ? t.auth.login.invalidCredentialsError
      : t.auth.login.genericError;
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
            {t.auth.login.title}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">{t.auth.login.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <TextField
              id="login-email"
              type="email"
              required
              label={t.auth.login.emailLabel}
              value={email}
              onChange={setEmail}
              maxLength={FIELD_LIMITS.email}
              placeholder={t.auth.login.emailPlaceholder}
            />

            <TextField
              id="login-password"
              type="password"
              required
              label={t.auth.login.passwordLabel}
              value={password}
              onChange={setPassword}
              maxLength={FIELD_LIMITS.password}
              placeholder={t.auth.login.passwordPlaceholder}
            />

            {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginMutation.isPending && <Spinner />}
              {loginMutation.isPending ? t.auth.login.submitting : t.auth.login.submitButton}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            {t.auth.login.toggleToRegister}{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {t.auth.login.toggleToRegisterLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
