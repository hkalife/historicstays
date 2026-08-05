import { describe, expect, it } from 'vitest';
import {
  hasBookingConflict,
  isDateRangeBlocked,
  isStayAvailable,
  nightsBetween,
} from './availability';

describe('nightsBetween', () => {
  it('computes the number of nights between two dates', () => {
    expect(nightsBetween('2026-08-10', '2026-08-13')).toBe(3);
  });

  it('returns 0 for the same date', () => {
    expect(nightsBetween('2026-08-10', '2026-08-10')).toBe(0);
  });
});

describe('isDateRangeBlocked', () => {
  const blockedDates = ['2026-08-15', '2026-08-16'];

  it('detects a blocked date inside the range', () => {
    expect(isDateRangeBlocked(blockedDates, '2026-08-13', '2026-08-19')).toBe(true);
  });

  it('returns false when no blocked date falls in the range', () => {
    expect(isDateRangeBlocked(blockedDates, '2026-08-01', '2026-08-05')).toBe(false);
  });

  it('treats checkout day as free (half-open interval)', () => {
    // blocked date is exactly the checkout day — guest leaves that morning, so it's not "inside" the stay
    expect(isDateRangeBlocked(['2026-08-16'], '2026-08-13', '2026-08-16')).toBe(false);
  });
});

describe('hasBookingConflict', () => {
  const existing = [{ checkIn: '2026-08-15', checkOut: '2026-08-17' }];

  it('detects overlap with an existing booking', () => {
    expect(hasBookingConflict(existing, '2026-08-13', '2026-08-19')).toBe(true);
  });

  it('returns false when ranges do not overlap', () => {
    expect(hasBookingConflict(existing, '2026-09-01', '2026-09-03')).toBe(false);
  });
});

describe('isStayAvailable', () => {
  it('rejects a range that spans over a blocked date in the middle (the calendar bug case)', () => {
    // days 15-16 are blocked; 13 -> 19 must be rejected even though the endpoints themselves are free
    expect(isStayAvailable(['2026-08-15', '2026-08-16'], [], '2026-08-13', '2026-08-19')).toBe(
      false
    );
  });

  it('rejects a range that conflicts with an existing booking', () => {
    const existing = [{ checkIn: '2026-08-15', checkOut: '2026-08-17' }];
    expect(isStayAvailable([], existing, '2026-08-13', '2026-08-19')).toBe(false);
  });

  it('accepts a genuinely free range', () => {
    expect(isStayAvailable(['2026-08-15'], [], '2026-09-01', '2026-09-03')).toBe(true);
  });

  it('rejects an inverted or empty range', () => {
    expect(isStayAvailable([], [], '2026-09-03', '2026-09-01')).toBe(false);
  });
});
