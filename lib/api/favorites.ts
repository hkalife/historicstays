import type { StayWithCity } from '@/lib/mappers';
import { apiClient } from './client';

export function getFavorites(userId: string): Promise<{ stays: StayWithCity[] }> {
  return apiClient.get(`/api/favorites?userId=${encodeURIComponent(userId)}`);
}

export function addFavorite(userId: string, stayId: string): Promise<{ ok: true }> {
  return apiClient.post('/api/favorites', { userId, stayId });
}

export function removeFavorite(userId: string, stayId: string): Promise<{ ok: true }> {
  return apiClient.delete(
    `/api/favorites?userId=${encodeURIComponent(userId)}&stayId=${encodeURIComponent(stayId)}`
  );
}
