'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useSessionStore } from '@/lib/stores/session-store';

export function AuthButtons() {
  const t = useTranslations();
  const user = useSessionStore((state) => state.user);
  const clearUser = useSessionStore((state) => state.clearUser);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-medium text-primary-foreground/90 sm:inline">
          {t.header.greeting(user.name)}
        </span>
        <Link
          href="/bookings"
          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-primary-foreground/90 outline-none hover:bg-white/10 active:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
        >
          {t.header.myBookingsLink}
        </Link>
        <button
          type="button"
          onClick={() => clearUser()}
          className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium text-primary-foreground/90 outline-none hover:bg-white/10 active:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
        >
          {t.header.logoutButton}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/register"
        className="rounded-md border border-white/50 px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10 active:bg-white/20"
      >
        {t.header.registerButton}
      </Link>
      <Link
        href="/login"
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-white/90 active:bg-white/80"
      >
        {t.header.loginButton}
      </Link>
    </div>
  );
}
