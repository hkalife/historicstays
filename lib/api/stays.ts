import type { StayWithCity } from '@/lib/mappers';
import { apiClient } from './client';

export type StaySearchFilters = {
  city?: string;
  query?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating_desc';
};

function buildQueryString(filters: StaySearchFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function getStays(filters: StaySearchFilters = {}): Promise<{ stays: StayWithCity[] }> {
  return apiClient.get(`/api/stays${buildQueryString(filters)}`);
}

export function getStay(id: string): Promise<{ stay: StayWithCity }> {
  return apiClient.get(`/api/stays/${id}`);
}

export type BookedRange = { checkIn: string; checkOut: string };

export function getStayAvailability(id: string): Promise<{ bookedRanges: BookedRange[] }> {
  return apiClient.get(`/api/stays/${id}/availability`);
}
