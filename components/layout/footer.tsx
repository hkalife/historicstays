'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/use-translations';

const GITHUB_URL = 'https://github.com/hkalife/historicstays';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-sm text-foreground/60 sm:flex-row sm:justify-between sm:px-6">
        <span>{t.footer.craftedBy} @hkalife</span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground"
        >
          {t.footer.viewOnGithub}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
