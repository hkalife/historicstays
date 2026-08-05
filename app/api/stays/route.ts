import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isStayAvailable, type DateRange } from '@/lib/availability';
import { ApiError, isValidDate, withRoute } from '@/lib/http';
import { mapStayWithCity, type StayRow } from '@/lib/mappers';

export const GET = withRoute('GET /api/stays', async (req) => {
  const params = new URL(req.url).searchParams;

  const city = params.get('city');
  const query = params.get('query')?.trim();
  const checkIn = params.get('checkIn') || undefined;
  const checkOut = params.get('checkOut') || undefined;
  const guests = params.has('guests') ? Number(params.get('guests')) : undefined;
  const minPrice = params.has('minPrice') ? Number(params.get('minPrice')) : undefined;
  const maxPrice = params.has('maxPrice') ? Number(params.get('maxPrice')) : undefined;
  const sort = params.get('sort') || undefined;

  if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
    throw new ApiError(400, 'checkIn and checkOut must be provided together');
  }
  if (checkIn && checkOut) {
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      throw new ApiError(400, 'checkIn/checkOut must be valid dates (YYYY-MM-DD)');
    }
    if (checkIn >= checkOut) {
      throw new ApiError(400, 'checkIn must be before checkOut');
    }
  }
  if (guests !== undefined && (!Number.isFinite(guests) || guests < 1)) {
    throw new ApiError(400, 'guests must be a positive number');
  }
  if (minPrice !== undefined && !Number.isFinite(minPrice)) {
    throw new ApiError(400, 'minPrice must be a number');
  }
  if (maxPrice !== undefined && !Number.isFinite(maxPrice)) {
    throw new ApiError(400, 'maxPrice must be a number');
  }

  const conditions: string[] = [];
  const args: unknown[] = [];

  if (city) {
    conditions.push('stays.city_id = ?');
    args.push(city);
  }
  if (query) {
    conditions.push('(stays.name LIKE ? OR cities.name LIKE ? OR stays.address LIKE ?)');
    const like = `%${query}%`;
    args.push(like, like, like);
  }
  if (guests !== undefined) {
    conditions.push('stays.max_guests >= ?');
    args.push(guests);
  }
  if (minPrice !== undefined) {
    conditions.push('stays.price_per_night >= ?');
    args.push(minPrice);
  }
  if (maxPrice !== undefined) {
    conditions.push('stays.price_per_night <= ?');
    args.push(maxPrice);
  }

  const orderBy =
    sort === 'price_asc'
      ? 'stays.price_per_night ASC'
      : sort === 'price_desc'
        ? 'stays.price_per_night DESC'
        : 'stays.rating DESC';

  const sql = `
    SELECT stays.*, cities.name as city_name, cities.country as country
    FROM stays
    JOIN cities ON cities.id = stays.city_id
    ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
    ORDER BY ${orderBy}
  `;

  const result = await db.execute({ sql, args: args as (string | number)[] });
  let stays = result.rows.map((row) =>
    mapStayWithCity(row as unknown as StayRow & { city_name: string; country: string })
  );

  if (checkIn && checkOut) {
    const bookingsResult = await db.execute({
      sql: `SELECT stay_id, check_in, check_out FROM bookings WHERE status != 'cancelled'`,
      args: [],
    });
    const bookingsByStay = new Map<string, DateRange[]>();
    for (const row of bookingsResult.rows as unknown as {
      stay_id: string;
      check_in: string;
      check_out: string;
    }[]) {
      const list = bookingsByStay.get(row.stay_id) ?? [];
      list.push({ checkIn: row.check_in, checkOut: row.check_out });
      bookingsByStay.set(row.stay_id, list);
    }

    stays = stays.filter((stay) =>
      isStayAvailable(stay.blockedDates, bookingsByStay.get(stay.id) ?? [], checkIn, checkOut)
    );
  }

  return NextResponse.json({ stays });
});
