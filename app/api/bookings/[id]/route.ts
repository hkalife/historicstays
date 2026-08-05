import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiError, withRoute } from '@/lib/http';

export const GET = withRoute<RouteContext<'/api/bookings/[id]'>>(
  'GET /api/bookings/[id]',
  async (_req, ctx) => {
    const { id } = await ctx.params;

    const result = await db.execute({
      sql: `SELECT bookings.*, stays.name as stay_name, stays.images as stay_images,
                   stays.address as stay_address, cities.name as city_name, cities.country as country
            FROM bookings
            JOIN stays ON stays.id = bookings.stay_id
            JOIN cities ON cities.id = stays.city_id
            WHERE bookings.id = ?`,
      args: [id],
    });

    const row = result.rows[0];
    if (!row) throw new ApiError(404, 'Booking not found');

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
      stay_address: string;
      city_name: string;
      country: string;
    };

    const booking = {
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
      stayAddress: r.stay_address,
      cityName: r.city_name,
      country: r.country,
    };

    return NextResponse.json({ booking });
  }
);
