import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatCardNumber, formatCvv, formatExpiry, isExpiryValid } from './payment';

describe('formatCardNumber', () => {
  it('groups digits into blocks of 4', () => {
    expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('strips non-digit characters as you type', () => {
    expect(formatCardNumber('4111-abc-1111')).toBe('4111 1111');
  });

  it('caps at 19 digits', () => {
    expect(formatCardNumber('1'.repeat(30)).replace(/\s/g, '')).toHaveLength(19);
  });
});

describe('formatExpiry', () => {
  it('does not insert a slash before the 3rd digit', () => {
    expect(formatExpiry('03')).toBe('03');
  });

  it('auto-inserts the slash after MM', () => {
    expect(formatExpiry('0328')).toBe('03/28');
  });

  it('strips non-digit input', () => {
    expect(formatExpiry('0a3/2x8')).toBe('03/28');
  });
});

describe('formatCvv', () => {
  it('keeps only digits, capped at 4', () => {
    expect(formatCvv('12a3x45')).toBe('1234');
  });
});

describe('isExpiryValid', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-05T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects a month/year in the past', () => {
    expect(isExpiryValid('03/26')).toBe(false);
  });

  it('accepts the current month', () => {
    expect(isExpiryValid('08/26')).toBe(true);
  });

  it('accepts a future month', () => {
    expect(isExpiryValid('09/26')).toBe(true);
  });

  it('rejects an invalid month', () => {
    expect(isExpiryValid('13/26')).toBe(false);
  });

  it('rejects a malformed value', () => {
    expect(isExpiryValid('abcd')).toBe(false);
    expect(isExpiryValid('8/26')).toBe(false);
  });
});
