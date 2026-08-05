import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isStayAvailable, nightsBetween } from '@/lib/availability';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { sanitizeText } from '@/lib/forms/sanitize';
import { ApiError, EMAIL_RE, isValidDate, parseJsonBody, withRoute } from '@/lib/http';
import { mapStayRow, type StayRow } from '@/lib/mappers';

export const GET = withRoute('GET /api/bookings', async (req) => {
  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) throw new ApiError(400, 'userId query param is required');

  const result = await db.execute({
    sql: `SELECT bookings.*, stays.name as stay_name, stays.images as stay_images, cities.name as city_name
          FROM bookings
          JOIN stays ON stays.id = bookings.stay_id
          JOIN cities ON cities.id = stays.city_id
          WHERE bookings.user_id = ?
          ORDER BY bookings.created_at DESC`,
    args: [userId],
  });

  const bookings = result.rows.map((row) => {
    const r = row as unknown as {
      id: string;
      stay_id: string;
      user_id: string | null;
      guest_name: string;
      guest_email: string;
      check_in: string;
      check_out: string;
      guests_count: number;
      total_price: number;
      status: string;
      created_at: string;
      stay_name: string;
      stay_images: string;
      city_name: string;
    };
    return {
      id: r.id,
      stayId: r.stay_id,
      userId: r.user_id,
      guestName: r.guest_name,
      guestEmail: r.guest_email,
      checkIn: r.check_in,
      checkOut: r.check_out,
      guestsCount: r.guests_count,
      totalPrice: r.total_price,
      status: r.status,
      createdAt: r.created_at,
      stayName: r.stay_name,
      stayImage: (JSON.parse(r.stay_images) as string[])[0] ?? null,
      cityName: r.city_name,
    };
  });

  return NextResponse.json({ bookings });
});

export const POST = withRoute('POST /api/bookings', async (req) => {
  const body = await parseJsonBody(req);

  const stayId = typeof body.stayId === 'string' ? body.stayId : '';
  const checkIn = typeof body.checkIn === 'string' ? body.checkIn : '';
  const checkOut = typeof body.checkOut === 'string' ? body.checkOut : '';
  const guestsCount = Number(body.guestsCount);
  const guestName = typeof body.guestName === 'string' ? sanitizeText(body.guestName.trim()) : '';
  const guestEmail = typeof body.guestEmail === 'string' ? body.guestEmail.trim() : '';
  const userId = typeof body.userId === 'string' && body.userId ? body.userId : null;

  if (!stayId) throw new ApiError(400, 'stayId is required');
  if (!isValidDate(checkIn) || !isValidDate(checkOut) || checkIn >= checkOut) {
    throw new ApiError(400, 'checkIn/checkOut must be valid dates with checkIn before checkOut');
  }
  if (!guestName || guestName.length > FIELD_LIMITS.name) {
    throw new ApiError(400, `guestName is required (max ${FIELD_LIMITS.name} characters)`);
  }
  if (!EMAIL_RE.test(guestEmail) || guestEmail.length > FIELD_LIMITS.email) {
    throw new ApiError(400, 'guestEmail must be a valid email');
  }
  if (!Number.isInteger(guestsCount) || guestsCount < 1) {
    throw new ApiError(400, 'guestsCount must be a positive integer');
  }

  const stayResult = await db.execute({ sql: 'SELECT * FROM stays WHERE id = ?', args: [stayId] });
  const stayRow = stayResult.rows[0];
  if (!stayRow) throw new ApiError(404, 'Stay not found');
  const stay = mapStayRow(stayRow as unknown as StayRow);

  if (guestsCount > stay.maxGuests) {
    throw new ApiError(400, `This stay allows a maximum of ${stay.maxGuests} guests`);
  }

  const bookingsResult = await db.execute({
    sql: `SELECT check_in, check_out FROM bookings WHERE stay_id = ? AND status != 'cancelled'`,
    args: [stayId],
  });
  const existing = (
    bookingsResult.rows as unknown as { check_in: string; check_out: string }[]
  ).map((r) => ({ checkIn: r.check_in, checkOut: r.check_out }));

  if (!isStayAvailable(stay.blockedDates, existing, checkIn, checkOut)) {
    throw new ApiError(409, 'Stay is not available for the selected dates');
  }

  const totalPrice = nightsBetween(checkIn, checkOut) * stay.pricePerNight;

  const booking = {
    id: randomUUID(),
    stayId,
    userId,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    guestsCount,
    totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  await db.execute({
    sql: `INSERT INTO bookings
      (id, stay_id, user_id, guest_name, guest_email, check_in, check_out, guests_count, total_price, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      booking.id,
      booking.stayId,
      booking.userId,
      booking.guestName,
      booking.guestEmail,
      booking.checkIn,
      booking.checkOut,
      booking.guestsCount,
      booking.totalPrice,
      booking.status,
      booking.createdAt,
    ],
  });

  return NextResponse.json({ booking }, { status: 201 });
});
