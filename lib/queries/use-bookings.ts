import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  getBooking,
  getBookings,
  type CreateBookingInput,
} from '@/lib/api/bookings';

export function useBookingsQuery(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => getBookings(userId),
    enabled: Boolean(userId),
  });
}

export function useBookingQuery(id: string) {
  return useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: () => getBooking(id),
    enabled: Boolean(id),
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stays', variables.stayId] });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ['bookings', variables.userId] });
      }
    },
  });
}
