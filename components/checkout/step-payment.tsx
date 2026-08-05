'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { TextField } from '@/components/ui/text-field';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { formatCardNumber, formatCvv, formatExpiry, isExpiryValid } from '@/lib/forms/payment';
import { useTranslations } from '@/lib/i18n/use-translations';

type TouchedFields = { cardName: boolean; cardNumber: boolean; expiry: boolean; cvv: boolean };

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
  const [touched, setTouched] = useState<TouchedFields>({
    cardName: false,
    cardNumber: false,
    expiry: false,
    cvv: false,
  });

  const isCardNameValid = cardName.trim().length > 0;
  const isCardNumberValid = /^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''));
  const isExpiryFieldValid = isExpiryValid(expiry);
  const isCvvValid = /^\d{3,4}$/.test(cvv);
  const canConfirm = isCardNameValid && isCardNumberValid && isExpiryFieldValid && isCvvValid;

  function markTouched(field: keyof TouchedFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        {t.checkout.paymentStep.title}
      </h2>
      <p className="mt-2 rounded-lg bg-background px-4 py-3 text-sm text-foreground/70">
        {t.checkout.paymentStep.mockNotice}
      </p>

      <div className="mt-4">
        <TextField
          id="card-name"
          type="text"
          label={t.checkout.paymentStep.cardNameLabel}
          value={cardName}
          onChange={setCardName}
          onBlur={() => markTouched('cardName')}
          maxLength={FIELD_LIMITS.cardName}
          placeholder="Jane Doe"
          error={touched.cardName && !isCardNameValid ? t.checkout.paymentStep.cardNameError : undefined}
        />
      </div>

      <div className="mt-4">
        <TextField
          id="card-number"
          type="text"
          inputMode="numeric"
          label={t.checkout.paymentStep.cardNumberLabel}
          value={cardNumber}
          onChange={(value) => setCardNumber(formatCardNumber(value))}
          onBlur={() => markTouched('cardNumber')}
          maxLength={23}
          placeholder="4111 1111 1111 1111"
          error={
            touched.cardNumber && !isCardNumberValid
              ? t.checkout.paymentStep.cardNumberError
              : undefined
          }
        />
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <TextField
            id="card-expiry"
            type="text"
            inputMode="numeric"
            label={t.checkout.paymentStep.expiryLabel}
            value={expiry}
            onChange={(value) => setExpiry(formatExpiry(value))}
            onBlur={() => markTouched('expiry')}
            maxLength={5}
            placeholder="MM/AA"
            error={
              touched.expiry && !isExpiryFieldValid ? t.checkout.paymentStep.expiryError : undefined
            }
          />
        </div>
        <div className="flex-1">
          <TextField
            id="card-cvv"
            type="text"
            inputMode="numeric"
            label={t.checkout.paymentStep.cvvLabel}
            value={cvv}
            onChange={(value) => setCvv(formatCvv(value))}
            onBlur={() => markTouched('cvv')}
            maxLength={4}
            placeholder="123"
            error={touched.cvv && !isCvvValid ? t.checkout.paymentStep.cvvError : undefined}
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
