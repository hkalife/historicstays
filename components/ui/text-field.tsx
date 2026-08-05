'use client';

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { sanitizeText } from '@/lib/forms/sanitize';

const inputClassName =
  'mt-1 w-full rounded-lg border px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2';

function borderClassName(hasError: boolean) {
  return hasError
    ? 'border-accent focus:border-accent focus:ring-accent/30'
    : 'border-border focus:border-accent focus:ring-accent/30';
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  hint?: string;
  error?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'value' | 'onChange' | 'maxLength' | 'className'
>;

export function TextField({
  id,
  label,
  value,
  onChange,
  maxLength,
  hint,
  error,
  ...rest
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-foreground/60">
        {label}
      </label>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(sanitizeText(e.target.value))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClassName} ${borderClassName(Boolean(error))}`}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-accent">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-foreground/50">{hint}</p>
      )}
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  error?: string;
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'value' | 'onChange' | 'maxLength' | 'className'
>;

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  maxLength,
  error,
  ...rest
}: TextAreaFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-foreground/60">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(sanitizeText(e.target.value))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClassName} ${borderClassName(Boolean(error))}`}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
