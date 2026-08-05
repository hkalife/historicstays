import Link from 'next/link';
import { AuthButtons } from './auth-buttons';
import { LanguageDropdown } from './language-dropdown';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          HistoricStays
        </Link>
        <div className="flex items-center gap-3">
          <LanguageDropdown />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
