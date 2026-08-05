import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiError, withRoute } from '@/lib/http';

export const GET = withRoute<RouteContext<'/api/stays/[id]/availability'>>(
  'GET /api/stays/[id]/availability',
  async (_req, ctx) => {
    const { id } = await ctx.params;

    const stay = await db.execute({ sql: 'SELECT id FROM stays WHERE id = ?', args: [id] });
    if (stay.rows.length === 0) throw new ApiError(404, 'Stay not found');

    const result = await db.execute({
      sql: `SELECT check_in, check_out FROM bookings WHERE stay_id = ? AND status != 'cancelled'`,
      args: [id],
    });

    const bookedRanges = (
      result.rows as unknown as { check_in: string; check_out: string }[]
    ).map((r) => ({ checkIn: r.check_in, checkOut: r.check_out }));

    return NextResponse.json({ bookedRanges });
  }
);
