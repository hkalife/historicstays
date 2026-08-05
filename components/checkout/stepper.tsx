import { Check } from 'lucide-react';

type StepStatus = 'done' | 'active' | 'upcoming';

const CIRCLE_CLASSES: Record<StepStatus, string> = {
  done: 'bg-primary text-primary-foreground',
  active: 'border-2 border-primary text-primary',
  upcoming: 'border border-border text-foreground/40',
};

export function Stepper({ current, labels }: { current: 1 | 2 | 3; labels: [string, string, string] }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {labels.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const isDone = step < current;
        const isActive = step === current;

        let status: StepStatus = 'upcoming';
        if (isDone) {
          status = 'done';
        } else if (isActive) {
          status = 'active';
        }
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${CIRCLE_CLASSES[status]}`}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : step}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive || isDone ? 'text-foreground' : 'text-foreground/40'
                }`}
              >
                {label}
              </span>
            </div>
            {step < 3 && <div className={`h-px flex-1 ${isDone ? 'bg-primary' : 'bg-border'}`} />}
          </li>
        );
      })}
    </ol>
  );
}
