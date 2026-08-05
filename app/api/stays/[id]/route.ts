import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiError, withRoute } from '@/lib/http';
import { mapStayWithCity, type StayRow } from '@/lib/mappers';

export const GET = withRoute<RouteContext<'/api/stays/[id]'>>(
  'GET /api/stays/[id]',
  async (_req, ctx) => {
    const { id } = await ctx.params;

    const result = await db.execute({
      sql: `SELECT stays.*, cities.name as city_name, cities.country as country
            FROM stays
            JOIN cities ON cities.id = stays.city_id
            WHERE stays.id = ?`,
      args: [id],
    });

    const row = result.rows[0];
    if (!row) throw new ApiError(404, 'Stay not found');

    return NextResponse.json({
      stay: mapStayWithCity(row as unknown as StayRow & { city_name: string; country: string }),
    });
  }
);
