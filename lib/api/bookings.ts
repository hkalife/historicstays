import type { Booking } from '@/lib/mappers';
import { apiClient } from './client';

export type CreateBookingInput = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  guestName: string;
  guestEmail: string;
  userId?: string;
};

export type BookingWithStay = Booking & {
  stayName: string;
  stayImage: string | null;
  cityName: string;
};

export type BookingDetail = Booking & {
  stayName: string;
  stayImage: string | null;
  stayAddress: string;
  cityName: string;
  country: string;
};

export function getBookings(userId: string): Promise<{ bookings: BookingWithStay[] }> {
  return apiClient.get(`/api/bookings?userId=${encodeURIComponent(userId)}`);
}

export function getBooking(id: string): Promise<{ booking: BookingDetail }> {
  return apiClient.get(`/api/bookings/${id}`);
}

export function createBooking(input: CreateBookingInput): Promise<{ booking: Booking }> {
  return apiClient.post('/api/bookings', input);
}
