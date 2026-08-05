import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { ApiError, EMAIL_RE, parseJsonBody, withRoute } from '@/lib/http';
import { mapUserRow, type UserRow } from '@/lib/mappers';

export const POST = withRoute('POST /api/auth/login', async (req) => {
  const body = await parseJsonBody(req);
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_RE.test(email) || email.length > FIELD_LIMITS.email) {
    throw new ApiError(400, 'email and password are required');
  }
  if (!password || password.length > FIELD_LIMITS.password) {
    throw new ApiError(400, 'email and password are required');
  }

  const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
  const row = result.rows[0] as unknown as UserRow | undefined;

  if (!row || row.password !== password) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return NextResponse.json({ user: mapUserRow(row) });
});
