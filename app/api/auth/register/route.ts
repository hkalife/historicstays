import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { sanitizeText } from '@/lib/forms/sanitize';
import { ApiError, EMAIL_RE, parseJsonBody, withRoute } from '@/lib/http';
import { mapUserRow } from '@/lib/mappers';

export const POST = withRoute('POST /api/auth/register', async (req) => {
  const body = await parseJsonBody(req);
  const name = typeof body.name === 'string' ? sanitizeText(body.name.trim()) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name || name.length > FIELD_LIMITS.name) {
    throw new ApiError(400, `name is required (max ${FIELD_LIMITS.name} characters)`);
  }
  if (!EMAIL_RE.test(email) || email.length > FIELD_LIMITS.email) {
    throw new ApiError(400, 'a valid email is required');
  }
  if (!password || password.length < 4 || password.length > FIELD_LIMITS.password) {
    throw new ApiError(400, `password must be 4-${FIELD_LIMITS.password} characters`);
  }

  const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
  if (existing.rows.length > 0) throw new ApiError(409, 'An account with this email already exists');

  const user = { id: randomUUID(), name, email, password };
  await db.execute({
    sql: 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    args: [user.id, user.name, user.email, user.password],
  });

  return NextResponse.json({ user: mapUserRow(user) }, { status: 201 });
});
