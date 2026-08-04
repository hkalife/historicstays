import type { User } from '@/lib/mappers';
import { apiClient } from './client';

export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput = { email: string; password: string };

export function register(input: RegisterInput): Promise<{ user: User }> {
  return apiClient.post('/api/auth/register', input);
}

export function login(input: LoginInput): Promise<{ user: User }> {
  return apiClient.post('/api/auth/login', input);
}
