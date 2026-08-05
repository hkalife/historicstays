import type { ReactNode } from 'react';

export function SearchFieldShell({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
      <span className="text-foreground/50">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-xs font-medium text-foreground/60">{label}</span>
        {children}
      </div>
    </div>
  );
}
