'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n/use-translations';

export function BackButton() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-4 flex cursor-pointer items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground active:opacity-70"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {t.common.back}
    </button>
  );
}
