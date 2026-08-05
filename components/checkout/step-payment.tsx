'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/lib/i18n/use-translations';

export function StepPayment({
  onBack,
  onConfirm,
  isSubmitting,
  errorMessage,
}: {
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  errorMessage?: string;
}) {
  const t = useTranslations();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const canConfirm =
    cardName.trim().length > 0 &&
    /^\d{13,19}$/.test(cardNumber.replace(/\s/g, '')) &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvv);

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        {t.checkout.paymentStep.title}
      </h2>
      <p className="mt-2 rounded-lg bg-background px-4 py-3 text-sm text-foreground/70">
        {t.checkout.paymentStep.mockNotice}
      </p>

      <div className="mt-4">
        <label htmlFor="card-name" className="text-xs font-medium text-foreground/60">
          {t.checkout.paymentStep.cardNameLabel}
        </label>
        <input
          id="card-name"
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Jane Doe"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="card-number" className="text-xs font-medium text-foreground/60">
          {t.checkout.paymentStep.cardNumberLabel}
        </label>
        <input
          id="card-number"
          type="text"
          inputMode="numeric"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="4111 1111 1111 1111"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <label htmlFor="card-expiry" className="text-xs font-medium text-foreground/60">
            {t.checkout.paymentStep.expiryLabel}
          </label>
          <input
            id="card-expiry"
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/AA"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="card-cvv" className="text-xs font-medium text-foreground/60">
            {t.checkout.paymentStep.cvvLabel}
          </label>
          <input
            id="card-cvv"
            type="text"
            inputMode="numeric"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {errorMessage && <p className="mt-3 text-sm text-accent">{errorMessage}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 cursor-pointer rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background active:opacity-70"
        >
          {t.checkout.paymentStep.backButton}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm || isSubmitting}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? t.checkout.paymentStep.confirming : t.checkout.paymentStep.confirmButton}
        </button>
      </div>
    </div>
  );
}
