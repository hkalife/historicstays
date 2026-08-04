'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarRange } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { enGB, es, ptBR } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import type { Locale } from '@/lib/i18n/dictionaries';
import { useLocale, useLocaleTag, useTranslations } from '@/lib/i18n/use-translations';
import { useSearchStore } from '@/lib/stores/search-store';
import { SearchFieldShell } from './search-field-shell';

const DAY_PICKER_LOCALES: Record<Locale, typeof enGB> = { en: enGB, pt: ptBR, es };

const calendarStyle = {
  '--rdp-accent-color': '#2f4a3c',
  '--rdp-accent-background-color': '#e9ede7',
} as CSSProperties;

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateRangeField() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const setDateRange = useSearchStore((state) => state.setDateRange);
  const t = useTranslations();
  const locale = useLocale();
  const localeTag = useLocaleTag();

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(localeTag, { weekday: 'short', day: 'numeric', month: 'short' }),
    [localeTag]
  );

  const rangeLabel = !range?.from
    ? t.home.search.datesPlaceholder
    : !range.to
      ? formatter.format(range.from)
      : `${formatter.format(range.from)} — ${formatter.format(range.to)}`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="min-w-0 flex-1 cursor-pointer text-left active:opacity-70">
          <SearchFieldShell
            icon={<CalendarRange className="h-5 w-5" aria-hidden="true" />}
            label={t.home.search.datesLabel}
          >
            <span className="truncate text-sm font-medium text-foreground">{rangeLabel}</span>
          </SearchFieldShell>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-lg border border-border bg-white p-3 shadow-lg"
        >
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={range}
            onSelect={(nextRange) => {
              setRange(nextRange);
              setDateRange(
                nextRange?.from ? toISODate(nextRange.from) : undefined,
                nextRange?.to ? toISODate(nextRange.to) : undefined
              );
            }}
            disabled={{ before: new Date() }}
            locale={DAY_PICKER_LOCALES[locale]}
            style={calendarStyle}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
