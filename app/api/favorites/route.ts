import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiError, parseJsonBody, withRoute } from '@/lib/http';
import { mapStayWithCity, type StayRow } from '@/lib/mappers';

export const GET = withRoute('GET /api/favorites', async (req) => {
  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) throw new ApiError(400, 'userId query param is required');

  const result = await db.execute({
    sql: `SELECT stays.*, cities.name as city_name, cities.country as country
          FROM favorites
          JOIN stays ON stays.id = favorites.stay_id
          JOIN cities ON cities.id = stays.city_id
          WHERE favorites.user_id = ?`,
    args: [userId],
  });

  return NextResponse.json({
    stays: result.rows.map((row) =>
      mapStayWithCity(row as unknown as StayRow & { city_name: string; country: string })
    ),
  });
});

export const POST = withRoute('POST /api/favorites', async (req) => {
  const body = await parseJsonBody(req);
  const userId = typeof body.userId === 'string' ? body.userId : '';
  const stayId = typeof body.stayId === 'string' ? body.stayId : '';
  if (!userId || !stayId) throw new ApiError(400, 'userId and stayId are required');

  const user = await db.execute({ sql: 'SELECT id FROM users WHERE id = ?', args: [userId] });
  if (user.rows.length === 0) throw new ApiError(404, 'User not found');
  const stay = await db.execute({ sql: 'SELECT id FROM stays WHERE id = ?', args: [stayId] });
  if (stay.rows.length === 0) throw new ApiError(404, 'Stay not found');

  await db.execute({
    sql: 'INSERT OR IGNORE INTO favorites (user_id, stay_id) VALUES (?, ?)',
    args: [userId, stayId],
  });

  return NextResponse.json({ ok: true }, { status: 201 });
});

export const DELETE = withRoute('DELETE /api/favorites', async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const stayId = url.searchParams.get('stayId');
  if (!userId || !stayId) {
    throw new ApiError(400, 'userId and stayId query params are required');
  }

  await db.execute({
    sql: 'DELETE FROM favorites WHERE user_id = ? AND stay_id = ?',
    args: [userId, stayId],
  });

  return NextResponse.json({ ok: true });
});
