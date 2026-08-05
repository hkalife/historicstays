import { NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function parseJsonBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (typeof body !== 'object' || body === null) throw new Error('not an object');
    return body as Record<string, unknown>;
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON');
  }
}

export function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function logRequest(route: string, status: number, startedAt: number) {
  const ms = Date.now() - startedAt;
  console.log(`[api] ${route} -> ${status} (${ms}ms)`);
}

/** Wraps a route handler with consistent error responses and request logging. */
export function withRoute<Ctx = unknown>(
  route: string,
  handler: (req: Request, ctx: Ctx) => Promise<NextResponse>
) {
  return async (req: Request, ctx: Ctx): Promise<NextResponse> => {
    const startedAt = Date.now();
    try {
      const res = await handler(req, ctx);
      logRequest(route, res.status, startedAt);
      return res;
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 500;
      if (!(err instanceof ApiError)) {
        console.error(`[api] ${route} unexpected error`, err);
      }
      logRequest(route, status, startedAt);
      const message = err instanceof ApiError ? err.message : 'Internal server error';
      return NextResponse.json({ error: message }, { status });
    }
  };
}
