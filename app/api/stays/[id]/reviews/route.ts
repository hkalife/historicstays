import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiError, parseJsonBody, withRoute } from '@/lib/http';
import { mapReviewRow, type ReviewRow } from '@/lib/mappers';

async function assertStayExists(id: string) {
  const result = await db.execute({ sql: 'SELECT id FROM stays WHERE id = ?', args: [id] });
  if (result.rows.length === 0) throw new ApiError(404, 'Stay not found');
}

export const GET = withRoute<RouteContext<'/api/stays/[id]/reviews'>>(
  'GET /api/stays/[id]/reviews',
  async (_req, ctx) => {
    const { id } = await ctx.params;
    await assertStayExists(id);

    const result = await db.execute({
      sql: `SELECT * FROM reviews WHERE stay_id = ? AND status = 'approved' ORDER BY created_at DESC`,
      args: [id],
    });

    return NextResponse.json({
      reviews: result.rows.map((row) => mapReviewRow(row as unknown as ReviewRow)),
    });
  }
);

export const POST = withRoute<RouteContext<'/api/stays/[id]/reviews'>>(
  'POST /api/stays/[id]/reviews',
  async (req, ctx) => {
    const { id } = await ctx.params;
    await assertStayExists(id);

    const body = await parseJsonBody(req);
    const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : '';
    const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
    const rating = Number(body.rating);

    if (!authorName || authorName.length > 80) {
      throw new ApiError(400, 'authorName is required (max 80 characters)');
    }
    if (!comment || comment.length > 1000) {
      throw new ApiError(400, 'comment is required (max 1000 characters)');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ApiError(400, 'rating must be an integer between 1 and 5');
    }

    const review = {
      id: randomUUID(),
      stayId: id,
      authorName,
      rating,
      comment,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'approved',
    };

    await db.execute({
      sql: `INSERT INTO reviews (id, stay_id, author_name, rating, comment, created_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        review.id,
        review.stayId,
        review.authorName,
        review.rating,
        review.comment,
        review.createdAt,
        review.status,
      ],
    });

    return NextResponse.json({ review }, { status: 201 });
  }
);
