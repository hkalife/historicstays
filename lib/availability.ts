export type DateRange = { checkIn: string; checkOut: string };

function toTime(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getTime();
}

/** Half-open interval overlap: [aStart, aEnd) vs [bStart, bEnd). */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toTime(aStart) < toTime(bEnd) && toTime(bStart) < toTime(aEnd);
}

export function isDateRangeBlocked(blockedDates: string[], checkIn: string, checkOut: string): boolean {
  const start = toTime(checkIn);
  const end = toTime(checkOut);
  return blockedDates.some((date) => {
    const t = toTime(date);
    return t >= start && t < end;
  });
}

export function hasBookingConflict(bookings: DateRange[], checkIn: string, checkOut: string): boolean {
  return bookings.some((booking) => rangesOverlap(booking.checkIn, booking.checkOut, checkIn, checkOut));
}

export function isStayAvailable(
  blockedDates: string[],
  existingBookings: DateRange[],
  checkIn: string,
  checkOut: string
): boolean {
  if (toTime(checkIn) >= toTime(checkOut)) return false;
  if (isDateRangeBlocked(blockedDates, checkIn, checkOut)) return false;
  if (hasBookingConflict(existingBookings, checkIn, checkOut)) return false;
  return true;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((toTime(checkOut) - toTime(checkIn)) / 86_400_000);
}
