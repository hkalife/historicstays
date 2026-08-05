'use client';

import { useState, type FormEvent } from 'react';
import { BackButton } from '@/components/layout/back-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiRequestError } from '@/lib/api/client';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useLoginMutation } from '@/lib/queries/use-auth';
import { useSessionStore } from '@/lib/stores/session-store';

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const setUser = useSessionStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <BackButton />
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {t.auth.login.title}
        </h1>
        <p className="mt-2 text-sm text-foreground/60">{t.auth.login.subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="text-xs font-medium text-foreground/60">
              {t.auth.login.emailLabel}
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.login.emailPlaceholder}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-xs font-medium text-foreground/60">
              {t.auth.login.passwordLabel}
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.login.passwordPlaceholder}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
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
  );
}
