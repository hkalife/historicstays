import { BookingConfirmationView } from '@/components/booking/booking-confirmation-view';

export default async function BookingConfirmationPage({ params }: PageProps<'/bookings/[id]'>) {
  const { id } = await params;
  return <BookingConfirmationView bookingId={id} />;
}
