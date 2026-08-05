import { NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, EMAIL_RE, isValidDate, withRoute } from './http';

describe('isValidDate', () => {
  it('accepts a well-formed ISO date', () => {
    expect(isValidDate('2026-08-05')).toBe(true);
  });

  it('rejects a non-ISO format', () => {
    expect(isValidDate('08/05/2026')).toBe(false);
  });

  it('rejects a non-date string', () => {
    expect(isValidDate('not-a-date')).toBe(false);
  });

  it('rejects an out-of-range month', () => {
    expect(isValidDate('2026-13-40')).toBe(false);
  });
});

describe('EMAIL_RE', () => {
  it('accepts a well-formed email', () => {
    expect(EMAIL_RE.test('jane@example.com')).toBe(true);
  });

  it('rejects a string without a domain', () => {
    expect(EMAIL_RE.test('jane@')).toBe(false);
  });

  it('rejects a string without an @', () => {
    expect(EMAIL_RE.test('not-an-email')).toBe(false);
  });
});

describe('withRoute', () => {
  const fakeReq = {} as Request;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes through a successful response unchanged', async () => {
    const handler = withRoute('GET /test', async () => NextResponse.json({ ok: true }));
    const res = await handler(fakeReq, undefined);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('converts a thrown ApiError into its status and message', async () => {
    const handler = withRoute('GET /test', async () => {
      throw new ApiError(404, 'Stay not found');
    });
    const res = await handler(fakeReq, undefined);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Stay not found' });
  });

  it('converts an unexpected error into a 500 without leaking its message', async () => {
    const handler = withRoute('GET /test', async () => {
      throw new Error('unexpected database explosion');
    });
    const res = await handler(fakeReq, undefined);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal server error' });
  });
});
